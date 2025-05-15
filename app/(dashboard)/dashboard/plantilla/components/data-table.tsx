"use client";

import React, { useState, useEffect, memo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Importar Skeleton
import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// Definición del tipo para los datos de usuario, basado en la imagen
export interface UserData {
  id: string; // o number, dependiendo de tus datos
  nombreCompleto: string;
  email: string;
  rol: string;
  ultimoAcceso: string; // Podría ser Date si se maneja como objeto Date
  selected?: boolean; // Para el checkbox
}

interface DataTableProps {
  data: UserData[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (size: number) => void;
  sortBy: keyof UserData | null;
  sortOrder: 'asc' | 'desc';
  onSortChange: (columnKey: keyof UserData) => void;
  isLoading?: boolean; // Añadir isLoading como prop opcional
  visibleColumns: (keyof UserData)[];
  paginationPosition?: "top" | "bottom" | "both" | "none"; // 'both' por defecto si no se especifica
  enableSorting?: boolean;
  enableRowSelection?: boolean;
  tableDensity?: "compact" | "normal" | "spacious";
  showGridLines?: boolean;
  stripedRows?: boolean;
  hoverHighlight?: boolean;
  stickyHeader?: boolean;
  tableFontSize?: "xs" | "sm" | "base";
  cellTextAlignment?: "left" | "center" | "right";
}

const DataTableComponent: React.FC<DataTableProps> = ({
  data: initialData,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  sortBy,
  sortOrder,
  onSortChange,
  isLoading = false, // Valor por defecto para isLoading
  visibleColumns,
  paginationPosition = "both", // Valor por defecto
  enableSorting = true,
  enableRowSelection = true,
  tableDensity = "normal",
  showGridLines = true,
  stripedRows = false,
  hoverHighlight = true,
  stickyHeader = true,
  tableFontSize = "sm",
  cellTextAlignment = "left",
}) => {
  const [tableData, setTableData] = useState<UserData[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    setTableData(initialData.map(item => ({ ...item, selected: false })));
    // Deseleccionar todo cuando cambian los datos (ej. cambio de página)
    setSelectAll(false);
  }, [initialData]);

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setTableData(prevData => prevData.map(row => ({ ...row, selected: checked })));
  };

  const handleRowSelect = (id: string, checked: boolean) => {
    setTableData(prevData =>
      prevData.map(row => (row.id === id ? { ...row, selected: checked } : row))
    );
    if (!checked) {
      setSelectAll(false);
    } else {
      // Verifica si todas las demás filas están seleccionadas, además de la actual
      const allOthersSelected = tableData
        .filter(row => row.id !== id)
        .every(row => row.selected);
      if (allOthersSelected && tableData.length > 0) {
         setSelectAll(true);
      }
    }
  };

  // `columns` ahora se define como todas las columnas posibles, luego se filtra.
  const allPossibleColumns: { accessorKey: keyof UserData; header: string }[] = [
    { accessorKey: 'nombreCompleto', header: 'Nombre Completo' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'rol', header: 'Rol' },
    { accessorKey: 'ultimoAcceso', header: 'Último Acceso' },
    // Asegúrate de que 'id' esté aquí si alguna vez se necesita mostrar, aunque usualmente no.
    // { accessorKey: 'id', header: 'ID' },
  ];

  const displayedColumns = React.useMemo(() => {
    return allPossibleColumns.filter(col => visibleColumns.includes(col.accessorKey));
  }, [visibleColumns, allPossibleColumns]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const firstItemOnPage = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const lastItemOnPage = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  // console.log("DataTable rendered. CurrentPage:", currentPage, "SortBy:", sortBy, "SortOrder:", sortOrder, "Data length:", initialData.length);

  const densityClasses = {
    compact: "py-1 px-2",
    normal: "py-2 px-3", // O las clases por defecto de shadcn/ui TableCell
    spacious: "py-4 px-3",
  };
  const currentDensityClass = densityClasses[tableDensity];

  const fontSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
  };
  const currentFontSizeClass = fontSizeClasses[tableFontSize];

  const textAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  const currentTextAlignClass = textAlignClasses[cellTextAlignment];

  const tableClasses = React.useMemo(() => {
    let classes = "";
    if (!showGridLines) {
      classes += " border-0";
    }
    classes += ` ${currentFontSizeClass}`;
    return classes;
  }, [showGridLines, currentFontSizeClass]);

  const rowClasses = (rowIndex: number) => {
    let classes = "";
    if (hoverHighlight) {
      classes += " hover:bg-muted/50";
    }
    if (stripedRows && rowIndex % 2 !== 0) { // 0-indexed, so odd index is even row visually
      classes += " bg-muted/10"; // Un color más sutil para striped
    }
    if (!showGridLines) {
        // Podríamos necesitar quitar bordes de las filas si la clase de Table no es suficiente
        // classes += " border-b-0";
    }
    return classes;
  };


  const PaginationControls = () => (
    <div className="flex items-center justify-between p-4 border-t">
      <div className="text-sm text-muted-foreground">
        {totalItems > 0 ? `Mostrando ${firstItemOnPage}-${lastItemOnPage} de ${totalItems} usuarios.` : 'No hay usuarios.'}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" onClick={() => onPageChange(1)} disabled={currentPage === 1 || totalPages === 0}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1 || totalPages === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Página {totalPages > 0 ? currentPage : 0} de {totalPages > 0 ? totalPages : 0}
        </span>
        <Button variant="outline" size="icon" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages || totalPages === 0 || totalPages < 1}>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      {(paginationPosition === "top" || paginationPosition === "both") && <PaginationControls />}
      <div className="overflow-x-auto"> {/* Contenedor para scroll horizontal si es necesario y para el sticky header */}
        <Table className={tableClasses}>
          <TableHeader
            className={`${stickyHeader ? 'sticky top-0 z-10' : ''} bg-white ${!showGridLines ? 'border-b-0' : ''}`}
          >
            <TableRow className={!showGridLines ? 'border-b-0' : ''}>
              {enableRowSelection && (
                <TableHead className={`w-[40px] ${currentDensityClass} ${!showGridLines ? 'border-0' : ''} ${currentTextAlignClass}`}>
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                    disabled={tableData.length === 0}
                  />
                </TableHead>
              )}
              {displayedColumns.map((column) => (
                <TableHead key={column.accessorKey} className={`${currentDensityClass} ${!showGridLines ? 'border-0' : ''} ${currentTextAlignClass}`}>
                  {enableSorting ? (
                    <Button variant="ghost" onClick={() => onSortChange(column.accessorKey as keyof UserData)}>
                      {column.header}
                      {sortBy === column.accessorKey ? (
                        sortOrder === 'asc' ? <ArrowUpDown className="ml-2 h-4 w-4 text-blue-500" /> : <ArrowUpDown className="ml-2 h-4 w-4 text-blue-500 transform rotate-180" />
                      ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                      )}
                    </Button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className={!showGridLines ? 'divide-y-0' : ''}>
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`} className={`${rowClasses(index)} ${!showGridLines ? 'border-b-0' : ''}`}>
                  {enableRowSelection && (
                    <TableCell className={`w-[40px] ${currentDensityClass} ${!showGridLines ? 'border-0' : ''} ${currentTextAlignClass}`}>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                  )}
                  {displayedColumns.map((column) => (
                    <TableCell key={column.accessorKey} className={`${currentDensityClass} ${!showGridLines ? 'border-0' : ''} ${currentTextAlignClass}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tableData.length > 0 ? (
              tableData.map((row, rowIndex) => (
                <TableRow key={row.id} data-state={row.selected && "selected"} className={`${rowClasses(rowIndex)} ${!showGridLines ? 'border-b-0' : ''}`}>
                  {enableRowSelection && (
                    <TableCell className={`${currentDensityClass} ${!showGridLines ? 'border-0' : ''} ${currentTextAlignClass}`}>
                      <Checkbox
                        checked={!!row.selected} // Asegurar que sea booleano
                        onCheckedChange={(checked) => handleRowSelect(row.id, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  {/* Renderizar celdas dinámicamente según displayedColumns */}
                  {displayedColumns.map(column => (
                    <TableCell key={column.accessorKey} className={`${currentDensityClass} ${!showGridLines ? 'border-0' : ''} ${currentTextAlignClass}`}>
                      {row[column.accessorKey as keyof UserData]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className={!showGridLines ? 'border-b-0' : ''}>
                <TableCell
                  colSpan={displayedColumns.length + (enableRowSelection ? 1 : 0)}
                  className={`h-24 text-center ${currentDensityClass} ${!showGridLines ? 'border-0' : ''}`}
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {(paginationPosition === "bottom" || paginationPosition === "both") && <PaginationControls />}
    </div>
  );
};

export default memo(DataTableComponent);