import { faker } from '@faker-js/faker';
import type { UserData } from "../components/data-table";
import type { AdvancedFilterCondition } from "../components/advance-filter";

const createRandomUser = (): UserData => {
  return {
    id: faker.string.uuid(),
    nombreCompleto: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    rol: faker.helpers.arrayElement(['Admin', 'Editor', 'Viewer']),
    ultimoAcceso: faker.date.recent({ days: 30 }).toISOString().split('T')[0], // Formato YYYY-MM-DD
  };
};

const generateMockData = (count: number): UserData[] => {
  return Array.from({ length: count }, createRandomUser);
};

// Generamos una cantidad mayor de datos
const allMockData = generateMockData(1000000);

// Función para simular la API con paginación, ordenamiento y filtros
interface FetchParams {
  offset?: number;
  limit?: number;
  sortBy?: keyof UserData;
  sortOrder?: 'asc' | 'desc';
  filters?: Partial<Record<keyof UserData, string>>; // Filtros específicos por columna
  searchTerm?: string; // Filtro de búsqueda global
  advancedFilters?: AdvancedFilterCondition[];
}

export const fetchMockData = (
  params: FetchParams = {}
): Promise<{ data: UserData[]; total: number }> => {
  return new Promise((resolve) => {
    let filteredData = [...allMockData];
    // console.log("[fetchMockData] Params:", JSON.parse(JSON.stringify(params))); // Comentado para rendimiento

    // Aplicar filtro de búsqueda global (searchTerm)
    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => {
        const searchableString = `${item.nombreCompleto} ${item.email} ${item.rol}`.toLowerCase();
        return searchableString.includes(term);
      });
    }

    // Aplicar filtros específicos por columna (se mantiene por si se usa en otro lado, pero advancedFilters tendrá precedencia si existe)
    if (params.filters && (!params.advancedFilters || params.advancedFilters.length === 0)) { // Solo aplicar si no hay advancedFilters activos
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) {
          const filterValue = String(value).toLowerCase();
          filteredData = filteredData.filter(item =>
            String(item[key as keyof UserData]).toLowerCase().includes(filterValue)
          );
        }
      });
    }

    // Aplicar Filtros Avanzados
    if (params.advancedFilters && params.advancedFilters.length > 0) {
      console.log(`[fetchMockData] Applying Advanced Filters:`, JSON.parse(JSON.stringify(params.advancedFilters))); // Descomentado para esta depuración
      filteredData = filteredData.filter(item => {
        // console.log(`\n[fetchMockData] Evaluating item:`, JSON.parse(JSON.stringify(item)));
        let itemMatch = true;

        const activeFilters = params.advancedFilters!.filter(f => f.field && f.operator && f.value.trim() !== "");
        if (activeFilters.length === 0) {
            // console.log(`[fetchMockData] Item ID: ${item.id} - No active advanced filters, item passes.`); // Comentado para rendimiento
            return true;
        }

        const firstFilter = activeFilters[0];
        const firstItemValue = String(item[firstFilter.field as keyof UserData] ?? '').toLowerCase();
        const firstFilterValue = firstFilter.value.toLowerCase();
        
        // console.log(`[fetchMockData] Item ID: ${item.id}, Filter 0: ${firstFilter.field} ${firstFilter.operator} "${firstFilterValue}" (Item Value: "${firstItemValue}")`); // Comentado

        switch (firstFilter.operator) {
            case 'contains': itemMatch = firstItemValue.includes(firstFilterValue); break;
            case 'not_contains': itemMatch = !firstItemValue.includes(firstFilterValue); break;
            case 'equals': itemMatch = firstItemValue === firstFilterValue; break;
            case 'not_equals': itemMatch = firstItemValue !== firstFilterValue; break;
            case 'starts_with': itemMatch = firstItemValue.startsWith(firstFilterValue); break;
            case 'ends_with': itemMatch = firstItemValue.endsWith(firstFilterValue); break;
            default: itemMatch = true;
        }
        // console.log(`[fetchMockData] Item ID: ${item.id}, Filter 0 Result: ${itemMatch}`); // Comentado

        for (let i = 1; i < activeFilters.length; i++) {
            if (!itemMatch && activeFilters[i-1].logicalOperator === 'AND') {
                // Short-circuit if an AND condition already made itemMatch false
                // console.log(`[fetchMockData] Item ID: ${item.id}, Short-circuiting AND chain. Current itemMatch is false.`); // Comentado
                break;
            }

            const currentFilter = activeFilters[i];
            const prevFilterLogicalOperator = activeFilters[i-1].logicalOperator; 

            const currentItemValue = String(item[currentFilter.field as keyof UserData] ?? '').toLowerCase();
            const currentFilterValue = currentFilter.value.toLowerCase();
            let currentConditionEval = false;
            
            // Descomentar selectivamente para depurar OR
            if (prevFilterLogicalOperator === 'OR') {
              console.log(`[DEBUG OR] Item ID: ${item.id}, Item: ${item.nombreCompleto}, Filter ${i} (Field: ${currentFilter.field}, Op: ${currentFilter.operator}, Val: "${currentFilterValue}")`);
              console.log(`[DEBUG OR]         PrevLogicalOp: ${prevFilterLogicalOperator}, ItemValue: "${currentItemValue}"`);
              console.log(`[DEBUG OR]         itemMatch BEFORE OR: ${itemMatch}`);
            }

            switch (currentFilter.operator) {
                case 'contains': currentConditionEval = currentItemValue.includes(currentFilterValue); break;
                case 'not_contains': currentConditionEval = !currentItemValue.includes(currentFilterValue); break;
                case 'equals': currentConditionEval = currentItemValue === currentFilterValue; break;
                case 'not_equals': currentConditionEval = currentItemValue !== currentFilterValue; break;
                case 'starts_with': currentConditionEval = currentItemValue.startsWith(currentFilterValue); break;
                case 'ends_with': currentConditionEval = currentItemValue.endsWith(currentFilterValue); break;
                default: currentConditionEval = true;
            }
            
            if (prevFilterLogicalOperator === 'OR') {
              console.log(`[DEBUG OR]         currentConditionEval: ${currentConditionEval}`);
            }
            // console.log(`[fetchMockData] Item ID: ${item.id}, Filter ${i} Individual Result: ${currentConditionEval}`);

            if (prevFilterLogicalOperator === 'AND') {
                itemMatch = itemMatch && currentConditionEval;
            } else if (prevFilterLogicalOperator === 'OR') {
                itemMatch = itemMatch || currentConditionEval;
            } else {
                // console.warn(`[fetchMockData] Item ID: ${item.id}, Filter ${i}: Undefined or unexpected logical operator "${prevFilterLogicalOperator}" from previous filter. Defaulting to AND.`); // Comentado
                itemMatch = itemMatch && currentConditionEval;
            }
            
            if (prevFilterLogicalOperator === 'OR') {
              console.log(`[DEBUG OR]         itemMatch AFTER OR (${itemMatch} || ${currentConditionEval}): ${itemMatch || currentConditionEval}`);
            }
            // console.log(`[fetchMockData] Item ID: ${item.id}, Cumulative itemMatch after filter ${i}: ${itemMatch}`);
        }
        // console.log(`[fetchMockData] Item ID: ${item.id}, Final advanced filter evaluation for item: ${itemMatch}`);
        return itemMatch;
      });
    }


    // Aplicar ordenamiento
    if (params.sortBy) {
      filteredData.sort((a, b) => {
        const valA = String(a[params.sortBy!] ?? '');
        const valB = String(b[params.sortBy!] ?? '');
        let comparison = 0;
        if (valA > valB) {
          comparison = 1;
        } else if (valA < valB) {
          comparison = -1;
        }
        return params.sortOrder === "desc" ? comparison * -1 : comparison;
      });
    }

    const total = filteredData.length;
    console.log(`[fetchMockData] Total items after filtering: ${total}`); // Descomentado para esta depuración

    // Aplicar paginación
    const offset = params.offset || 0;
    const limit = params.limit || 10; 
    const paginatedData = filteredData.slice(offset, offset + limit);

    // Simular demora de API
    setTimeout(() => {
      resolve({ data: paginatedData, total });
    }, 300); 
  });
};

// Exportar mockData original por si se necesita en algún otro lugar (opcional)
// export const mockData = allMockData.slice(0,10);
