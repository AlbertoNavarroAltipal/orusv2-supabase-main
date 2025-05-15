import { faker } from '@faker-js/faker';
import type { UserData } from "../components/data-table";

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
}

export const fetchMockData = (
  params: FetchParams = {}
): Promise<{ data: UserData[]; total: number }> => {
  return new Promise((resolve) => {
    let filteredData = [...allMockData];

    // Aplicar filtro de búsqueda global (searchTerm)
    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();
      filteredData = filteredData.filter(item => {
        // Concatenar los campos relevantes en una sola cadena para buscar
        const searchableString = `${item.nombreCompleto} ${item.email} ${item.rol}`.toLowerCase();
        return searchableString.includes(term);
      });
    }

    // Aplicar filtros específicos por columna
    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value) {
          const filterValue = String(value).toLowerCase();
          filteredData = filteredData.filter(item =>
            String(item[key as keyof UserData]).toLowerCase().includes(filterValue)
          );
        }
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

    // Aplicar paginación
    const offset = params.offset || 0;
    const limit = params.limit || 10; // Default a 10 items por página
    const paginatedData = filteredData.slice(offset, offset + limit);

    // Simular demora de API
    setTimeout(() => {
      resolve({ data: paginatedData, total });
    }, 300); // Reducido para pruebas más rápidas
  });
};

// Exportar mockData original por si se necesita en algún otro lugar (opcional)
// export const mockData = allMockData.slice(0,10); // O como se necesite
