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
// fetchMockData ya no se importa directamente, se usa desde plantillaConfig
import { plantillaConfig } from "./config"; // Importar la configuración
import AdvanceFilter, {
  type AdvanceFilterHandle,
  type AdvancedFilterCondition,
} from "./components/advance-filter";
import TableConfigModal from "./components/table-configs";

// Helper para verificar si una cadena es una keyof UserData
// Definido a nivel de módulo para que esté disponible
function isKeyOfUserData(key: string | keyof UserData): key is keyof UserData {
  const sampleUserDataKeys: Array<keyof UserData> = [
    "id",
    "nombreCompleto",
    "email",
    "rol",
    "ultimoAcceso",
  ]; // Claves conocidas de UserData
  return sampleUserDataKeys.includes(key as keyof UserData);
}

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

  // Definición de todas las columnas posibles y las visibles por defecto (ahora desde config)
  const { allTableColumns, filterableColumns: configFilterableColumns } =
    plantillaConfig;
  const [visibleColumns, setVisibleColumns] = useState<(keyof UserData)[]>(
    allTableColumns.map((col) => col.accessorKey as keyof UserData) // Corregido a accessorKey
  );
  const [tablePaginationPosition, setTablePaginationPosition] = useState<
    "top" | "bottom" | "both" | "none"
  >("both");
  const [enableSorting, setEnableSorting] = useState(true);
  const [enableRowSelection, setEnableRowSelection] = useState(true);
  const [tableDensity, setTableDensity] = useState<
    "normal" | "compact" | "spacious"
  >("normal");
  const [showGridLines, setShowGridLines] = useState(true);
  const [stripedRows, setStripedRows] = useState(false);
  const [hoverHighlight, setHoverHighlight] = useState(true);
  // Nuevos estados para las nuevas preferencias
  const [stickyHeader, setStickyHeader] = useState(true);
  const [tableFontSize, setTableFontSize] = useState<"xs" | "sm" | "base">(
    "sm"
  );
  const [cellTextAlignment, setCellTextAlignment] = useState<
    "left" | "center" | "right"
  >("left");

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
      // Modificado para usar dataFetcher.fetchData
      const result = await plantillaConfig.dataFetcher.fetchData({
        offset: (validPage - 1) * validLimit,
        limit: validLimit,
        sortBy: sortBy || undefined, // sortBy puede ser string o keyof UserData
        sortOrder: sortOrder,
        searchTerm: searchTerm,
        advancedFilters: appliedAdvancedFilters,
        // Aquí podrías pasar parámetros adicionales específicos si tu dataFetcher los necesita
        // Por ejemplo: fechaInicio: '2024-01-01', fechaFin: '2024-12-31'
        // Estos serían capturados por `...additionalParams` en `createApiFetcher`
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

  // filterableColumns ahora se toma de plantillaConfig
  const filterableColumns = configFilterableColumns.map((col) => ({
    ...col,
    value: col.value as keyof UserData, // Asegurar el tipo correcto
  }));

  return (
    <div className="mx-auto">
      <Header
        title={plantillaConfig.title} // Usar título desde config
        description={plantillaConfig.description} // Usar descripción desde config
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
        enableSorting={enableSorting}
        enableRowSelection={enableRowSelection}
        tableDensity={tableDensity}
        showGridLines={showGridLines}
        stripedRows={stripedRows}
        hoverHighlight={hoverHighlight}
        // Pasar nuevas props a DataTable
        stickyHeader={stickyHeader}
        tableFontSize={tableFontSize}
        cellTextAlignment={cellTextAlignment}
      />
      <AdvanceFilter
        ref={advanceFilterRef}
        initialAppliedFilters={appliedAdvancedFilters}
        onFiltersApplied={handleApplyAdvancedFilters}
        onFiltersCleared={handleClearAdvancedFilters}
        filterableColumns={filterableColumns} // Usar filterableColumns procesadas
      />
      <TableConfigModal
        isOpen={isTableConfigModalOpen}
        onClose={closeTableConfigModal}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        availableColumns={allTableColumns
          .filter((col) => isKeyOfUserData(col.accessorKey)) // Filtrar aquí
          .map((col) => ({
            key: col.accessorKey as keyof UserData, // Cast seguro después de filtrar
            header: col.header,
            // No es necesario esparcir ...col si solo necesitas key y header
          }))}
        visibleColumns={visibleColumns} // visibleColumns ya es (keyof UserData)[]
        onVisibleColumnsChange={setVisibleColumns}
        paginationPosition={tablePaginationPosition}
        onPaginationPositionChange={setTablePaginationPosition}
        enableSorting={enableSorting}
        onEnableSortingChange={setEnableSorting}
        enableRowSelection={enableRowSelection}
        onEnableRowSelectionChange={setEnableRowSelection}
        tableDensity={tableDensity}
        onTableDensityChange={setTableDensity}
        showGridLines={showGridLines}
        onShowGridLinesChange={setShowGridLines}
        stripedRows={stripedRows}
        onStripedRowsChange={setStripedRows}
        hoverHighlight={hoverHighlight}
        onHoverHighlightChange={setHoverHighlight}
        // Pasar nuevas props a TableConfigModal
        stickyHeader={stickyHeader}
        onStickyHeaderChange={setStickyHeader}
        tableFontSize={tableFontSize}
        onTableFontSizeChange={setTableFontSize}
        cellTextAlignment={cellTextAlignment}
        onCellTextAlignmentChange={setCellTextAlignment}
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
