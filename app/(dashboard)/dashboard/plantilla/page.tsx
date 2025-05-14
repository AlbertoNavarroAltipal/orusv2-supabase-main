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
  columns as commentColumns,
  CommentEntry, 
} from "./columns";
import commentDataConfig from "./data-plantilla.json"; 

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

const TABLE_PREFERENCES_COOKIE_KEY = "commentsTablePreferences"; 
const ADVANCED_FILTERS_COOKIE_KEY = "commentsAdvancedFilters"; 

const CommentsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<CommentEntry[]>([]);
  const [originalData, setOriginalData] = useState<CommentEntry[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [totalRowCount, setTotalRowCount] = useState(0); 

  const [rowSelection, setRowSelection] = useState({});
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showAdvancedFilterBuilder, setShowAdvancedFilterBuilder] =
    useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<
    AdvancedFilterCondition[]
  >([]);
  const [showDeletePrefsAlert, setShowDeletePrefsAlert] = useState(false);

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

  const initialColumnVisibility = useMemo(() => {
    const visibility: VisibilityState = {};
    commentDataConfig.tableHeaders.forEach((header: { accessorKey: string; header: string; }) => {
      visibility[header.accessorKey] =
        commentDataConfig.defaultVisibleColumns.includes(header.accessorKey);
    });
    return visibility;
  }, []);
  
  const pageParam = searchParams.get(commentDataConfig.pagination.paramPage) ?? "1";
  const perPageParam = searchParams.get(commentDataConfig.pagination.paramLimit) ?? "10";

  const [pageSize, setPageSize] = useState(parseInt(perPageParam, 10));
  const [paginationPosition, setPaginationPosition] =
    useState<PaginationPosition>("bottom");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  );
  const [lineWrap, setLineWrap] = useState(false);
  const [tableDensity, setTableDensity] = useState<TableDensity>("normal");
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  const columns = useMemo<ColumnDef<CommentEntry>[]>(() => commentColumns, []);

  const sortParam = searchParams.get("sort");
  const searchQuery = searchParams.get("q") ?? "";

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    searchQuery
      ? [
          {
            id: commentDataConfig.searchFieldAccessorKey || "name", 
            value: searchQuery,
          },
        ]
      : []
  );

  const [sorting, setSorting] = useState<SortingState>(() => {
    if (sortParam) {
      const [id, direction] = sortParam.split(".");
      // Validar que 'id' sea una columna existente antes de aplicarlo
      const columnExists = commentDataConfig.tableHeaders.some(
        (col: {accessorKey: string}) => col.accessorKey === id
      );
      if (columnExists && (direction === "asc" || direction === "desc")) {
        return [{ id, desc: direction === "desc" }];
      }
    }
    return [];
  });

  const pagination = useMemo<PaginationState>(
    () => ({
      pageIndex: parseInt(pageParam) - 1,
      pageSize: pageSize,
    }),
    [pageParam, pageSize]
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
    manualPagination: commentDataConfig.pagination.enabled, 
    manualSorting: false, 
    manualFiltering: true, 
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(pagination) : updater;
      
      const params = new URLSearchParams(searchParams.toString());
      params.set(commentDataConfig.pagination.paramPage, (newState.pageIndex + 1).toString());
      params.set(commentDataConfig.pagination.paramLimit, newState.pageSize.toString());
      
      // Solo actualiza pageSize si realmente cambió para evitar bucles
      if (newState.pageSize !== pageSize) {
        setPageSize(newState.pageSize);
      }
      
      router.push(`?${params.toString()}`, { scroll: false });
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    rowCount: commentDataConfig.pagination.enabled ? totalRowCount : data.length, 
  });

  const fetchDataFromApi = useCallback(async () => {
      setIsLoading(true);
      setApiError(null);
      
      const currentPage = table.getState().pagination.pageIndex + 1;
      const currentLimit = table.getState().pagination.pageSize;
      
      let apiUrl = commentDataConfig.apiEndpoint;

      if(commentDataConfig.pagination.enabled) {
        const apiParams = new URLSearchParams();
        apiParams.set(commentDataConfig.pagination.paramPage, currentPage.toString());
        apiParams.set(commentDataConfig.pagination.paramLimit, currentLimit.toString());
        apiUrl = `${commentDataConfig.apiEndpoint}?${apiParams.toString()}`;
      }

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          let errorData;
          try { errorData = await response.json(); } catch (e) {}
          const errorMessage = `Error ${response.status}: ${response.statusText}${errorData?.message ? ` - ${errorData.message}` : ''}`;
          throw new Error(errorMessage);
        }
        const resultData: CommentEntry[] = await response.json();
        const total = response.headers.get('x-total-count');
        setTotalRowCount(total ? parseInt(total, 10) : resultData.length);
        setOriginalData(resultData);
        setData(resultData); 
      } catch (err: any) {
        setApiError(err.message || "Ocurrió un error al refrescar los datos.");
        setShowErrorModal(true);
        setOriginalData([]);
        setData([]);
        setTotalRowCount(0);
      } finally {
        setIsLoading(false);
      }
  }, [table, commentDataConfig.apiEndpoint, commentDataConfig.pagination.enabled, commentDataConfig.pagination.paramPage, commentDataConfig.pagination.paramLimit ]);


  // Efecto para actualizar URL con filtros y ordenación (cliente)
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

    const searchFieldKey = commentDataConfig.searchFieldAccessorKey || "name";
    const currentSearchFilter = columnFilters.find(
      (f) => f.id === searchFieldKey
    );
    if (currentSearchFilter && String(currentSearchFilter.value).trim() !== "") {
      params.set("q", String(currentSearchFilter.value));
    } else {
      params.delete("q");
    }
    
    // Actualizar parámetros de paginación en la URL si han cambiado por el estado de la tabla
    const tablePageIndex = table.getState().pagination.pageIndex + 1;
    const tablePageSize = table.getState().pagination.pageSize;

    if (params.get(commentDataConfig.pagination.paramPage) !== tablePageIndex.toString()) {
        params.set(commentDataConfig.pagination.paramPage, tablePageIndex.toString());
    }
    if (params.get(commentDataConfig.pagination.paramLimit) !== tablePageSize.toString()) {
        params.set(commentDataConfig.pagination.paramLimit, tablePageSize.toString());
    }


    const currentSortQuery = searchParams.get("sort") ?? "";
    const currentQQuery = searchParams.get("q") ?? "";
    const currentPageQuery = searchParams.get(commentDataConfig.pagination.paramPage) ?? "1";
    const currentPerPageQuery = searchParams.get(commentDataConfig.pagination.paramLimit) ?? "10";
    
    if( params.get("sort") !== currentSortQuery || 
        params.get("q") !== currentQQuery ||
        params.get(commentDataConfig.pagination.paramPage) !== currentPageQuery ||
        params.get(commentDataConfig.pagination.paramLimit) !== currentPerPageQuery
    ) {
        router.push(`?${params.toString()}`, { scroll: false });
    }

  }, [sorting, columnFilters, router, searchParams, commentDataConfig.searchFieldAccessorKey, table, commentDataConfig.pagination.paramPage, commentDataConfig.pagination.paramLimit]);


  // Efecto para cargar datos de la API cuando cambian los parámetros de paginación o se monta
  useEffect(() => {
    fetchDataFromApi();
  }, [fetchDataFromApi]); 

  // Efecto para cargar filtros avanzados de cookies
  useEffect(() => {
    const savedFiltersString = Cookies.get(ADVANCED_FILTERS_COOKIE_KEY);
    if (savedFiltersString) {
      try {
        const parsedFilters = JSON.parse(
          savedFiltersString
        ) as AdvancedFilterCondition[];
        setAdvancedFilters(parsedFilters);
        const searchFieldKey =
          commentDataConfig.searchFieldAccessorKey || "name";
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
    (comment: CommentEntry, condition: AdvancedFilterCondition): boolean => {
      const rawFieldValue = comment[condition.field as keyof CommentEntry];

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
      sourceData: CommentEntry[],
      filters: AdvancedFilterCondition[]
    ): CommentEntry[] => {
      if (!filters || filters.length === 0) return sourceData;
      return sourceData.filter((comment) => {
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
            if (!evaluateProfileCondition(comment, condition)) {
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

  // Efecto para aplicar filtros (global y avanzado) a los datos cargados
  // Este efecto ahora opera sobre `originalData` (datos de la página actual si hay paginación server-side)
  useEffect(() => {
    let dataToDisplay = [...originalData]; 
    const searchFieldKey =
      commentDataConfig.searchFieldAccessorKey || "name";

    if (advancedFilters.length > 0) {
      dataToDisplay = filterDataWithAdvancedFilters(
        originalData,
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
        dataToDisplay = originalData.filter(
          (comment: CommentEntry) => 
            String(comment[searchFieldKey as keyof CommentEntry])
              ?.toLowerCase()
              .includes(searchTerm)
        );
      }
    }
    setData(dataToDisplay); // setData ahora refleja los datos filtrados de la página actual
  }, [
    advancedFilters,
    columnFilters,
    originalData, // Depende de originalData que viene de la API
    filterDataWithAdvancedFilters,
    commentDataConfig.searchFieldAccessorKey,
  ]);

  // Efecto para cargar/guardar preferencias de tabla
  useEffect(() => {
    const savedPrefsString = Cookies.get(TABLE_PREFERENCES_COOKIE_KEY);
    if (savedPrefsString) {
      try {
        const savedPrefs = JSON.parse(savedPrefsString) as TablePreferences;
        // No establecer pageSize directamente aquí si la paginación es del servidor,
        // se maneja a través de la URL y el estado de la tabla.
        // setPageSize(savedPrefs.pageSize ?? 10); 
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
      pageSize, // Guardar el pageSize actual
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

  const totalPagesCalculated = commentDataConfig.pagination.enabled ? Math.ceil(totalRowCount / pageSize) : table.getPageCount();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const searchFieldKey =
      commentDataConfig.searchFieldAccessorKey || "name";
    table.getColumn(searchFieldKey)?.setFilterValue(value);
    if (value.trim() !== "") {
      if (advancedFilters.length > 0) {
        setAdvancedFilters([]);
        Cookies.remove(ADVANCED_FILTERS_COOKIE_KEY);
      }
    }
    // Si la paginación es del servidor, la búsqueda se aplicará al recargar datos.
    // Si es del cliente, resetear a la primera página.
    if (!commentDataConfig.pagination.enabled) {
        table.setPageIndex(0);
    }
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
      commentDataConfig.searchFieldAccessorKey || "name";
    table.getColumn(searchFieldKey)?.setFilterValue(""); 
    setShowAdvancedFilterBuilder(false);
    if (!commentDataConfig.pagination.enabled) {
        table.setPageIndex(0);
    }
  };

  const handleClearAdvancedFiltersFromModal = () => {
    setAdvancedFilters([]);
    Cookies.remove(ADVANCED_FILTERS_COOKIE_KEY);
    setShowAdvancedFilterBuilder(false);
     if (!commentDataConfig.pagination.enabled) {
        table.setPageIndex(0);
    }
  };

  const handleApplyPreferences = () => {
    // Actualizar pageSize en la URL si la paginación es del servidor
    if (commentDataConfig.pagination.enabled && tempPageSize !== pageSize) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(commentDataConfig.pagination.paramLimit, tempPageSize.toString());
        params.set(commentDataConfig.pagination.paramPage, "1"); // Reset to page 1 on page size change
        router.push(`?${params.toString()}`, { scroll: false });
    }
    setPageSize(tempPageSize); // Actualiza el estado local, lo que disparará useEffect de carga si es necesario
    setPaginationPosition(tempPaginationPosition);
    setColumnVisibility(tempColumnVisibility);
    setLineWrap(tempLineWrap);
    setTableDensity(tempTableDensity);
    setShowPreferencesModal(false);
  };

  const handleResetPreferences = () => {
    const defaultPageSize = 10;
    const defaultPaginationPosition: PaginationPosition = "bottom";
    const defaultColumnVisibility = initialColumnVisibility; 
    const defaultLineWrap = false;
    const defaultTableDensity: TableDensity = "normal";
    const defaultColumnSizing = {};

    if (commentDataConfig.pagination.enabled && defaultPageSize !== pageSize) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(commentDataConfig.pagination.paramLimit, defaultPageSize.toString());
        params.set(commentDataConfig.pagination.paramPage, "1");
        router.push(`?${params.toString()}`, { scroll: false });
    }
    setPageSize(defaultPageSize);
    setPaginationPosition(defaultPaginationPosition);
    setColumnVisibility(defaultColumnVisibility);
    setLineWrap(defaultLineWrap);
    setTableDensity(defaultTableDensity);
    setColumnSizing(defaultColumnSizing); 

    setTempPageSize(defaultPageSize);
    setTempPaginationPosition(defaultPaginationPosition);
    setTempColumnVisibility(defaultColumnVisibility);
    setTempLineWrap(defaultLineWrap);
    setTempTableDensity(defaultTableDensity);
    
    Cookies.remove(TABLE_PREFERENCES_COOKIE_KEY); 
    setShowDeletePrefsAlert(false); 
  };
  

  const renderPaginationControls = () => {
    const currentTotalPages = totalPagesCalculated;
    if (currentTotalPages <= 1 && paginationPosition !== "top" && paginationPosition !== "both") return null;

    return (
      <div className={`flex items-center justify-between py-4 ${lineWrap ? "flex-col gap-y-2 sm:flex-row" : ""}`}>
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
          {commentDataConfig.pagination.enabled && ` (Total: ${totalRowCount})`}
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
              max={currentTotalPages > 0 ? currentTotalPages : 1}
              value={pagination.pageIndex + 1}
              onChange={(e) => {
                const pageNum = e.target.value ? Number(e.target.value) : 0;
                if (pageNum > 0 && pageNum <= currentTotalPages) {
                  handlePageChange(pageNum);
                }
              }}
              onBlur={(e) => { 
                const pageNum = e.target.value ? Number(e.target.value) : 1;
                if (pageNum <= 0) handlePageChange(1);
                else if (pageNum > currentTotalPages) handlePageChange(currentTotalPages);
              }}
              onKeyDown={(e) => { 
                if (e.key === 'Enter') {
                    const inputElement = e.target as HTMLInputElement;
                    const pageNum = inputElement.value ? Number(inputElement.value) : 1;
                    if (pageNum > 0 && pageNum <= currentTotalPages) {
                        handlePageChange(pageNum);
                    } else if (pageNum <= 0) {
                        handlePageChange(1);
                    } else {
                        handlePageChange(currentTotalPages);
                    }
                    inputElement.blur(); 
                }
              }}
              className="h-8 w-12 px-1 text-center"
            />
            <span>de {currentTotalPages > 0 ? currentTotalPages : 1}</span>
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
            onClick={() => table.setPageIndex(currentTotalPages - 1)}
            disabled={!table.getCanNextPage()}
            className="hidden lg:flex"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 ml-auto pl-4 hidden sm:flex">
            <span className="text-sm text-muted-foreground">Filas por página:</span>
            <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                    // Esto actualizará el estado local y la URL si es necesario,
                    // lo que a su vez disparará fetchDataFromApi
                    const newPageSize = Number(value);
                    if (commentDataConfig.pagination.enabled) {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set(commentDataConfig.pagination.paramLimit, newPageSize.toString());
                        params.set(commentDataConfig.pagination.paramPage, "1"); // Reset to page 1
                        router.push(`?${params.toString()}`, { scroll: false });
                    }
                    setPageSize(newPageSize); 
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
        title={commentDataConfig.pageTitle}
        description={commentDataConfig.pageDescription}
      >
        <div className="flex items-center gap-x-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={commentDataConfig.searchPlaceholder}
              value={(table.getColumn(commentDataConfig.searchFieldAccessorKey || "name")?.getFilterValue() as string) ?? ""}
              onChange={handleSearchChange}
              className="pl-8 w-full md:w-[200px] lg:w-[300px]"
            />
          </div>
          <Dialog open={showAdvancedFilterBuilder} onOpenChange={setShowAdvancedFilterBuilder}>
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
                  Cree condiciones de filtro complejas para refinar los resultados de {commentDataConfig.entityNamePlural.toLowerCase()}.
                </DialogDescription>
              </DialogHeader>
              <AdvancedFilterBuilder
                columns={commentColumns} 
                initialFilters={advancedFilters} 
                onApplyFilters={handleApplyAdvancedFilters}
                onClose={() => setShowAdvancedFilterBuilder(false)} 
                onClearFilters={handleClearAdvancedFiltersFromModal}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showPreferencesModal} onOpenChange={handlePreferencesModalOpenChange}>
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
                  Personaliza la apariencia y el comportamiento de la tabla de {commentDataConfig.entityNamePlural.toLowerCase()}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div>
                  <Label htmlFor="pageSize" className="text-sm font-medium">Filas por página</Label>
                  <Select
                    value={String(tempPageSize)}
                    onValueChange={(value) => setTempPageSize(Number(value))}
                  >
                    <SelectTrigger id="pageSize" className="w-full mt-1">
                      <SelectValue placeholder="Seleccionar tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 30, 40, 50].map((size) => (
                        <SelectItem key={size} value={String(size)}>{size}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="paginationPosition" className="text-sm font-medium">Posición de la paginación</Label>
                  <Select
                    value={tempPaginationPosition}
                    onValueChange={(value: string) => setTempPaginationPosition(value as PaginationPosition)}
                  >
                    <SelectTrigger id="paginationPosition" className="w-full mt-1">
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
                  <Label className="text-sm font-medium">Visibilidad de Columnas</Label>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 max-h-48 overflow-y-auto">
                    {table.getAllLeafColumns().map((column) => {
                      if (column.id === "select" || column.id === "actions") {
                        return null;
                      }
                      const headerConfig = commentDataConfig.tableHeaders.find((h: { accessorKey: string; header: string; }) => h.accessorKey === column.id);
                      return (
                        <div key={column.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`col-${column.id}`}
                            checked={tempColumnVisibility[column.id] ?? column.getIsVisible()}
                            onCheckedChange={(value) => {
                              setTempColumnVisibility((prev) => ({
                                ...prev,
                                [column.id]: !!value,
                              }));
                            }}
                          />
                          <Label htmlFor={`col-${column.id}`} className="text-sm font-normal cursor-pointer">
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
                  <Label htmlFor="lineWrap" className="text-sm font-normal cursor-pointer">Ajuste de línea en celdas</Label>
                </div>
                <div>
                  <Label htmlFor="tableDensity" className="text-sm font-medium">Densidad de la tabla</Label>
                  <Select
                    value={tempTableDensity}
                    onValueChange={(value: string) => setTempTableDensity(value as TableDensity)}
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
                <AlertDialog open={showDeletePrefsAlert} onOpenChange={setShowDeletePrefsAlert}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Restablecer Preferencias
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Restablecer preferencias?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esto restablecerá todas las preferencias de la tabla a sus valores por defecto.
                        Esta acción no se puede deshacer.
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
                <Button variant="outline" onClick={() => setShowPreferencesModal(false)}>Cancelar</Button>
                <Button onClick={handleApplyPreferences}>Aplicar Preferencias</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="icon" onClick={fetchDataFromApi}>
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refrescar datos</span>
          </Button>
        </div>
      </PageSubheader>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {isLoading && <p className="text-center py-4">Cargando comentarios...</p> }
        {!isLoading && apiError && !showErrorModal && (
          <div className="text-red-600 text-center py-4">
            Error al cargar los datos: {apiError}. Intente refrescar.
          </div>
        )}
        {!isLoading && !apiError && (
          <>
            {(paginationPosition === "top" || paginationPosition === "both") && renderPaginationControls()}
            <Card className="border shadow-sm mt-2">
              <CardContent className="p-0">
                <DataTable
                  table={table}
                  lineWrap={lineWrap}
                  tableDensity={tableDensity} 
                />
              </CardContent>
            </Card>
            {(paginationPosition === "bottom" || paginationPosition === "both") && renderPaginationControls()}
          </>
        )}
      </div>

      {showErrorModal && (
        <AlertDialog open={showErrorModal} onOpenChange={setShowErrorModal}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Error de API</AlertDialogTitle>
              <AlertDialogDescription>
                {apiError || "Ocurrió un error desconocido al contactar la API."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowErrorModal(false)}>Entendido</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default CommentsPage;
