"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type PaginationState,
  type VisibilityState,
  type ColumnSizingState,
} from "@tanstack/react-table";

import PageSubheader from "@/components/dashboard/page-subheader";
import { DataTable } from "@/components/dashboard/data-table";
import AdvancedFilterBuilder, {
  type AdvancedFilterCondition,
} from "@/components/dashboard/AdvancedFilterBuilder";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  RefreshCw,
  Settings2,
  Search as SearchIcon,
  Filter as FilterIcon,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  PlusCircle, // Icono para "Crear"
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  columns as plantillaColumns,
  mockPlantillas,
  Plantilla,
} from "./columns"; // Importar de las columnas de plantilla
import plantillaDataConfig from "./data-plantilla.json"; // Importar la configuración específica de la plantilla

// Tipos para las preferencias de la tabla
type PaginationPosition = "top" | "bottom" | "both";
type TableDensity = "compact" | "normal" | "comfortable";

interface TablePreferences {
  pageSize: number;
  paginationPosition: PaginationPosition;
  columnVisibility: VisibilityState;
  lineWrap: boolean;
  tableDensity: TableDensity;
  columnSizing: ColumnSizingState;
}

const TABLE_PREFERENCES_COOKIE_KEY = "plantillaTablePreferences"; // Clave de cookie específica
const ADVANCED_FILTERS_COOKIE_KEY = "plantillaAdvancedFilters"; // Clave de cookie específica

const PlantillaPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Usar mockPlantillas por ahora, idealmente esto vendría de una API
  const [data, setData] = useState<Plantilla[]>(() => [...mockPlantillas]);
  const [rowSelection, setRowSelection] = useState({});

  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showAdvancedFilterBuilder, setShowAdvancedFilterBuilder] =
    useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<
    AdvancedFilterCondition[]
  >([]);
  const [showDeletePrefsAlert, setShowDeletePrefsAlert] = useState(false);

  // Estados temporales para el modal de preferencias
  const [tempLineWrap, setTempLineWrap] = useState(false);
  const [tempTableDensity, setTempTableDensity] =
    useState<TableDensity>("normal");
  const [tempPageSize, setTempPageSize] = useState(10);
  const [tempPaginationPosition, setTempPaginationPosition] =
    useState<PaginationPosition>("bottom");
  const [tempColumnVisibility, setTempColumnVisibility] =
    useState<VisibilityState>({});

  const handlePreferencesModalOpenChange = (open: boolean) => {
    if (open) {
      setTempPageSize(pageSize);
      setTempPaginationPosition(paginationPosition);
      setTempColumnVisibility({ ...columnVisibility });
      setTempLineWrap(lineWrap);
      setTempTableDensity(tableDensity);
    }
    setShowPreferencesModal(open);
  };

  // Cargar columnas por defecto de data-plantilla.json
  const initialColumnVisibility = useMemo(() => {
    const visibility: VisibilityState = {};
    plantillaDataConfig.tableHeaders.forEach((header) => {
      visibility[header.accessorKey] =
        plantillaDataConfig.defaultVisibleColumns.includes(header.accessorKey);
    });
    // Asegurarse de que 'select' y 'actions' no se oculten por error si no están en defaultVisibleColumns
    // Aunque su visibilidad se controla de otra forma o no se incluye en la personalización.
    // Por ahora, las dejamos como las gestiona la tabla por defecto.
    return visibility;
  }, []);

  const [pageSize, setPageSize] = useState(10);
  const [paginationPosition, setPaginationPosition] =
    useState<PaginationPosition>("bottom");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  );
  const [lineWrap, setLineWrap] = useState(false);
  const [tableDensity, setTableDensity] = useState<TableDensity>("normal");
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  const columns = useMemo<ColumnDef<Plantilla>[]>(() => plantillaColumns, []);

  const page = searchParams.get("page") ?? "1";
  const sortParam = searchParams.get("sort");
  const searchQuery = searchParams.get("q") ?? "";

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    searchQuery
      ? [
          {
            id:
              plantillaDataConfig.tableHeaders.find((h) =>
                h.header.toLowerCase().includes("nombre")
              )?.accessorKey || "name",
            value: searchQuery,
          },
        ]
      : []
  );

  const [sorting, setSorting] = useState<SortingState>(() => {
    if (sortParam) {
      const [id, direction] = sortParam.split(".");
      if (id && (direction === "asc" || direction === "desc")) {
        return [{ id, desc: direction === "desc" }];
      }
    }
    return [];
  });

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: parseInt(page) - 1,
      pageSize: pageSize,
    }),
    [page, pageSize]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
      columnVisibility,
      columnSizing,
    },
    enableColumnResizing: true,
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true, // Cambiar a false si los datos se filtran/pagan localmente y no por API
    manualSorting: false, // Cambiar a true si la API maneja la ordenación
    manualFiltering: false, // Cambiar a true si la API maneja el filtrado
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(pagination) : updater;
      if (newState.pageSize !== pageSize) {
        setPageSize(newState.pageSize);
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (newState.pageIndex + 1).toString());
      params.set("per_page", newState.pageSize.toString());
      router.push(`?${params.toString()}`, { scroll: false });
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    rowCount: data.length, // Ajustar si la paginación es manual y el total viene de la API
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (sorting.length > 0) {
      params.set(
        "sort",
        `${sorting[0].id}.${sorting[0].desc ? "desc" : "asc"}`
      );
    } else {
      params.delete("sort");
    }

    const searchFieldKey =
      plantillaDataConfig.tableHeaders.find((h) =>
        h.header.toLowerCase().includes("nombre")
      )?.accessorKey || "name";
    const currentSearchFilter = columnFilters.find(
      (f) => f.id === searchFieldKey
    );
    if (currentSearchFilter) {
      params.set("q", String(currentSearchFilter.value) ?? "");
    } else {
      params.delete("q");
    }
    if (params.get("per_page") !== pageSize.toString()) {
      params.set("per_page", pageSize.toString());
    }

    const currentQ = searchParams.get("q") ?? "";
    const currentSort = searchParams.get("sort") ?? "";
    const currentPerPage = searchParams.get("per_page") ?? "10";

    const newQ = params.get("q") ?? "";
    const newSort = params.get("sort") ?? "";
    const newPerPage = params.get("per_page") ?? "10";

    if (
      newQ !== currentQ ||
      newSort !== currentSort ||
      newPerPage !== currentPerPage
    ) {
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [
    sorting,
    columnFilters,
    pageSize,
    router,
    searchParams,
    plantillaDataConfig.tableHeaders,
  ]);

  useEffect(() => {
    const savedFiltersString = Cookies.get(ADVANCED_FILTERS_COOKIE_KEY);
    if (savedFiltersString) {
      try {
        const parsedFilters = JSON.parse(
          savedFiltersString
        ) as AdvancedFilterCondition[];
        setAdvancedFilters(parsedFilters);
        const searchFieldKey =
          plantillaDataConfig.tableHeaders.find((h) =>
            h.header.toLowerCase().includes("nombre")
          )?.accessorKey || "name";
        const currentGlobalFilter = columnFilters.find(
          (f) => f.id === searchFieldKey
        );
        if (currentGlobalFilter && currentGlobalFilter.value) {
          table.getColumn(searchFieldKey)?.setFilterValue("");
        }
      } catch (error) {
        console.error("Error parsing advanced filters from cookie:", error);
        Cookies.remove(ADVANCED_FILTERS_COOKIE_KEY);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const evaluateProfileCondition = useCallback(
    (plantilla: Plantilla, condition: AdvancedFilterCondition): boolean => {
      const rawFieldValue = plantilla[condition.field as keyof Plantilla];

      if (condition.operator === "isEmpty") {
        return (
          rawFieldValue === null ||
          rawFieldValue === undefined ||
          String(rawFieldValue).trim() === ""
        );
      }
      if (condition.operator === "isNotEmpty") {
        return (
          rawFieldValue !== null &&
          rawFieldValue !== undefined &&
          String(rawFieldValue).trim() !== ""
        );
      }
      if (rawFieldValue === null || rawFieldValue === undefined) return false;

      const fieldValueString = String(rawFieldValue).toLowerCase();
      const filterValueString = String(condition.value).toLowerCase();

      switch (condition.operator) {
        case "contains":
          return fieldValueString.includes(filterValueString);
        case "equals":
          return fieldValueString === filterValueString;
        case "notEquals":
          return fieldValueString !== filterValueString;
        case "startsWith":
          return fieldValueString.startsWith(filterValueString);
        case "endsWith":
          return fieldValueString.endsWith(filterValueString);
        default:
          return false;
      }
    },
    []
  );

  const filterDataWithAdvancedFilters = useCallback(
    (
      sourceData: Plantilla[],
      filters: AdvancedFilterCondition[]
    ): Plantilla[] => {
      if (!filters || filters.length === 0) return sourceData;
      return sourceData.filter((plantilla) => {
        if (!filters.length) return true;
        const orGroups: AdvancedFilterCondition[][] = [];
        let currentAndGroup: AdvancedFilterCondition[] = [];
        for (let i = 0; i < filters.length; i++) {
          currentAndGroup.push(filters[i]);
          if (filters[i].conjunction === "OR" || i === filters.length - 1) {
            orGroups.push(currentAndGroup);
            currentAndGroup = [];
          }
        }
        if (orGroups.length === 0 && currentAndGroup.length > 0) {
          orGroups.push(currentAndGroup);
        }
        if (orGroups.length === 0) return true;
        for (const andGroup of orGroups) {
          if (andGroup.length === 0) continue;
          let andGroupResult = true;
          for (const condition of andGroup) {
            if (!evaluateProfileCondition(plantilla, condition)) {
              andGroupResult = false;
              break;
            }
          }
          if (andGroupResult) return true;
        }
        return false;
      });
    },
    [evaluateProfileCondition]
  );

  useEffect(() => {
    let dataToDisplay = [...mockPlantillas];
    const searchFieldKey =
      plantillaDataConfig.tableHeaders.find((h) =>
        h.header.toLowerCase().includes("nombre")
      )?.accessorKey || "name";

    if (advancedFilters.length > 0) {
      dataToDisplay = filterDataWithAdvancedFilters(
        mockPlantillas,
        advancedFilters
      );
    } else {
      const globalSearchFilter = columnFilters.find(
        (f) => f.id === searchFieldKey
      );
      if (
        globalSearchFilter &&
        typeof globalSearchFilter.value === "string" &&
        globalSearchFilter.value.trim() !== ""
      ) {
        const searchTerm = globalSearchFilter.value.toLowerCase();
        dataToDisplay = mockPlantillas.filter((plantilla) =>
          String(plantilla[searchFieldKey as keyof Plantilla])
            ?.toLowerCase()
            .includes(searchTerm)
        );
      }
    }
    setData(dataToDisplay);
  }, [
    advancedFilters,
    columnFilters,
    mockPlantillas,
    filterDataWithAdvancedFilters,
    plantillaDataConfig.tableHeaders,
  ]);

  useEffect(() => {
    const savedPrefsString = Cookies.get(TABLE_PREFERENCES_COOKIE_KEY);
    if (savedPrefsString) {
      try {
        const savedPrefs = JSON.parse(savedPrefsString) as TablePreferences;
        setPageSize(savedPrefs.pageSize ?? 10);
        setPaginationPosition(savedPrefs.paginationPosition ?? "bottom");
        setColumnVisibility(
          savedPrefs.columnVisibility ?? initialColumnVisibility
        );
        setLineWrap(savedPrefs.lineWrap ?? false);
        setTableDensity(savedPrefs.tableDensity ?? "normal");
        setColumnSizing(savedPrefs.columnSizing ?? {});

        setTempPageSize(savedPrefs.pageSize ?? 10);
        setTempPaginationPosition(savedPrefs.paginationPosition ?? "bottom");
        setTempColumnVisibility(
          savedPrefs.columnVisibility ?? initialColumnVisibility
        );
        setTempLineWrap(savedPrefs.lineWrap ?? false);
        setTempTableDensity(savedPrefs.tableDensity ?? "normal");
      } catch (error) {
        console.error("Error parsing table preferences from cookie:", error);
        Cookies.remove(TABLE_PREFERENCES_COOKIE_KEY);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const preferencesToSave: TablePreferences = {
      pageSize,
      paginationPosition,
      columnVisibility,
      lineWrap,
      tableDensity,
      columnSizing,
    };
    Cookies.set(
      TABLE_PREFERENCES_COOKIE_KEY,
      JSON.stringify(preferencesToSave),
      { expires: 365 }
    );
  }, [
    pageSize,
    paginationPosition,
    columnVisibility,
    lineWrap,
    tableDensity,
    columnSizing,
  ]);

  const totalPages = table.getPageCount();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const searchFieldKey =
      plantillaDataConfig.tableHeaders.find((h) =>
        h.header.toLowerCase().includes("nombre")
      )?.accessorKey || "name";
    table.getColumn(searchFieldKey)?.setFilterValue(value);
    if (value.trim() !== "") {
      if (advancedFilters.length > 0) {
        setAdvancedFilters([]);
        Cookies.remove(ADVANCED_FILTERS_COOKIE_KEY);
      }
    }
    table.setPageIndex(0);
  };

  const handlePageChange = (newPageOneBased: number) => {
    table.setPageIndex(newPageOneBased - 1);
  };

  const handleApplyAdvancedFilters = (filters: AdvancedFilterCondition[]) => {
    setAdvancedFilters(filters);
    Cookies.set(ADVANCED_FILTERS_COOKIE_KEY, JSON.stringify(filters), {
      expires: 7,
    });
    const searchFieldKey =
      plantillaDataConfig.tableHeaders.find((h) =>
        h.header.toLowerCase().includes("nombre")
      )?.accessorKey || "name";
    table.getColumn(searchFieldKey)?.setFilterValue(""); // Limpiar búsqueda global
    setShowAdvancedFilterBuilder(false);
    table.setPageIndex(0);
  };

  const handleClearAdvancedFiltersFromModal = () => {
    setAdvancedFilters([]);
    Cookies.remove(ADVANCED_FILTERS_COOKIE_KEY);
    setShowAdvancedFilterBuilder(false);
    table.setPageIndex(0);
  };

  const handleApplyPreferences = () => {
    setPageSize(tempPageSize);
    setPaginationPosition(tempPaginationPosition);
    setColumnVisibility(tempColumnVisibility);
    setLineWrap(tempLineWrap);
    setTableDensity(tempTableDensity);
    // Nota: columnSizing se actualiza directamente por la tabla, pero si quisiéramos un "aplicar" explícito para él,
    // necesitaríamos un tempColumnSizing y actualizarlo aquí.
    setShowPreferencesModal(false);
  };

  const handleResetPreferences = () => {
    // Restablecer a valores por defecto (o los iniciales del componente)
    const defaultPageSize = 10;
    const defaultPaginationPosition: PaginationPosition = "bottom";
    const defaultColumnVisibility = initialColumnVisibility; // Usar el recalculado
    const defaultLineWrap = false;
    const defaultTableDensity: TableDensity = "normal";
    const defaultColumnSizing = {};

    // Aplicar directamente y también a los temporales para reflejar en el modal
    setPageSize(defaultPageSize);
    setPaginationPosition(defaultPaginationPosition);
    setColumnVisibility(defaultColumnVisibility);
    setLineWrap(defaultLineWrap);
    setTableDensity(defaultTableDensity);
    setColumnSizing(defaultColumnSizing); // Restablecer tamaño de columnas

    setTempPageSize(defaultPageSize);
    setTempPaginationPosition(defaultPaginationPosition);
    setTempColumnVisibility(defaultColumnVisibility);
    setTempLineWrap(defaultLineWrap);
    setTempTableDensity(defaultTableDensity);

    Cookies.remove(TABLE_PREFERENCES_COOKIE_KEY); // Eliminar la cookie
    setShowDeletePrefsAlert(false); // Cerrar el diálogo de alerta
    // setShowPreferencesModal(false); // Opcionalmente cerrar el modal de preferencias también
  };

  const renderPaginationControls = () => {
    if (
      totalPages <= 1 &&
      paginationPosition !== "top" &&
      paginationPosition !== "both"
    )
      return null;

    return (
      <div
        className={`flex items-center justify-between py-4 ${
          lineWrap ? "flex-col gap-y-2 sm:flex-row" : ""
        }`}
      >
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="hidden lg:flex"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Anterior</span>
          </Button>

          <div className="flex items-center space-x-1 text-xs">
            <span>Página</span>
            <Input
              type="number"
              min="1"
              max={totalPages > 0 ? totalPages : 1}
              value={pagination.pageIndex + 1}
              onChange={(e) => {
                const pageNum = e.target.value ? Number(e.target.value) : 0;
                if (pageNum > 0 && pageNum <= totalPages) {
                  handlePageChange(pageNum);
                }
              }}
              onBlur={(e) => {
                // Para manejar el caso de que el input quede vacío
                const pageNum = e.target.value ? Number(e.target.value) : 1;
                if (pageNum <= 0) handlePageChange(1);
                else if (pageNum > totalPages) handlePageChange(totalPages);
              }}
              onKeyDown={(e) => {
                // Permitir Enter para cambiar de página
                if (e.key === "Enter") {
                  const inputElement = e.target as HTMLInputElement;
                  const pageNum = inputElement.value
                    ? Number(inputElement.value)
                    : 1;
                  if (pageNum > 0 && pageNum <= totalPages) {
                    handlePageChange(pageNum);
                  } else if (pageNum <= 0) {
                    handlePageChange(1);
                  } else {
                    handlePageChange(totalPages);
                  }
                  inputElement.blur(); // Quitar foco del input
                }
              }}
              className="h-8 w-12 px-1 text-center"
            />
            <span>de {totalPages > 0 ? totalPages : 1}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="hidden sm:inline mr-1">Siguiente</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
            className="hidden lg:flex"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 ml-auto pl-4 hidden sm:flex">
          <span className="text-sm text-muted-foreground">
            Filas por página:
          </span>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <>
      <PageSubheader
        title={plantillaDataConfig.pageTitle}
        description={plantillaDataConfig.pageDescription}
      >
        <div className="flex items-center gap-x-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={plantillaDataConfig.searchPlaceholder}
              value={
                (table
                  .getColumn(
                    plantillaDataConfig.tableHeaders.find((h) =>
                      h.header.toLowerCase().includes("nombre")
                    )?.accessorKey || "name"
                  )
                  ?.getFilterValue() as string) ?? ""
              }
              onChange={handleSearchChange}
              className="pl-8 w-full md:w-[200px] lg:w-[300px]"
            />
          </div>
          <Dialog
            open={showAdvancedFilterBuilder}
            onOpenChange={setShowAdvancedFilterBuilder}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="relative">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filtros Avanzados
                {advancedFilters.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  >
                    {advancedFilters.length}
                  </Badge>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl p-0">
              <DialogHeader className="p-6 pb-0">
                <DialogTitle>Constructor de Filtros Avanzados</DialogTitle>
                <DialogDescription>
                  Cree condiciones de filtro complejas para refinar los
                  resultados de{" "}
                  {plantillaDataConfig.entityNamePlural.toLowerCase()}.
                </DialogDescription>
              </DialogHeader>
              <AdvancedFilterBuilder
                columns={plantillaColumns}
                initialFilters={advancedFilters} // Corregido: 'initialConditions' a 'initialFilters'
                onApplyFilters={handleApplyAdvancedFilters}
                onClose={() => setShowAdvancedFilterBuilder(false)}
                onClearFilters={handleClearAdvancedFiltersFromModal}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            open={showPreferencesModal}
            onOpenChange={handlePreferencesModalOpenChange}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings2 className="h-4 w-4" />
                <span className="sr-only">Preferencias de Tabla</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Preferencias de la Tabla</DialogTitle>
                <DialogDescription>
                  Personaliza la apariencia y el comportamiento de la tabla de{" "}
                  {plantillaDataConfig.entityNamePlural.toLowerCase()}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div>
                  <Label htmlFor="pageSize" className="text-sm font-medium">
                    Filas por página
                  </Label>
                  <Select
                    value={String(tempPageSize)}
                    onValueChange={(value) => setTempPageSize(Number(value))}
                  >
                    <SelectTrigger id="pageSize" className="w-full mt-1">
                      <SelectValue placeholder="Seleccionar tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 30, 40, 50].map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="paginationPosition"
                    className="text-sm font-medium"
                  >
                    Posición de la paginación
                  </Label>
                  <Select
                    value={tempPaginationPosition}
                    onValueChange={(value: string) =>
                      setTempPaginationPosition(value as PaginationPosition)
                    }
                  >
                    <SelectTrigger
                      id="paginationPosition"
                      className="w-full mt-1"
                    >
                      <SelectValue placeholder="Seleccionar posición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Superior</SelectItem>
                      <SelectItem value="bottom">Inferior</SelectItem>
                      <SelectItem value="both">Ambas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Visibilidad de Columnas
                  </Label>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 max-h-48 overflow-y-auto">
                    {table.getAllLeafColumns().map((column) => {
                      // No permitir ocultar selección o acciones desde aquí
                      if (column.id === "select" || column.id === "actions") {
                        return null;
                      }
                      const headerConfig =
                        plantillaDataConfig.tableHeaders.find(
                          (h) => h.accessorKey === column.id
                        );
                      return (
                        <div
                          key={column.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`col-${column.id}`}
                            checked={
                              tempColumnVisibility[column.id] ??
                              column.getIsVisible()
                            }
                            onCheckedChange={(value) => {
                              setTempColumnVisibility((prev) => ({
                                ...prev,
                                [column.id]: !!value,
                              }));
                            }}
                          />
                          <Label
                            htmlFor={`col-${column.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {headerConfig?.header || column.id}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lineWrap"
                    checked={tempLineWrap}
                    onCheckedChange={(value) => setTempLineWrap(!!value)}
                  />
                  <Label
                    htmlFor="lineWrap"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Ajuste de línea en celdas
                  </Label>
                </div>
                <div>
                  <Label htmlFor="tableDensity" className="text-sm font-medium">
                    Densidad de la tabla
                  </Label>
                  <Select
                    value={tempTableDensity}
                    onValueChange={(value: string) =>
                      setTempTableDensity(value as TableDensity)
                    }
                  >
                    <SelectTrigger id="tableDensity" className="w-full mt-1">
                      <SelectValue placeholder="Seleccionar densidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compacta</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="comfortable">Cómoda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <AlertDialog
                  open={showDeletePrefsAlert}
                  onOpenChange={setShowDeletePrefsAlert}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Restablecer Preferencias
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Restablecer preferencias?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esto restablecerá todas las preferencias de la tabla a
                        sus valores por defecto. Esta acción no se puede
                        deshacer.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleResetPreferences}>
                        Sí, restablecer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowPreferencesModal(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handleApplyPreferences}>
                  Aplicar Preferencias
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Crear {plantillaDataConfig.entityName}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              /* Lógica para refrescar datos */
            }}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refrescar datos</span>
          </Button>
        </div>
      </PageSubheader>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {(paginationPosition === "top" || paginationPosition === "both") &&
          renderPaginationControls()}
        <Card className="border shadow-sm mt-2">
          <CardContent className="p-0">
            <DataTable
              table={table}
              lineWrap={lineWrap}
              tableDensity={tableDensity} // Corregido: 'density' a 'tableDensity'
            />
          </CardContent>
        </Card>
        {(paginationPosition === "bottom" || paginationPosition === "both") &&
          renderPaginationControls()}
      </div>
    </>
  );
};

export default PlantillaPage;
