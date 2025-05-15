# Manual de Integración de APIs para la Plantilla Dinámica

## 1. ¿Qué es este Sistema?

Este sistema permite conectar la tabla de datos de la plantilla (`app/(dashboard)/dashboard/plantilla/`) a diversas fuentes de datos (APIs) de una manera flexible y configurable, minimizando la necesidad de modificar el código JavaScript/TypeScript para cada nueva integración.

El objetivo principal es que los desarrolladores puedan añadir o cambiar la fuente de datos de la tabla principalmente editando archivos de configuración (JSON y TypeScript).

## 2. ¿Cómo Funciona?

El sistema se basa en varios componentes clave:

*   **`IDataFetcher` (Contrato en [`./config.ts`](./config.ts))**: Una interfaz TypeScript que define un contrato estándar para cualquier "proveedor de datos". Exige una función `fetchData(params)` que recibe parámetros de paginación, ordenamiento y filtros, y debe devolver una promesa con `{ data: UserData[], total: number }`. `UserData` es el tipo de dato que la tabla espera mostrar.
*   **Archivos de Configuración**:
    *   **[`./active-api.json`](./active-api.json)**: Un archivo simple que especifica cuál de las definiciones de API (listadas en `api-definitions.ts`) está actualmente en uso.
        ```json
        {
          "currentApiName": "nombreDeLaApiActiva"
        }
        ```
    *   **[`./api-definitions.ts`](./api-definitions.ts)**: Un archivo TypeScript que exporta una constante `apiDefinitions`. Esta constante es un objeto que contiene un diccionario de "definiciones de API". Cada definición es un objeto que describe en detalle cómo conectarse a una API específica, cómo enviarle parámetros y cómo interpretar su respuesta. Incluye:
        *   `displayName`: Nombre legible para la API.
        *   `type`: Tipo de API (actualmente `"REST"`, `"GraphQL"`, `"SOAP"`).
        *   `baseUrl`, `method`: Endpoint y método HTTP.
        *   `authentication`: Configuración de autenticación (ninguna, bearer token, clave API).
        *   `paramMappings`: Mapeo de parámetros internos (offset, limit, sortBy, etc.) a los nombres que la API espera.
        *   `advancedFiltersFormatterConfig` (opcional): Configuración para formatear filtros avanzados.
        *   `responseMapping`: Instrucciones para transformar la respuesta de la API:
            *   `dataPath`: Ruta para acceder al array de datos en la respuesta JSON (ej. `"data.items"`).
            *   `totalPath` / `totalCalculation`: Cómo obtener el número total de registros.
            *   `fields`: Mapeo de cada campo de `UserData` (ej. `nombreCompleto`) al campo correspondiente en la respuesta de la API (ej. `"profile.full_name"`).
        *   `tableConfig`: Configuración de cómo se debe mostrar la tabla para esta API (título, descripción, columnas por defecto, etc.). Este archivo ahora permite comentarios para una mejor documentación.
*   **Lógica Dinámica en [`./config.ts`](./config.ts)**:
    *   Lee el archivo `active-api.json` e importa `apiDefinitions` desde `api-definitions.ts`.
    *   Tiene una función `createFetcherFromDefinition` que toma una definición de API del objeto `apiDefinitions` y crea dinámicamente una instancia de `IDataFetcher`.
    *   Esta instancia sabe cómo construir la solicitud HTTP, manejar la autenticación, y transformar la respuesta de la API al formato `UserData` esperado, todo basado en la configuración del objeto.
    *   La `plantillaConfig` exportada se configura con este `dataFetcher` dinámico y la configuración de tabla correspondiente.
*   **Componente de Página ([`./page.tsx`](./page.tsx))**:
    *   Utiliza `plantillaConfig.dataFetcher.fetchData(...)` para obtener los datos.
    *   No necesita conocer los detalles específicos de la API que está activa, ya que interactúa con la abstracción `IDataFetcher`.

## 3. Ventajas

*   **Facilidad de Integración (para APIs REST comunes)**: Añadir o cambiar entre APIs REST que siguen patrones estándar se reduce a editar el archivo `api-definitions.ts`.
*   **Centralización de la Configuración**: Los detalles específicos de cada API están en `api-definitions.ts`, no dispersos en el código.
*   **Mantenibilidad**: Menos código TypeScript que tocar significa menos riesgo de introducir errores en la lógica principal de la aplicación. El uso de TypeScript para las definiciones permite una mejor documentación mediante comentarios.
*   **Reutilización de Componentes**: Los componentes de la interfaz de usuario (`page.tsx`, `data-table.tsx`) no cambian al cambiar de API.
*   **Flexibilidad**: Aunque optimizado para REST, el patrón `IDataFetcher` permite extender el sistema para soportar otros tipos de API (GraphQL, SOAP) mediante la creación de fetchers personalizados en `config.ts`.

## 4. ¿En qué Caso NO Usar (o Usar con Precaución)?

*   **APIs con Lógica de Negocio Muy Compleja en el Frontend**: Si la obtención o transformación de datos requiere una lógica de negocio muy intrincada que es difícil de expresar declarativamente en la configuración (ej. múltiples llamadas dependientes, fusiones complejas de datos de diferentes fuentes antes de mostrar), este sistema podría volverse limitante. En tales casos, un `IDataFetcher` personalizado sería más apropiado.
*   **Transformaciones de Datos Extremadamente Dinámicas o Condicionales**: Si el mapeo de campos de la API a `UserData` depende de otros valores en los datos o de condiciones complejas, el `responseMapping.fields` de la configuración podría no ser suficiente.
*   **Seguridad de Claves/Tokens Sensibles**: Almacenar tokens o claves API directamente en `api-definitions.ts` (que es parte del bundle del frontend) no es seguro para producción. Se deben usar variables de entorno (leídas en tiempo de build o servidas de forma segura por un backend) o un backend que actúe como proxy para las llamadas a la API. La configuración actual tiene `tokenValue` pero no implementa la lectura desde variables de entorno de forma automática.
*   **Necesidad de Control Total sobre la Solicitud/Respuesta para Cada API**: Si cada API tiene particularidades muy únicas en la construcción de la solicitud o el manejo de la respuesta que no encajan bien en la generalización de `createFetcherFromDefinition`, podría ser más sencillo escribir un `IDataFetcher` personalizado.

## 5. ¿En qué Caso SÍ Usar?

*   **Integración Rápida de Múltiples APIs REST, GraphQL o SOAP**: Ideal cuando se trabaja con varias APIs que devuelven JSON y tienen mecanismos de autenticación y paginación relativamente estándar.
*   **Prototipado Rápido**: Permite cambiar entre diferentes fuentes de datos (ej. una API de prueba y una de producción) simplemente cambiando una línea en `active-api.json`.
*   **Equipos con Diferentes Roles**: Los desarrolladores pueden definir la estructura de la API en `api-definitions.ts`, mientras que otros pueden enfocarse en la lógica de la interfaz de usuario.
*   **Cuando se Busca Reducir Código Repetitivo**: Evita tener que escribir lógica de `fetch`, mapeo de parámetros y transformación de respuestas similar para cada API.

## 6. Paso a Paso: Cómo Implementar una Nueva API

### 6.1. Para una Nueva API REST

Sigue estos pasos principalmente en el archivo [`./api-definitions.ts`](./api-definitions.ts):

1.  **Duplica una Definición Existente**: Dentro del objeto `apiDefinitions`, copia la estructura de una API REST existente (ej. `jsonPlaceholder` o `miApiPersonalizadaRest`) y asígnale una nueva clave única (ej. `"miNuevaApiRest"`).
2.  **Configura los Detalles Básicos**:
    *   `displayName`: Un nombre legible para tu API.
    *   `type`: Mantenlo como `"REST"`.
    *   `baseUrl`: La URL base de tu API (ej. `"https://api.ejemplo.com/v1/recursos"`).
    *   `method`: `"GET"` o `"POST"` según lo requiera tu API para obtener listas de datos.
3.  **Configura la Autenticación (`authentication`)**:
    *   `"type": "none"`: Si no requiere autenticación.
    *   `"type": "bearer"`:
        *   `"tokenValue"`: El token Bearer. **PRECAUCIÓN**: Para producción, este valor debería provenir de una variable de entorno o un sistema seguro, no hardcodeado.
    *   `"type": "apiKey"`:
        *   `"keyName"`: El nombre del parámetro o encabezado de la clave API (ej. `"X-Api-Key"`).
        *   `"keyValue"`: El valor de la clave API. **PRECAUCIÓN** de seguridad similar al token.
        *   `"in"`: `"header"` o `"query"` para indicar dónde va la clave API.
4.  **Configura el Mapeo de Parámetros (`paramMappings`)**:
    *   Para cada parámetro (`offset`, `limit`, `sortBy`, `sortOrder`, `searchTerm`), especifica el nombre que tu API espera. Si tu API no soporta alguno, puedes omitirlo del mapeo o la función `createFetcherFromDefinition` lo ignorará si no está en `paramMappings`.
5.  **Configura el Formateador de Filtros Avanzados (`advancedFiltersFormatterConfig`) (Opcional)**:
    *   Si tu API soporta filtros más complejos y quieres usarlos con el componente de "Filtro Avanzado", configura las propiedades correspondientes.
    *   *Nota*: La implementación actual de esto en `createFetcherFromDefinition` es simplificada, especialmente para `GET`. Podría necesitar ajustes en `config.ts` para APIs con sintaxis de filtro muy complejas.
6.  **Configura el Mapeo de Respuesta (`responseMapping`)**:
    *   `dataPath`: La ruta (separada por puntos) para acceder al array de datos dentro de la respuesta JSON de tu API. Si la respuesta es directamente el array, déjalo como `""`. (Ej: `"data.items"`, `"results"`).
    *   `totalPath` (opcional): La ruta para acceder al número total de registros para la paginación. (Ej: `"meta.pagination.total_items"`).
    *   `totalCalculation` (opcional, si `totalPath` no está disponible):
        *   `"estimateFromResponseLength"`: Estima el total basándose en si la cantidad de ítems devueltos es igual al límite solicitado.
        *   `"fromPath"`: (Implícito si `totalPath` está definido).
    *   `fields`: **Este es el mapeo crucial.** Para cada campo de `UserData` (`id`, `nombreCompleto`, `email`, `rol`, `ultimoAcceso`, `selected`), especifica la ruta (separada por puntos) para encontrar el valor correspondiente en un ítem individual de la respuesta de tu API.
        *   Ej: ` "nombreCompleto": "datos_cliente.nombre_completo" `
        *   Si un campo de `UserData` no viene de la API o quieres que se genere/ignore, pon `null` (ej. `"selected": null`).
        *   Puedes añadir comentarios en línea para explicar cada mapeo.
7.  **Configura la Visualización de la Tabla (`tableConfig`)**:
    *   `title`, `description`: Lo que se mostrará en el encabezado de la página.
    *   `defaultSortBy` (opcional): Campo por el que se ordenará por defecto.
    *   `allTableColumns`: Un array que define todas las columnas que se pueden mostrar.
        *   `accessorKey`: Debe coincidir con una clave de `UserData`.
        *   `header`: El texto que se mostrará en el encabezado de la columna.
    *   `filterableColumns`: Un array que define qué columnas se pueden usar en el filtro avanzado.
        *   `value`: Debe coincidir con una clave de `UserData`.
        *   `label`: El texto que se mostrará para esta opción de filtro.
8.  **Activa tu Nueva API**:
    *   Abre [`./active-api.json`](./active-api.json).
    *   Cambia el valor de `currentApiName` a la clave que usaste para tu nueva definición en el objeto `apiDefinitions` de `api-definitions.ts` (ej. `"miNuevaApiRest"`).

¡Eso es todo para una API REST común! Refresca la página de la plantilla y debería estar usando tu nueva API.

### 6.2. Para una Nueva API GraphQL

1.  **Modificar [`./api-definitions.ts`](./api-definitions.ts)**:
    *   Añade una nueva definición con `type: "GraphQL"`.
    *   Incluye una sección `graphqlConfig` (ver ejemplo en el objeto `apiDefinitions`) con:
        *   `queryTemplate`: La query de GraphQL. Podrías usar placeholders como `{{limit}}`, `{{offset}}` que se reemplazarían.
        *   `variableMappings`: Cómo los `FetchDataParams` se mapean a las variables de la query GraphQL.
    *   El `responseMapping` seguiría siendo útil para extraer datos de la respuesta JSON de GraphQL.
2.  **Revisar/Extender `createFetcherFromDefinition` en [`./config.ts`](./config.ts)**:
    *   Asegúrate que la rama `else if (definition.type === "GraphQL") { ... }` maneja correctamente la construcción del cuerpo de la solicitud GraphQL, la autenticación y el procesamiento de la respuesta.
3.  **Activa tu API GraphQL** en `active-api.json`.

### 6.3. Para un Nuevo Servicio SOAP

1.  **Modificar [`./api-definitions.ts`](./api-definitions.ts)**:
    *   Añade una nueva definición con `type: "SOAP"`.
    *   Incluye una sección `soapConfig` (ver ejemplo en el objeto `apiDefinitions`) con:
        *   `action`: La `SOAPAction` HTTP header.
        *   `requestTemplate`: Una plantilla XML para la solicitud SOAP, con placeholders para los parámetros.
        *   `responseNamespace`: Namespaces XML necesarios para parsear la respuesta.
        *   `resultPath`, `totalPath`: Expresiones XPath para extraer el array de datos y el total de la respuesta XML.
    *   El `responseMapping.fields` necesitaría mapear campos de `UserData` a nombres de etiquetas XML o resultados de XPath dentro de cada ítem.
2.  **Revisar/Extender `createFetcherFromDefinition` en [`./config.ts`](./config.ts)** O, **más recomendado, crear un `IDataFetcher` personalizado**:
    *   **Opción Fetcher Personalizado (Recomendado para SOAP)**:
        *   En `config.ts`, crea una nueva constante: `const miServicioSoapFetcher: IDataFetcher = { async fetchData(params) { ... } };`
        *   Dentro de `fetchData`:
            *   Usa una librería para construir el XML de la solicitud SOAP.
            *   Realiza la solicitud HTTP `POST`.
            *   Parsea la respuesta XML y transforma los datos.
        *   Ajusta la lógica en `config.ts` para usar este fetcher personalizado cuando la API SOAP esté activa.
3.  **Activa tu API SOAP**.

## 7. Conclusión

Este sistema provee una base sólida y muy eficiente para integrar APIs REST, GraphQL y SOAP, con un mecanismo de fallback para filtros avanzados en el cliente que mejora la experiencia de usuario para APIs más simples. El uso de `api-definitions.ts` permite una configuración clara y comentada. Para tipos de API más complejos o con particularidades, la creación de `IDataFetcher` personalizados sigue siendo una opción viable. Es crucial entender la diferencia entre el filtrado en servidor (preferido) y el filtrado en cliente (fallback con limitaciones) para gestionar las expectativas de los usuarios.