"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  Suspense,
  useRef,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "./components/header";
import DataTable, { UserData } from "./components/data-table";
import { fetchMockData } from "./data/mock-data";
import AdvanceFilter, {
  type AdvanceFilterHandle,
  type AdvancedFilterCondition,
} from "./components/advance-filter";
import TableConfigModal from "./components/table-configs";

function PlantillaPageContent() {
  const router = useRouter();
  const advanceFilterRef = useRef<AdvanceFilterHandle>(null);
  const searchParams = useSearchParams();

  // Inicializar estado desde URL o con valores por defecto
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialLimit = parseInt(searchParams.get("limit") || "10", 10);

  const [data, setData] = useState<UserData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  const [sortBy, setSortBy] = useState<keyof UserData | null>(null); // Podría leerse de URL también
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Podría leerse de URL también
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  ); // Leer search de URL
  const [isLoading, setIsLoading] = useState(true);
  const [appliedAdvancedFilters, setAppliedAdvancedFilters] = useState<
    AdvancedFilterCondition[]
  >([]);
  const [isTableConfigModalOpen, setIsTableConfigModalOpen] = useState(false);

  // Definición de todas las columnas posibles y las visibles por defecto
  const allTableColumns: { key: keyof UserData; header: string }[] = [
    { key: "nombreCompleto", header: "Nombre Completo" },
    { key: "email", header: "Email" },
    { key: "rol", header: "Rol" },
    { key: "ultimoAcceso", header: "Último Acceso" },
    // Añadir 'id' o cualquier otra columna si se quiere poder mostrar/ocultar
  ];
  const [visibleColumns, setVisibleColumns] = useState<(keyof UserData)[]>(
    allTableColumns.map(col => col.key) // Inicialmente todas visibles
  );
  const [tablePaginationPosition, setTablePaginationPosition] = useState<"top" | "bottom" | "both" | "none">("both");

  // Efecto para actualizar la URL cuando cambian los parámetros de paginación o búsqueda
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", currentPage.toString());
    params.set("limit", itemsPerPage.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    // Aquí también se podrían añadir sortBy y sortOrder a la URL si se desea
    // if (sortBy) params.set('sortBy', sortBy);
    // if (sortOrder) params.set('sortOrder', sortOrder);

    // Usar replace para no llenar el historial del navegador con cada cambio de filtro/página
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    sortBy,
    sortOrder,
    router,
    searchParams,
  ]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    // Asegurarse de que currentPage e itemsPerPage sean números válidos antes de usarlos
    const validPage =
      Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;
    const validLimit =
      Number.isFinite(itemsPerPage) && itemsPerPage > 0 ? itemsPerPage : 10;

    try {
      const result = await fetchMockData({
        offset: (validPage - 1) * validLimit,
        limit: validLimit,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder,
        searchTerm: searchTerm,
        advancedFilters: appliedAdvancedFilters,
      });
      setData(result.data);
      setTotalItems(result.total);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Manejar el error, quizás mostrar un mensaje al usuario
      setData([]); // Limpiar datos en caso de error
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    itemsPerPage,
    sortBy,
    sortOrder,
    searchTerm,
    appliedAdvancedFilters,
  ]); // No incluir router o searchParams aquí para evitar bucles

  useEffect(() => {
    loadData();
  }, [loadData]); // loadData ya tiene todas las dependencias necesarias

  // Sincronizar el estado con los parámetros de la URL al montar y cuando cambian los searchParams
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    const limitFromUrl = parseInt(searchParams.get("limit") || "10", 10);
    const searchFromUrl = searchParams.get("search") || "";

    if (pageFromUrl !== currentPage) setCurrentPage(pageFromUrl);
    if (limitFromUrl !== itemsPerPage) setItemsPerPage(limitFromUrl);
    if (searchFromUrl !== searchTerm) setSearchTerm(searchFromUrl);
    // Aquí también se podría sincronizar sortBy y sortOrder si se guardan en la URL
  }, [searchParams]);

  const handleSort = useCallback((columnKey: keyof UserData) => {
    setSortBy((currentSortBy) => {
      if (currentSortBy === columnKey) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        return currentSortBy;
      } else {
        setSortOrder("asc");
        return columnKey;
      }
    });
    setCurrentPage(1);
  }, []); // sortBy y setSortOrder son estables o no necesitan estar aquí si la lógica interna los maneja bien

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []); // setSearchTerm y setCurrentPage son estables

  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []); // setItemsPerPage y setCurrentPage son estables

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []); // setCurrentPage es estable

  const handleApplyAdvancedFilters = useCallback(
    (filters: AdvancedFilterCondition[]) => {
      setAppliedAdvancedFilters(filters);
      setCurrentPage(1); // Reset page to 1 when new filters are applied
    },
    []
  );

  const handleClearAdvancedFilters = useCallback(() => {
    setAppliedAdvancedFilters([]);
    setCurrentPage(1); // Reset page to 1 when filters are cleared
  }, []);

  const openAdvanceFilterModal = () => {
    advanceFilterRef.current?.openModal();
  };

  const handleTableConfigClick = () => {
    setIsTableConfigModalOpen(true);
  };

  const closeTableConfigModal = () => {
    setIsTableConfigModalOpen(false);
  };

  const filterableColumns: { value: keyof UserData; label: string }[] = [
    { value: "nombreCompleto", label: "Nombre Completo" },
    { value: "email", label: "Email" },
    { value: "rol", label: "Rol" },
    // Considerar añadir más columnas si es necesario, ej:
    // { value: "ultimoAcceso", label: "Último Acceso" }, // Requeriría manejo de fechas
  ];

  return (
    <div className="mx-auto">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
        onAdvancedFilterClick={openAdvanceFilterModal}
        appliedFiltersCount={appliedAdvancedFilters.length}
        onTableConfigClick={handleTableConfigClick}
      />
      <DataTable
        data={data}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSort}
        isLoading={isLoading}
        visibleColumns={visibleColumns}
        paginationPosition={tablePaginationPosition}
      />
      <AdvanceFilter
        ref={advanceFilterRef}
        initialAppliedFilters={appliedAdvancedFilters}
        onFiltersApplied={handleApplyAdvancedFilters}
        onFiltersCleared={handleClearAdvancedFilters}
        filterableColumns={filterableColumns}
      />
      <TableConfigModal
        isOpen={isTableConfigModalOpen}
        onClose={closeTableConfigModal}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        availableColumns={allTableColumns}
        visibleColumns={visibleColumns}
        onVisibleColumnsChange={setVisibleColumns}
        paginationPosition={tablePaginationPosition}
        onPaginationPositionChange={setTablePaginationPosition}
      />
    </div>
  );
}

// Envolver el componente con Suspense porque useSearchParams lo requiere
export default function PlantillaPage() {
  return (
    <Suspense fallback={<div>Cargando configuración de página...</div>}>
      <PlantillaPageContent />
    </Suspense>
  );
}
