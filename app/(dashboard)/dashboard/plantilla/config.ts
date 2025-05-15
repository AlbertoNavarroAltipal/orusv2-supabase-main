import type { UserData } from "./components/data-table";
import { fetchMockData } from "./data/mock-data"; // Importar la función de mock data
import type { AdvancedFilterCondition } from "./components/advance-filter"; // Importar para el tipo de fetch

// Definiciones de configuración para la plantilla

interface TableColumnConfig {
  accessorKey: keyof UserData; // Cambiado de key a accessorKey
  header: string;
}

interface FilterableColumnConfig {
  value: keyof UserData;
  label: string;
}

// Definir el tipo para los parámetros de fetchMockData si es necesario aquí también
// o importarlo si está exportado desde mock-data.ts
interface FetchDataParams {
  offset?: number;
  limit?: number;
  sortBy?: keyof UserData;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  advancedFilters?: AdvancedFilterCondition[];
}

export const plantillaConfig: {
  title: string;
  description: string;
  allTableColumns: TableColumnConfig[];
  filterableColumns: FilterableColumnConfig[];
  fetchData: (
    params: FetchDataParams
  ) => Promise<{ data: UserData[]; total: number }>;
  // dataSet ya no es necesario si usamos fetchData directamente
} = {
  title: "Gestión de Plantillass",
  description:
    "Administra y visualiza las plantillas disponibles en el sistema. sss",
  fetchData: fetchMockData, // Asignar la función directamente
  allTableColumns: [
    { accessorKey: "nombreCompleto", header: "Nombre Completo confs" }, // Corregido a accessorKey
    { accessorKey: "email", header: "Email" }, // Corregido a accessorKey
    { accessorKey: "rol", header: "Rol" }, // Corregido a accessorKey
    { accessorKey: "ultimoAcceso", header: "Último Acceso" }, // Corregido a accessorKey
    // { accessorKey: "id", header: "ID" }, // Ejemplo si se quisiera mostrar
  ],
  filterableColumns: [
    { value: "nombreCompleto", label: "Nombre Completo conf" },
    { value: "email", label: "Email" },
    { value: "rol", label: "Rol" },
  ],
  // dataSet: [], // Eliminado ya que usamos fetchData
};
