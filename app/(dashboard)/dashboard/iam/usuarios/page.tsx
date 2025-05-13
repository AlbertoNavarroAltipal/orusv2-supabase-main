"use client";

import React, { useEffect, useMemo, useState } from "react";
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
  type Table,
  type VisibilityState,
  type ColumnSizingState,
} from "@tanstack/react-table";

import PageSubheader from "@/components/dashboard/page-subheader";
import { DataTable } from "@/components/dashboard/data-table";
import { columns as initialUserColumns, users as mockUsers } from "./columns";
import { Profile } from "@/types/user";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

// Tipos para las preferencias de la tabla
type PaginationPosition = "top" | "bottom" | "both";
type TableDensity = "compact" | "normal" | "comfortable";

interface TablePreferences {
  pageSize: number;
  paginationPosition: PaginationPosition;
  columnVisibility: VisibilityState;
  lineWrap: boolean;
  tableDensity: TableDensity;
  columnSizing: ColumnSizingState; // Añadir columnSizing a la interfaz
}

const TABLE_PREFERENCES_COOKIE_KEY = "iamUserTablePreferences";

const IAMUsuariosPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<Profile[]>(() => [...mockUsers]);
  const [rowSelection, setRowSelection] = useState({});

  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false); // Movido aquí para agrupar con otros controles de modal/dialogo
  const [showDeletePrefsAlert, setShowDeletePrefsAlert] = useState(false); // Añadir el estado faltante

  const [tempLineWrap, setTempLineWrap] = useState(false);
  const [tempTableDensity, setTempTableDensity] =
    useState<TableDensity>("normal");
  const [tempPageSize, setTempPageSize] = useState(10);
  const [tempPaginationPosition, setTempPaginationPosition] =
    useState<PaginationPosition>("bottom");
  const [tempColumnVisibility, setTempColumnVisibility] =
    useState<VisibilityState>({});

  // Función para manejar la apertura/cierre del modal de preferencias y sincronizar estados temporales
  const handlePreferencesModalOpenChange = (open: boolean) => {
    if (open) {
      // Al abrir, copiar los estados actuales (principales) a los temporales
      setTempPageSize(pageSize);
      setTempPaginationPosition(paginationPosition);
      setTempColumnVisibility({ ...columnVisibility }); // Copiar el objeto para evitar mutación directa
      setTempLineWrap(lineWrap);
      setTempTableDensity(tableDensity);
    }
    setShowPreferencesModal(open);
  };

  // const [showFiltersModal, setShowFiltersModal] = useState(false); // Ya se movió arriba

  // Estados para filtros avanzados
  const [roleFilter, setRoleFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [phoneFilter, setPhoneFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [positionFilter, setPositionFilter] = useState("");

  // Preferencias de la tabla (con valores por defecto iniciales, se cargarán de cookies)
  const initialColumnVisibility: VisibilityState = {
    phone: false,
    avatar_url: false,
    department: false,
    position: false,
    // Las demás columnas (full_name, email, role, last_sign_in) serán visibles por defecto
  };

  const [pageSize, setPageSize] = useState(10);
  const [paginationPosition, setPaginationPosition] =
    useState<PaginationPosition>("bottom");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  );
  const [lineWrap, setLineWrap] = useState(false);
  const [tableDensity, setTableDensity] = useState<TableDensity>("normal");
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({});

  const userColumns = useMemo<ColumnDef<Profile>[]>(
    () => initialUserColumns,
    []
  );

  const page = searchParams.get("page") ?? "1";
  // pageSize se maneja con el estado local ahora, pero se sincroniza con la URL
  const sortParam = searchParams.get("sort");
  const searchQuery = searchParams.get("q") ?? "";

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    searchQuery ? [{ id: "full_name", value: searchQuery }] : []
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
      pageSize: pageSize, // Usar el estado local pageSize
    }),
    [page, pageSize]
  );

  const table = useReactTable({
    data,
    columns: userColumns,
    state: {
      sorting,
      columnFilters,
      pagination,
      rowSelection,
      columnVisibility,
      columnSizing, // Añadir columnSizing al estado de la tabla
    },
    enableColumnResizing: true, // Habilitar redimensionamiento de columnas
    onColumnSizingChange: setColumnSizing, // Manejar cambios de tamaño de columna
    onColumnVisibilityChange: setColumnVisibility,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    manualSorting: false,
    manualFiltering: false,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater(pagination) : updater;
      // Actualizar el estado local de pageSize si cambia
      if (newState.pageSize !== pageSize) {
        setPageSize(newState.pageSize);
      }
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (newState.pageIndex + 1).toString());
      params.set("per_page", newState.pageSize.toString()); // Asegurar que per_page se actualice
      router.push(`?${params.toString()}`, { scroll: false });
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    rowCount: data.length,
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
    const currentSearchFilter = columnFilters.find((f) => f.id === "full_name");
    if (currentSearchFilter) {
      params.set("q", String(currentSearchFilter.value) ?? "");
    } else {
      params.delete("q");
    }
    // Sincronizar per_page con la URL si cambia desde el estado local
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
  }, [sorting, columnFilters, pageSize, router, searchParams]);

  // Cargar preferencias de cookies al montar
  useEffect(() => {
    const savedPrefsString = Cookies.get(TABLE_PREFERENCES_COOKIE_KEY);
    if (savedPrefsString) {
      try {
        const savedPrefs = JSON.parse(savedPrefsString) as TablePreferences;
        setPageSize(savedPrefs.pageSize ?? 10);
        setPaginationPosition(savedPrefs.paginationPosition ?? "bottom");
        // Al cargar de cookies, usar lo guardado, o los iniciales si la cookie no tiene visibilidad
        setColumnVisibility(
          savedPrefs.columnVisibility ?? initialColumnVisibility
        );
        setLineWrap(savedPrefs.lineWrap ?? false);
        setTableDensity(savedPrefs.tableDensity ?? "normal");

        // Sincronizar estados temporales con los cargados de cookies al inicio
        setTempLineWrap(savedPrefs.lineWrap ?? false);
        setTempTableDensity(savedPrefs.tableDensity ?? "normal");
        setTempPageSize(savedPrefs.pageSize ?? 10);
        setTempPaginationPosition(savedPrefs.paginationPosition ?? "bottom");
        setTempColumnVisibility(
          savedPrefs.columnVisibility ?? initialColumnVisibility
        );

        // Aplicar pageSize a la tabla inmediatamente después de cargar de cookies
        table.setPageSize(savedPrefs.pageSize ?? 10);
      } catch (error) {
        console.error("Error parsing table preferences from cookie:", error);
        // Opcional: borrar cookie si está corrupta
        // Cookies.remove(TABLE_PREFERENCES_COOKIE_KEY);
      }
    }
    // Sincronizar pageSize con la URL si no está ya allí
    const params = new URLSearchParams(searchParams.toString());
    if (!params.has("per_page")) {
      params.set(
        "per_page",
        (savedPrefsString
          ? JSON.parse(savedPrefsString).pageSize
          : 10
        ).toString()
      );
      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router, table]); // table se añade como dependencia para setPageSize

  // Guardar preferencias en cookies cuando cambien
  useEffect(() => {
    const preferencesToSave: TablePreferences = {
      pageSize,
      paginationPosition,
      columnVisibility,
      lineWrap,
      tableDensity,
      columnSizing, // Guardar también columnSizing
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
    table.getColumn("full_name")?.setFilterValue(value);
    table.setPageIndex(0);
  };

  const handlePageChange = (newPageOneBased: number) => {
    table.setPageIndex(newPageOneBased - 1);
  };

  const selectedRowCount = table.getSelectedRowModel().rows.length;

  const renderPaginationControls = () => {
    const { pageIndex, pageSize } = table.getState().pagination;
    const totalRows = table.getFilteredRowModel().rows.length; // O table.getCoreRowModel().rows.length si se prefiere el total sin filtrar
    const firstRowOnPage = pageIndex * pageSize + 1;
    const lastRowOnPage = Math.min((pageIndex + 1) * pageSize, totalRows);

    let pageInfoText = "";
    if (totalRows > 0) {
      pageInfoText = `Mostrando ${firstRowOnPage}-${lastRowOnPage} de ${totalRows} usuarios.`;
    } else {
      pageInfoText = "No hay usuarios para mostrar.";
    }
    if (selectedRowCount > 0) {
      pageInfoText = `${selectedRowCount} de ${
        table.getCoreRowModel().rows.length
      } fila(s) seleccionadas.`;
    }

    // Lógica simplificada para mostrar números de página (ejemplo básico)
    // Podría mejorarse para mostrar elipsis de forma más inteligente o usar una librería si es muy complejo
    const pageNumbers = [];
    const maxPagesToShow = 5; // Máximo de números de página a mostrar directamente
    const currentPage = pageIndex + 1;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Siempre mostrar la primera página
      if (currentPage > 3) {
        pageNumbers.push(-1); // Indicador de elipsis
      }

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        startPage = 2;
        endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
      } else if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - (maxPagesToShow - 2));
        endPage = totalPages - 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2 && endPage < totalPages - 1) {
        pageNumbers.push(-1); // Indicador de elipsis
      }
      pageNumbers.push(totalPages); // Siempre mostrar la última página
    }
    // Eliminar duplicados en caso de que totalPages sea muy pequeño y se solapen rangos
    const uniquePageNumbers = [...new Set(pageNumbers)];

    return (
      <div className="flex items-center justify-between space-x-2 py-2">
        <div className="text-xs text-muted-foreground">{pageInfoText}</div>{" "}
        {/* Leyenda a la izquierda */}
        {/* Contenedor para el selector de tamaño de página y los controles de paginación, alineados a la derecha */}
        <div className="flex items-center space-x-4">
          {/*
          <div className="flex items-center space-x-1">
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                const newSize = Number(value);
                setPageSize(newSize);
                table.setPageSize(newSize);
                if (showPreferencesModal) {
                  setTempPageSize(newSize);
                }
                const params = new URLSearchParams(searchParams.toString());
                params.set("page", "1");
                params.set("per_page", newSize.toString());
                router.push(`?${params.toString()}`, { scroll: false });
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          */}

          {totalPages > 0 && (
            <div className="flex items-center space-x-1"> {/* Este div ahora es el primer hijo directo de space-x-4 si totalPages > 0 */}
              <Button
                variant="outline" // Mantener outline para estos, o cambiar a "ghost" si se prefiere sin borde
                // O aplicar color primario: variant="default" o className="bg-primary text-primary-foreground hover:bg-primary/90"
                // Por ahora, mantendremos outline para consistencia con los botones de acción de la tabla, pero se puede cambiar.
                // Para un color distintivo, podríamos usar "secondary" o un color personalizado.
                // Vamos a probar con "secondary" para diferenciarlos de los botones de acción principales.
                // O si el tema tiene un color de acento para paginación, usar ese.
                // Por simplicidad y consistencia con el diseño general de shadcn, los botones de paginación suelen ser "outline" o "ghost".
                // Si se quiere color, se puede añadir una clase específica o usar `variant="default"` si el default es colorido.
                // Para este ejemplo, usaré `variant="default"` asumiendo que el tema lo colorea.
                // Si no, se necesitaría una clase CSS personalizada o ajustar el tema.
                // Reconsiderando: Los botones de paginación de shadcn/ui suelen ser `outline` o `ghost`.
                // Para colorearlos, es mejor usar `variant="default"` si el tema lo soporta, o clases específicas.
                // Vamos a mantenerlos `outline` por ahora para no romper el diseño visual estándar de shadcn sin más contexto del tema.
                // El usuario pidió "colocar color", así que intentaremos con `variant="default"` y si no, se puede refinar.
                // Si `variant="default"` no da el color esperado, se puede usar `className` con colores de Tailwind.
                // Ejemplo con Tailwind: className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white"
                // Por ahora, probemos `variant="default"`
                variant="default"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Primera página</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Página anterior</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center space-x-1 text-xs">
                <span>Página</span>
                <Input
                  type="number"
                  min={1}
                  max={totalPages}
                  // Para evitar problemas con el valor controlado y el cursor,
                  // podríamos usar un estado local para el input si la edición directa es problemática.
                  // Por ahora, se mantiene el valor directo de la tabla.
                  defaultValue={pageIndex + 1} // Usar defaultValue para permitir edición y luego manejar onBlur o Enter
                  onBlur={(e) => {
                    // Aplicar al perder el foco
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    if (page >= 0 && page < totalPages) {
                      table.setPageIndex(page);
                    } else {
                      // Si el valor es inválido, resetear al valor actual de la tabla
                      e.target.value = (pageIndex + 1).toString();
                    }
                  }}
                  onKeyDown={(e) => {
                    // Aplicar al presionar Enter
                    if (e.key === "Enter") {
                      const page = (e.target as HTMLInputElement).value
                        ? Number((e.target as HTMLInputElement).value) - 1
                        : 0;
                      if (page >= 0 && page < totalPages) {
                        table.setPageIndex(page);
                      } else {
                        (e.target as HTMLInputElement).value = (
                          pageIndex + 1
                        ).toString();
                      }
                    }
                  }}
                  className="h-8 w-12 p-1 text-center border-input" // Asegurar borde visible
                />
                <span>de {totalPages}</span>
              </div>

              <Button
                variant="default"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Página siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                className="h-8 w-8 p-0"
                onClick={() => table.setPageIndex(totalPages - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Última página</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }; // Cierre de renderPaginationControls

  return (
    <>
      <PageSubheader
        title="Usuarios"
        description="Gestione los usuarios del sistema y sus accesos."
      >
        <div className="flex items-center gap-x-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              value={
                (table.getColumn("full_name")?.getFilterValue() as string) ?? ""
              }
              onChange={handleSearchChange}
              className="h-9 pl-8 max-w-xs"
            />
          </div>
          <Dialog open={showFiltersModal} onOpenChange={setShowFiltersModal}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <FilterIcon className="h-3.5 w-3.5" />
                Filtrar
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Filtros Avanzados</DialogTitle>
                <DialogDescription>
                  Defina filtros adicionales para refinar la lista de usuarios.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="roleFilter" className="text-right">
                    Rol
                  </Label>
                  <Input
                    id="roleFilter"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: Administrador"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="emailFilter" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="emailFilter"
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: usuario@ejemplo.com"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phoneFilter" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    id="phoneFilter"
                    value={phoneFilter}
                    onChange={(e) => setPhoneFilter(e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: 3001234567"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="departmentFilter" className="text-right">
                    Departamento
                  </Label>
                  <Input
                    id="departmentFilter"
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: Ventas"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="positionFilter" className="text-right">
                    Cargo
                  </Label>
                  <Input
                    id="positionFilter"
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                    className="col-span-3"
                    placeholder="Ej: Gerente"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    // Opcional: Resetear filtros al cancelar
                    setRoleFilter("");
                    setEmailFilter("");
                    setPhoneFilter("");
                    setDepartmentFilter("");
                    setPositionFilter("");
                    setShowFiltersModal(false);
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    // Lógica para aplicar filtros (por ahora un alert)
                    const activeFilters = {
                      role: roleFilter,
                      email: emailFilter,
                      phone: phoneFilter,
                      department: departmentFilter,
                      position: positionFilter,
                    };
                    alert(
                      "Filtros a aplicar: \n" +
                        JSON.stringify(activeFilters, null, 2)
                    );
                    // Aquí se integraría con la lógica de filtrado de la tabla
                    setShowFiltersModal(false);
                  }}
                >
                  Aplicar Filtros
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 border"
            onClick={() => setData([...mockUsers])}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Dialog
            open={showPreferencesModal}
            onOpenChange={handlePreferencesModalOpenChange}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 border">
                <Settings2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Preferencias de Tabla</DialogTitle>
                <DialogDescription>
                  Personalice la visualización de la tabla de usuarios.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div>
                  <Label htmlFor="pageSizePref" className="text-sm font-medium">
                    Tamaño de Página
                  </Label>
                  <Select
                    value={String(tempPageSize)}
                    onValueChange={(value) => setTempPageSize(Number(value))}
                  >
                    <SelectTrigger id="pageSizePref" className="w-full mt-1">
                      <SelectValue placeholder="Seleccionar tamaño" />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 30, 40, 50].map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size} por página
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="paginationPositionPref"
                    className="text-sm font-medium"
                  >
                    Posición del Paginador
                  </Label>
                  <Select
                    value={tempPaginationPosition}
                    onValueChange={(value: PaginationPosition) =>
                      setTempPaginationPosition(value)
                    }
                  >
                    <SelectTrigger
                      id="paginationPositionPref"
                      className="w-full mt-1"
                    >
                      <SelectValue placeholder="Seleccionar posición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Arriba</SelectItem>
                      <SelectItem value="bottom">Abajo</SelectItem>
                      <SelectItem value="both">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Visibilidad de Columnas
                  </h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {table.getAllLeafColumns().map((column) => {
                      if (column.id === "select" || column.id === "actions")
                        return null;
                      return (
                        <div
                          key={column.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`col-vis-temp-${column.id}`}
                            checked={tempColumnVisibility[column.id] ?? false} // Usar temp y default a false si no existe
                            onCheckedChange={(value) => {
                              setTempColumnVisibility((prev) => ({
                                ...prev,
                                [column.id]: !!value,
                              }));
                            }}
                          />
                          <Label
                            htmlFor={`col-vis-temp-${column.id}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {typeof column.columnDef.header === "function"
                              ? column.id
                              : typeof column.columnDef.header === "string"
                              ? column.columnDef.header
                              : column.id}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lineWrapPref"
                    checked={tempLineWrap}
                    onCheckedChange={(checked) =>
                      setTempLineWrap(Boolean(checked))
                    }
                  />
                  <Label
                    htmlFor="lineWrapPref"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Ajuste de línea
                  </Label>
                </div>
                <div>
                  <Label
                    htmlFor="tableDensityPref"
                    className="text-sm font-medium"
                  >
                    Densidad de Tabla
                  </Label>
                  <Select
                    value={tempTableDensity}
                    onValueChange={(value: TableDensity) =>
                      setTempTableDensity(value)
                    }
                  >
                    <SelectTrigger
                      id="tableDensityPref"
                      className="w-full mt-1"
                    >
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
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full mt-2"
                    >
                      {" "}
                      {/* Color rojo y margen */}
                      Borrar preferencias guardadas
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Está realmente seguro?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se borrarán
                        permanentemente sus preferencias de tabla guardadas y se
                        restaurarán los valores por defecto.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => setShowDeletePrefsAlert(false)}
                      >
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          Cookies.remove(TABLE_PREFERENCES_COOKIE_KEY);
                          const defaultPrefs: TablePreferences = {
                            pageSize: 10,
                            paginationPosition: "bottom",
                            columnVisibility: initialColumnVisibility,
                            lineWrap: false,
                            tableDensity: "normal",
                            columnSizing: {},
                          };
                          setPageSize(defaultPrefs.pageSize);
                          table.setPageSize(defaultPrefs.pageSize);
                          setPaginationPosition(
                            defaultPrefs.paginationPosition
                          );
                          setColumnVisibility(defaultPrefs.columnVisibility);
                          table.setColumnVisibility(
                            defaultPrefs.columnVisibility
                          );
                          setLineWrap(defaultPrefs.lineWrap);
                          setTableDensity(defaultPrefs.tableDensity);
                          setColumnSizing(defaultPrefs.columnSizing);
                          table.resetColumnSizing();

                          setTempPageSize(defaultPrefs.pageSize);
                          setTempPaginationPosition(
                            defaultPrefs.paginationPosition
                          );
                          setTempColumnVisibility(
                            defaultPrefs.columnVisibility
                          );
                          setTempLineWrap(defaultPrefs.lineWrap);
                          setTempTableDensity(defaultPrefs.tableDensity);

                          const params = new URLSearchParams(
                            searchParams.toString()
                          );
                          params.set(
                            "per_page",
                            defaultPrefs.pageSize.toString()
                          );
                          router.push(`?${params.toString()}`, {
                            scroll: false,
                          });
                          setShowDeletePrefsAlert(false); // Cerrar el diálogo de alerta
                        }}
                      >
                        Sí, borrar preferencias
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handlePreferencesModalOpenChange(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    // Aplicar los estados temporales a los estados principales
                    setPageSize(tempPageSize);
                    table.setPageSize(tempPageSize);
                    setPaginationPosition(tempPaginationPosition);
                    setColumnVisibility(tempColumnVisibility);
                    table.setColumnVisibility(tempColumnVisibility);
                    setLineWrap(tempLineWrap);
                    setTableDensity(tempTableDensity);
                    // Aplicar columnSizing no es necesario aquí directamente ya que se maneja por la tabla
                    // y se guarda en cookies a través del useEffect principal.

                    const params = new URLSearchParams(searchParams.toString());
                    if (params.get("per_page") !== tempPageSize.toString()) {
                      params.set("per_page", tempPageSize.toString());
                      router.push(`?${params.toString()}`, { scroll: false });
                    }
                    handlePreferencesModalOpenChange(false); // Cerrar modal
                  }}
                >
                  Aplicar Preferencias
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="outline"
            className="h-9"
            disabled={selectedRowCount === 0}
            onClick={() => alert(`Eliminar ${selectedRowCount} usuarios`)}
          >
            Eliminar {selectedRowCount > 0 ? `(${selectedRowCount})` : ""}
          </Button>
          <Button
            className="bg-primary-500 hover:bg-primary-600 text-primary-foreground h-9"
            onClick={() => alert("Crear nuevo usuario")}
          >
            Crear Usuario
          </Button>
        </div>
      </PageSubheader>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {(paginationPosition === "top" || paginationPosition === "both") &&
          renderPaginationControls()}
        <Card className="border shadow-sm mt-2">
          {" "}
          {/* Añadido mt-2 si paginador está arriba */}
          <CardContent className="p-0">
            <DataTable
              table={table}
              lineWrap={lineWrap}
              tableDensity={tableDensity}
            />
          </CardContent>
        </Card>
        {(paginationPosition === "bottom" || paginationPosition === "both") &&
          renderPaginationControls()}
      </div>
    </>
  );
}; // Cierre del componente IAMUsuariosPage

export default IAMUsuariosPage;
