// Define y exporta las configuraciones para diversas API utilizadas en la plantilla.
export const apiDefinitions = {
  // Configuración para la API de JSONPlaceholder (un servicio REST de ejemplo).
  "jsonPlaceholder": {
    "displayName": "JSONPlaceholder Users (REST)", // Nombre descriptivo que se mostrará en la UI.
    "type": "REST", // Tipo de API (REST, GraphQL, SOAP).
    "baseUrl": "https://jsonplaceholder.typicode.com/users", // URL base del endpoint de la API.
    "method": "GET", // Método HTTP a utilizar para las peticiones (GET, POST, etc.).
    "authentication": { // Configuración de autenticación.
      "type": "none" // Tipo de autenticación (none, bearer, apiKey).
    },
    "paramMappings": { // Mapeo de parámetros estándar de la tabla a parámetros específicos de la API.
      "offset": "_start", // Parámetro para el inicio de la paginación.
      "limit": "_limit", // Parámetro para la cantidad de resultados por página.
      "sortBy": "_sort", // Parámetro para el campo de ordenamiento.
      "sortOrder": "_order", // Parámetro para la dirección del ordenamiento (asc, desc).
      "searchTerm": "q" // Parámetro para el término de búsqueda general.
    },
    "responseMapping": { // Mapeo de la respuesta de la API a la estructura esperada por la tabla.
      "dataPath": "", // Ruta (dot notation) dentro de la respuesta JSON donde se encuentran los datos principales. Vacío si los datos están en la raíz.
      "totalCalculation": "estimateFromResponseLength", // Cómo calcular el total de registros (si no viene explícito en la API).
      "fields": { // Mapeo de campos de la tabla a campos de la respuesta de la API.
        "id": "id", // Campo 'id' de la tabla se mapea al campo 'id' de la API.
        "nombreCompleto": "name", // Campo 'nombreCompleto' se mapea a 'name'.
        "email": "email", // Campo 'email' se mapea a 'email'.
        "rol": "company.bs", // Campo 'rol' se mapea a 'company.bs'.
        "ultimoAcceso": null, // Campo 'ultimoAcceso', no mapeado directamente (se podría calcular o dejar vacío).
        "selected": null // Campo 'selected' para la selección de filas, no mapeado.
      }
    },
    "tableConfig": { // Configuración específica para la visualización en la tabla de datos.
      "title": "Usuarios (JSONPlaceholder)", // Título de la tabla.
      "description": "Lista de usuarios de ejemplo de JSONPlaceholder.", // Descripción de la tabla.
      "defaultSortBy": "nombreCompleto", // Campo por el cual se ordenará la tabla por defecto.
      "allTableColumns": [ // Definición de todas las columnas visibles en la tabla.
        { "accessorKey": "nombreCompleto", "header": "Nombre Completo" }, // Columna para 'nombreCompleto'.
        { "accessorKey": "email", "header": "Email" }, // Columna para 'email'.
        { "accessorKey": "rol", "header": "Rol (BS)" }, // Columna para 'rol'.
        { "accessorKey": "ultimoAcceso", "header": "Último Acceso" }, // Columna para 'ultimoAcceso'.
        { "accessorKey": "id", "header": "ID" } // Columna para 'id'.
      ],
      "filterableColumns": [ // Columnas por las cuales se puede filtrar la tabla.
        { "value": "nombreCompleto", "label": "Nombre Completo" }, // Opción de filtro para 'nombreCompleto'.
        { "value": "email", "label": "Email" }, // Opción de filtro para 'email'.
        { "value": "rol", "label": "Rol (BS)" } // Opción de filtro para 'rol'.
      ]
    }
  },
  // Configuración para una API REST personalizada de ejemplo.
  "miApiPersonalizadaRest": {
    "displayName": "Mi API de Clientes (REST)", // Nombre descriptivo.
    "type": "REST", // Tipo de API.
    "baseUrl": "https://mi.api.personalizada/api/v1/clientes", // URL base de la API.
    "method": "GET", // Método HTTP.
    "authentication": { // Configuración de autenticación.
      "type": "bearer", // Autenticación mediante Bearer Token.
      "tokenValue": "TU_TOKEN_AQUI_O_VARIABLE_DE_ENTORNO" // Valor del token (o referencia a variable de entorno).
    },
    "paramMappings": { // Mapeo de parámetros.
      "offset": "page_offset",
      "limit": "page_limit",
      "sortBy": "sort_field",
      "sortOrder": "sort_direction",
      "searchTerm": "search_term"
    },
    "advancedFiltersFormatterConfig": { // Configuración para formatear filtros avanzados.
      "paramNameTemplate": "{field}{operatorSuffix}", // Plantilla para el nombre del parámetro de filtro.
      "operatorSuffixMap": { // Mapeo de operadores de filtro a sufijos de parámetro.
        "contains": "_like", // Operador 'contains' se mapea a sufijo '_like'.
        "equals": "_eq", // Operador 'equals' se mapea a sufijo '_eq'.
        "not_equals": "_ne" // Operador 'not_equals' se mapea a sufijo '_ne'.
      },
      "valueWrapper": "" // Envoltura para el valor del filtro (ej. '%' para SQL LIKE).
    },
    "responseMapping": { // Mapeo de la respuesta.
      "dataPath": "data.items", // Los datos se encuentran en 'data.items'.
      "totalPath": "data.pagination.totalCount", // El total de registros se encuentra en 'data.pagination.totalCount'.
      "fields": { // Mapeo de campos.
        "id": "uuid",
        "nombreCompleto": "profile.full_name",
        "email": "contact.primary_email",
        "rol": "user_type",
        "ultimoAcceso": "profile.last_login_date",
        "selected": null
      }
    },
    "tableConfig": { // Configuración de la tabla.
      "title": "Mis Clientes (REST)",
      "description": "Gestión de clientes desde mi API personalizada.",
      "defaultSortBy": "nombreCompleto",
      "allTableColumns": [
        { "accessorKey": "nombreCompleto", "header": "Cliente" },
        { "accessorKey": "email", "header": "Email Principal" },
        { "accessorKey": "rol", "header": "Tipo" },
        { "accessorKey": "ultimoAcceso", "header": "Último Login" },
        { "accessorKey": "id", "header": "UUID" }
      ],
      "filterableColumns": [
        { "value": "nombreCompleto", "label": "Cliente" },
        { "value": "email", "label": "Email Principal" },
        { "value": "rol", "label": "Tipo" }
      ]
    }
  },
  // Configuración para una API GraphQL de ejemplo.
  "miApiGraphQL": {
    "displayName": "Mi API de Productos (GraphQL)", // Nombre descriptivo.
    "type": "GraphQL", // Tipo de API.
    "baseUrl": "https://mi.api.graphql/endpoint", // URL del endpoint GraphQL.
    "method": "POST", // GraphQL usualmente usa POST.
    "authentication": { // Configuración de autenticación.
      "type": "apiKey", // Autenticación mediante API Key.
      "keyName": "X-Api-Key", // Nombre de la cabecera o parámetro para la API Key.
      "keyValue": "MI_GRAPHQL_API_KEY", // Valor de la API Key.
      "in": "header" // Dónde se envía la API Key (header, query).
    },
    "graphqlConfig": { // Configuración específica para GraphQL.
      // Plantilla de la query GraphQL. Las variables se interpolarán.
      "queryTemplate": "query GetProducts($limit: Int, $offset: Int, $sortBy: String, $sortOrder: String, $searchTerm: String) { products(limit: $limit, offset: $offset, sort: { field: $sortBy, order: $sortOrder }, search: $searchTerm) { items { id_producto nombre precio categoria { nombre_cat } stock } totalCount } }",
      "variableMappings": { // Mapeo de parámetros estándar a variables de la query GraphQL.
        "offset": "offset",
        "limit": "limit",
        "sortBy": "sortBy",
        "sortOrder": "sortOrder",
        "searchTerm": "searchTerm"
      }
    },
    "responseMapping": { // Mapeo de la respuesta GraphQL.
      "dataPath": "data.products.items", // Ruta a los datos.
      "totalPath": "data.products.totalCount", // Ruta al total de registros.
      "fields": { // Mapeo de campos.
        "id": "id_producto",
        "nombreCompleto": "nombre",
        "email": null, // No hay email para productos.
        "rol": "categoria.nombre_cat", // Usando 'rol' para la categoría del producto.
        "ultimoAcceso": null,
        "selected": null
      }
    },
    "tableConfig": { // Configuración de la tabla.
      "title": "Productos (GraphQL)",
      "description": "Lista de productos desde API GraphQL.",
      "defaultSortBy": "nombreCompleto",
      "allTableColumns": [
        { "accessorKey": "nombreCompleto", "header": "Producto" },
        { "accessorKey": "rol", "header": "Categoría" }, // 'rol' se muestra como 'Categoría'.
        { "accessorKey": "id", "header": "ID Producto" }
      ],
      "filterableColumns": [
        { "value": "nombreCompleto", "label": "Producto" },
        { "value": "rol", "label": "Categoría" }
      ]
    }
  },
  // Configuración para un servicio SOAP de ejemplo.
  "miServicioSOAP": {
    "displayName": "Servicio de Empleados (SOAP)", // Nombre descriptivo.
    "type": "SOAP", // Tipo de API.
    "baseUrl": "https://mi.servicio.soap/empleados?wsdl", // URL del WSDL o endpoint SOAP.
    "authentication": { "type": "none" }, // Autenticación (ej. none, basic).
    "soapConfig": { // Configuración específica para SOAP.
      "action": "http://tempuri.org/IEmpleadoService/GetEmpleadosPaginados", // SOAPAction a utilizar.
      // Plantilla del cuerpo de la petición SOAP. Las variables se interpolarán.
      "requestTemplate": "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:tem='http://tempuri.org/'><soapenv:Header/><soapenv:Body><tem:GetEmpleadosPaginados><tem:pageNumber>{{offset_divided_by_limit_plus_1}}</tem:pageNumber><tem:pageSize>{{limit}}</tem:pageSize><tem:sortBy>{{sortBy}}</tem:sortBy><tem:sortOrder>{{sortOrder}}</tem:sortOrder></tem:GetEmpleadosPaginados></soapenv:Body></soapenv:Envelope>",
      "responseNamespace": "http://tempuri.org/", // Namespace de la respuesta SOAP para parseo XPath.
      "resultPath": "//GetEmpleadosPaginadosResponse/GetEmpleadosPaginadosResult/Empleados/Empleado", // XPath para extraer la lista de resultados.
      "totalPath": "//GetEmpleadosPaginadosResponse/GetEmpleadosPaginadosResult/TotalCount" // XPath para extraer el total de registros.
    },
    "responseMapping": { // Mapeo de la respuesta SOAP (los datos se extraen vía XPath).
      "dataPath": "SOAP_DATA_PATH_UNUSED", // No se usa directamente, XPath se encarga.
      "fields": { // Mapeo de campos a tags XML de la respuesta SOAP.
        "id": "ID",
        "nombreCompleto": "NombreCompleto",
        "email": "Email",
        "rol": "Puesto",
        "ultimoAcceso": "FechaUltimoLogin",
        "selected": null
      }
    },
    "tableConfig": { // Configuración de la tabla.
      "title": "Empleados (SOAP)",
      "description": "Lista de empleados desde servicio SOAP.",
      "defaultSortBy": "nombreCompleto",
      "allTableColumns": [
        { "accessorKey": "nombreCompleto", "header": "Empleado" },
        { "accessorKey": "email", "header": "Email" },
        { "accessorKey": "rol", "header": "Puesto" },
        { "accessorKey": "id", "header": "ID Empleado" }
      ],
      "filterableColumns": [
        { "value": "nombreCompleto", "label": "Empleado" },
        { "value": "email", "label": "Email" }
      ]
    }
  }
};