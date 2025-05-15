import type { UserData } from "./components/data-table";
import { fetchMockData } from "./data/mock-data";
import type { AdvancedFilterCondition } from "./components/advance-filter";

import activeApiConfig from "./active-api.json";
import apiDefinitionsData from "./api-definitions.json";

// --- 1. Definiciones de Tipos ---

interface ApiAuthNone { type: "none"; }
interface ApiAuthBearer { type: "bearer"; tokenValue: string; tokenSource?: "env" | "value"; }
interface ApiAuthApiKey { type: "apiKey"; keyName: string; keyValue: string; in: "header" | "query"; }
type ApiAuthenticationConfig = ApiAuthNone | ApiAuthBearer | ApiAuthApiKey;

interface ApiParamMappings {
  offset?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  searchTerm?: string;
}

interface ApiAdvancedFiltersFormatterConfig {
  paramNameTemplate?: string;
  operatorSuffixMap?: Record<string, string>;
  operatorValueMap?: Record<string, string>;
  postStructure?: "flat_operator_in_key" | "array_of_objects";
  postFilterArrayKey?: string;
  postFieldKey?: string;
  postOperatorKey?: string;
  postValueKey?: string;
  valueWrapper?: string;
}

interface ApiResponseMapping {
  dataPath: string;
  totalPath?: string;
  totalCalculation?: "estimateFromResponseLength" | "fromPath";
  fields: Record<keyof UserData, string | null>;
}

interface ApiTableDisplayConfig {
  title: string;
  description: string;
  defaultSortBy?: keyof UserData | string;
  allTableColumns: { accessorKey: string; header: string }[];
  filterableColumns: { value: string; label: string }[];
}

interface ApiDefinition {
  displayName: string;
  type: "REST" | "GraphQL" | "SOAP";
  baseUrl: string;
  method?: "GET" | "POST";
  authentication: ApiAuthenticationConfig;
  paramMappings?: ApiParamMappings;
  graphqlConfig?: {
    queryTemplate: string;
    variableMappings: Record<string, string>;
  };
  soapConfig?: {
    action: string;
    requestTemplate: string;
    responseNamespace?: string;
    resultPath: string;
    totalPath?: string;
  };
  advancedFiltersFormatterConfig?: ApiAdvancedFiltersFormatterConfig;
  responseMapping: ApiResponseMapping;
  tableConfig: ApiTableDisplayConfig;
}

export interface FetchDataParams {
  offset?: number;
  limit?: number;
  sortBy?: keyof UserData | string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  advancedFilters?: AdvancedFilterCondition[];
  [key: string]: any;
}

export interface IDataFetcher {
  fetchData(params: FetchDataParams): Promise<{ data: UserData[]; total: number }>;
}

// --- 2. Helper Functions ---
function getNestedValue(obj: any, path: string): any {
  if (!path) return obj;
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  return result;
}

function targetParamsHelper(
    key: string, value: any, method: string,
    queryParams: URLSearchParams, requestBody: Record<string, any>
) {
    if (method === "POST") {
        requestBody[key] = value;
    } else { // GET
        queryParams.append(key, String(value));
    }
}

// Nueva función para aplicar filtros avanzados en el cliente
function applyClientSideAdvancedFilters(
  data: UserData[],
  filters: AdvancedFilterCondition[]
): UserData[] {
  if (!filters || filters.length === 0) {
    return data;
  }

  return data.filter(item => {
    const activeFilters = filters.filter(f => f.field && f.operator && f.value.trim() !== "");
    if (activeFilters.length === 0) return true;

    let itemMatch = true; // Asumimos AND por defecto para la primera condición si no hay operador lógico previo
    
    for (let i = 0; i < activeFilters.length; i++) {
      const filter = activeFilters[i];
      const itemValue = String(item[filter.field as keyof UserData] ?? '').toLowerCase();
      const filterValue = filter.value.toLowerCase();
      let currentConditionEval = false;

      switch (filter.operator) {
        case 'contains': currentConditionEval = itemValue.includes(filterValue); break;
        case 'not_contains': currentConditionEval = !itemValue.includes(filterValue); break;
        case 'equals': currentConditionEval = itemValue === filterValue; break;
        case 'not_equals': currentConditionEval = itemValue !== filterValue; break;
        case 'starts_with': currentConditionEval = itemValue.startsWith(filterValue); break;
        case 'ends_with': currentConditionEval = itemValue.endsWith(filterValue); break;
        // Operadores numéricos o de fecha necesitarían parsing y comparación adecuada
        // case 'greater_than': currentConditionEval = parseFloat(itemValue) > parseFloat(filterValue); break;
        // case 'less_than': currentConditionEval = parseFloat(itemValue) < parseFloat(filterValue); break;
        default: currentConditionEval = true; // Operador desconocido, no filtra
      }

      if (i === 0) {
        itemMatch = currentConditionEval;
      } else {
        const logicalOperator = activeFilters[i-1].logicalOperator; // Operador lógico de la condición ANTERIOR
        if (logicalOperator === 'AND') {
          itemMatch = itemMatch && currentConditionEval;
        } else if (logicalOperator === 'OR') {
          itemMatch = itemMatch || currentConditionEval;
        } else { // Si no hay operador lógico o es desconocido, se asume AND con la previa
          itemMatch = itemMatch && currentConditionEval;
        }
      }
      // Optimización: si es una cadena AND y ya es false, no seguir evaluando para este item.
      if (filter.logicalOperator === 'AND' && !itemMatch && i < activeFilters.length -1) break;
    }
    return itemMatch;
  });
}


// --- 3. createFetcherFromDefinition ---
function createFetcherFromDefinition(definition: ApiDefinition): IDataFetcher {
  return {
    async fetchData(params: FetchDataParams): Promise<{ data: UserData[]; total: number }> {
      const {
        offset = 0,
        limit = 10,
        sortBy = definition.tableConfig.defaultSortBy,
        sortOrder = "asc",
        searchTerm,
        advancedFilters, // Capturamos los filtros avanzados
        ...additionalParams
      } = params;

      const queryParams = new URLSearchParams();
      let requestBody: Record<string, any> = {};
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };

      switch (definition.authentication.type) {
        case "bearer":
          headers["Authorization"] = `Bearer ${definition.authentication.tokenValue}`;
          break;
        case "apiKey":
          if (definition.authentication.in === "header") {
            headers[definition.authentication.keyName] = definition.authentication.keyValue;
          } else {
            queryParams.append(definition.authentication.keyName, definition.authentication.keyValue);
          }
          break;
      }

      const effectiveMethod =
        definition.method || (definition.type === "GraphQL" ? "POST" : "GET");

      // Solo se intentará formatear filtros para la API si existe la configuración para ello
      let serverSideFiltersApplied = false;
      if (definition.type === "REST") {
        if (definition.paramMappings) {
          const pMap = definition.paramMappings;
          if (pMap.offset) targetParamsHelper(pMap.offset, offset, effectiveMethod, queryParams, requestBody);
          if (pMap.limit) targetParamsHelper(pMap.limit, limit, effectiveMethod, queryParams, requestBody);
          if (sortBy && pMap.sortBy) targetParamsHelper(pMap.sortBy, String(sortBy), effectiveMethod, queryParams, requestBody);
          if (sortBy && pMap.sortOrder) targetParamsHelper(pMap.sortOrder, sortOrder, effectiveMethod, queryParams, requestBody);
          if (searchTerm && pMap.searchTerm) targetParamsHelper(pMap.searchTerm, searchTerm, effectiveMethod, queryParams, requestBody);
        }

        if (
          advancedFilters &&
          advancedFilters.length > 0 &&
          definition.advancedFiltersFormatterConfig // Solo si hay config para filtros avanzados
        ) {
          const afConfig = definition.advancedFiltersFormatterConfig;
          serverSideFiltersApplied = true; // Asumimos que se intentarán aplicar
          if (effectiveMethod === "POST") {
            if (afConfig.postStructure === "array_of_objects") {
              const filterArrayKey = afConfig.postFilterArrayKey || "filters";
              requestBody[filterArrayKey] = advancedFilters.map((filter) => {
                const fieldKey = afConfig.postFieldKey || "field";
                const operatorKey = afConfig.postOperatorKey || "operator";
                const valueKey = afConfig.postValueKey || "value";
                let apiOperator = filter.operator;
                if (
                  afConfig.operatorValueMap &&
                  afConfig.operatorValueMap[filter.operator]
                ) {
                  apiOperator = afConfig.operatorValueMap[filter.operator];
                }
                return {
                  [fieldKey]: String(filter.field),
                  [operatorKey]: apiOperator,
                  [valueKey]: afConfig.valueWrapper
                    ? `${afConfig.valueWrapper}${filter.value}${afConfig.valueWrapper}`
                    : filter.value,
                };
              });
            } else {
              advancedFilters.forEach((filter) => {
                if (filter.field && filter.value) {
                  let keyName = String(filter.field);
                  if (
                    afConfig.operatorSuffixMap &&
                    afConfig.operatorSuffixMap[filter.operator]
                  ) {
                    keyName += afConfig.operatorSuffixMap[filter.operator];
                  } else if (
                    afConfig.operatorValueMap &&
                    afConfig.operatorValueMap[filter.operator]
                  ) {
                    keyName += `_${afConfig.operatorValueMap[filter.operator]
                      .replace(/\s+/g, "_")
                      .toLowerCase()}`;
                  }
                  requestBody[keyName] = afConfig.valueWrapper
                    ? `${afConfig.valueWrapper}${filter.value}${afConfig.valueWrapper}`
                    : filter.value;
                }
              });
            }
          } else { // GET
            if (afConfig.paramNameTemplate) {
              const template = afConfig.paramNameTemplate;
              advancedFilters.forEach((filter) => {
                if (filter.field && filter.value) {
                  let operatorForTemplate = filter.operator;
                  let operatorSuffix = "";
                  if (
                    afConfig.operatorSuffixMap &&
                    afConfig.operatorSuffixMap[filter.operator] !== undefined
                  ) {
                    operatorSuffix =
                      afConfig.operatorSuffixMap[filter.operator];
                  } else if (
                    afConfig.operatorValueMap &&
                    afConfig.operatorValueMap[filter.operator] !== undefined
                  ) {
                    operatorForTemplate =
                      afConfig.operatorValueMap[filter.operator];
                  }
                  const paramName = template
                    .replace(/\{field\}/g, String(filter.field))
                    .replace(/\{operatorSuffix\}/g, operatorSuffix)
                    .replace(/\{operator\}/g, operatorForTemplate);
                  const paramValue = afConfig.valueWrapper
                    ? `${afConfig.valueWrapper}${filter.value}${afConfig.valueWrapper}`
                    : filter.value;
                  queryParams.append(paramName, paramValue);
                }
              });
            } else {
              serverSideFiltersApplied = false; // No se pudieron aplicar si falta el template
              console.warn(
                "[Fetcher] GET advanced filters: 'paramNameTemplate' es requerido en 'advancedFiltersFormatterConfig'."
              );
            }
          }
        } else if (advancedFilters && advancedFilters.length > 0) {
            // No hay advancedFiltersFormatterConfig, así que los filtros no se envían al servidor
            serverSideFiltersApplied = false;
        }


        if (effectiveMethod === "POST") {
          requestBody = { ...requestBody, ...additionalParams };
        } else {
          for (const key in additionalParams) {
            if (!queryParams.has(key))
              queryParams.append(key, String(additionalParams[key]));
          }
        }
      } else if (definition.type === "GraphQL" && definition.graphqlConfig) {
        // ... (lógica GraphQL sin cambios, asume que los filtros se manejan en variables)
        const gqlConfig = definition.graphqlConfig;
        const variables: Record<string, any> = {};
        if (gqlConfig.variableMappings.offset) variables[gqlConfig.variableMappings.offset] = offset;
        if (gqlConfig.variableMappings.limit) variables[gqlConfig.variableMappings.limit] = limit;
        if (sortBy && gqlConfig.variableMappings.sortBy) variables[gqlConfig.variableMappings.sortBy] = String(sortBy);
        if (sortOrder && gqlConfig.variableMappings.sortOrder) variables[gqlConfig.variableMappings.sortOrder] = sortOrder;
        if (searchTerm && gqlConfig.variableMappings.searchTerm) variables[gqlConfig.variableMappings.searchTerm] = searchTerm;
        // Aquí se podrían mapear advancedFilters a una estructura de variables GraphQL si se define en graphqlConfig
        requestBody = { query: gqlConfig.queryTemplate, variables: {...variables, ...additionalParams } };
        serverSideFiltersApplied = true; // Asumimos que GraphQL maneja los filtros pasados en variables
      } else if (definition.type === "SOAP" && definition.soapConfig) {
        // ... (lógica SOAP sin cambios)
        headers['Content-Type'] = 'text/xml; charset=utf-8';
        if (definition.soapConfig.action) headers['SOAPAction'] = definition.soapConfig.action;
        let soapBody = definition.soapConfig.requestTemplate;
        soapBody = soapBody.replace("{{offset_divided_by_limit_plus_1}}", String(Math.floor(offset / limit) + 1))
                           .replace("{{limit}}", String(limit))
                           .replace("{{sortBy}}", String(sortBy || ''))
                           .replace("{{sortOrder}}", sortOrder);
        console.warn("[Fetcher] SOAP implementation is a placeholder.");
        serverSideFiltersApplied = true; // Asumimos que SOAP maneja los filtros en su request
      }

      let url = definition.baseUrl;
      if (effectiveMethod === "GET" && queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }

      console.log(`[Fetcher] Requesting: ${effectiveMethod} ${url}`);
      console.log(`[Fetcher] Headers:`, headers);
      if (effectiveMethod === "POST" && definition.type !== "SOAP") {
        console.log(`[Fetcher] Body:`, JSON.stringify(requestBody));
      }

      let responseData: any;

      try {
        const fetchOptions: RequestInit = { method: effectiveMethod, headers: headers };
        if (effectiveMethod === "POST") {
          if (definition.type === "SOAP" && definition.soapConfig) {
            let soapBody = definition.soapConfig.requestTemplate;
            soapBody = soapBody.replace("{{offset_divided_by_limit_plus_1}}", String(Math.floor(offset / limit) + 1))
                               .replace("{{limit}}", String(limit))
                               .replace("{{sortBy}}", String(sortBy || ''))
                               .replace("{{sortOrder}}", sortOrder);
            fetchOptions.body = soapBody;
          } else {
            fetchOptions.body = JSON.stringify(requestBody);
          }
        }

        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
          const errorBodyText = await response.text();
          console.error(`[Fetcher] API Error ${response.status}: ${response.statusText}`, errorBodyText);
          throw new Error(`API request failed: ${response.status} ${errorBodyText}`);
        }

        if (definition.type === "SOAP") {
          // ... (lógica SOAP sin cambios)
          console.warn("[Fetcher] SOAP response parsing not implemented. Returning empty data.");
          return { data: [], total: 0 };
        } else {
          responseData = await response.json();
        }
        console.log("[Fetcher] API Response (parsed):", responseData);

        const rMap = definition.responseMapping;
        let rawDataArray = getNestedValue(responseData, rMap.dataPath) || [];
        if (!Array.isArray(rawDataArray)) {
          console.error("[Fetcher] Data path did not resolve to an array:", rMap.dataPath, rawDataArray);
          rawDataArray = []; // Asegurar que sea un array para el siguiente paso
        }

        let transformedData: UserData[] = rawDataArray.map((item: any) => {
          const userEntry: Partial<UserData> = {};
          (Object.keys(rMap.fields) as Array<keyof UserData>).forEach(userDataKey => {
            const apiPath = rMap.fields[userDataKey];
            if (apiPath) {
              let value = getNestedValue(item, apiPath);
              if (definition.displayName === "JSONPlaceholder Users" && userDataKey === "rol" && typeof value === 'string') {
                value = value.split(" ")[0] || "Viewer";
              }
              (userEntry as any)[userDataKey] = value !== undefined ? String(value) : undefined;
            } else if (userDataKey === "ultimoAcceso") {
              userEntry.ultimoAcceso = new Date().toISOString().split("T")[0];
            } else if (userDataKey === "selected") {
              userEntry.selected = false;
            }
          });
          return {
            id: userEntry.id || String(Date.now() + Math.random()),
            nombreCompleto: userEntry.nombreCompleto || "N/A",
            email: userEntry.email || "N/A",
            rol: userEntry.rol || "Viewer",
            ultimoAcceso: userEntry.ultimoAcceso || new Date().toISOString().split("T")[0],
            selected: userEntry.selected || false,
          } as UserData;
        });

        // Aplicar filtros avanzados en el cliente si no se aplicaron en el servidor
        // y si hay filtros avanzados definidos en los parámetros.
        if (!serverSideFiltersApplied && advancedFilters && advancedFilters.length > 0) {
          console.log("[Fetcher] Applying client-side advanced filters.");
          transformedData = applyClientSideAdvancedFilters(transformedData, advancedFilters);
        }
        
        let totalAfterClientFilter = transformedData.length;

        // Paginación en el cliente después de cualquier filtro de cliente
        const paginatedData = transformedData.slice(offset, offset + limit);
        
        let finalTotal = 0;
        if (serverSideFiltersApplied) { // Si los filtros fueron al servidor, el total es el de la API
             if (rMap.totalCalculation === "estimateFromResponseLength") {
                // Esta estimación es sobre los datos devueltos por la API ANTES del slice de paginación del cliente
                // Si la API ya está paginada, este total es el de la página actual.
                // Si los filtros se aplicaron en el servidor, el total debería venir del servidor.
                finalTotal = Number(getNestedValue(responseData, rMap.totalPath || '')) || transformedData.length; 
                // Si totalPath no existe, usamos transformedData.length ANTES de la paginación del cliente
                // pero DESPUÉS del filtrado del cliente si ocurrió.
                // Esto es complicado. Idealmente, si los filtros son de servidor, el total es de servidor.
                // Si son de cliente, el total es después del filtro de cliente.
             } else if (rMap.totalPath) {
                finalTotal = Number(getNestedValue(responseData, rMap.totalPath)) || 0;
             } else { // Fallback si los filtros fueron al servidor pero no hay cómo obtener el total
                finalTotal = totalAfterClientFilter; // O el total de la página actual si la API paginó
             }
        } else { // Filtros aplicados en cliente (o no había filtros avanzados)
            finalTotal = totalAfterClientFilter;
        }
        
        return { data: paginatedData, total: finalTotal };

      } catch (error) {
        console.error("[Fetcher] Fetch processing error:", error);
        return { data: [], total: 0 };
      }
    },
  };
}

// --- 4. Configuración Principal ---
// ... (resto del archivo sin cambios)
const apiDefs = apiDefinitionsData as Record<string, ApiDefinition>;
const activeApiName = activeApiConfig.currentApiName;
const activeApiDefinition = apiDefs[activeApiName];

if (!activeApiDefinition) {
  throw new Error(
    `No se encontró la definición para la API activa: "${activeApiName}" en api-definitions.json`
  );
}

if (activeApiDefinition.type === "REST" && !activeApiDefinition.paramMappings) {
    throw new Error(
      `La definición de API REST "${activeApiName}" debe tener 'paramMappings'.`
    );
}
if (
  activeApiDefinition.type === "GraphQL" &&
  !activeApiDefinition.graphqlConfig
) {
  throw new Error(
    `La definición de API GraphQL "${activeApiName}" debe tener 'graphqlConfig'.`
  );
}
if (activeApiDefinition.type === "SOAP" && !activeApiDefinition.soapConfig) {
  throw new Error(
    `La definición de API SOAP "${activeApiName}" debe tener 'soapConfig'.`
  );
}

const activeDataFetcher = createFetcherFromDefinition(activeApiDefinition);

export const plantillaConfig: {
  title: string;
  description: string;
  allTableColumns: { accessorKey: string; header: string }[];
  filterableColumns: { value: string; label: string }[];
  dataFetcher: IDataFetcher;
  defaultSortBy?: keyof UserData | string;
} = {
  title: activeApiDefinition.tableConfig.title,
  description: activeApiDefinition.tableConfig.description,
  allTableColumns: activeApiDefinition.tableConfig.allTableColumns,
  filterableColumns: activeApiDefinition.tableConfig.filterableColumns,
  dataFetcher: activeDataFetcher,
  defaultSortBy: activeApiDefinition.tableConfig.defaultSortBy,
};

const mockDataFetcherAdapter: IDataFetcher = {
  async fetchData(
    params: FetchDataParams
  ): Promise<{ data: UserData[]; total: number }> {
    const { sortBy, ...restOfParams } = params;
    let mockSortBy: keyof UserData | undefined = undefined;
    if (sortBy) {
      const validUserDataKeys: Array<string> = [
        "id",
        "nombreCompleto",
        "email",
        "rol",
        "ultimoAcceso",
      ];
      if (validUserDataKeys.includes(String(sortBy))) {
        mockSortBy = sortBy as keyof UserData;
      } else {
        console.warn(
          `[MockAdapter] SortBy "${sortBy}" no es válido para UserData. Ignorando.`
        );
      }
    }
    const mockCompatibleParams = {
      ...restOfParams,
      ...(mockSortBy && { sortBy: mockSortBy }),
    };
    return fetchMockData(mockCompatibleParams as any); 
  },
};
