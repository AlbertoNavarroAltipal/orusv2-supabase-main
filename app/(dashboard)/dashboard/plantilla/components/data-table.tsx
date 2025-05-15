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
  // Props para filtros, selección de columnas se agregarán aquí
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

  // `columns` podría memoizarse con useMemo si fuera más complejo o dependiera de props
  const columns = [
    { accessorKey: 'nombreCompleto', header: 'Nombre Completo' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'rol', header: 'Rol' },
    { accessorKey: 'ultimoAcceso', header: 'Último Acceso' },
  ];

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const firstItemOnPage = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const lastItemOnPage = totalItems > 0 ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

  // console.log("DataTable rendered. CurrentPage:", currentPage, "SortBy:", sortBy, "SortOrder:", sortOrder, "Data length:", initialData.length);


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
      <PaginationControls />
      <div className="overflow-x-auto"> {/* Contenedor para scroll horizontal si es necesario y para el sticky header */}
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white"> {/* Header pegajoso */}
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                  disabled={tableData.length === 0}
                />
              </TableHead>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>
                  <Button variant="ghost" onClick={() => onSortChange(column.accessorKey as keyof UserData)}>
                    {column.header}
                    {sortBy === column.accessorKey ? (
                      sortOrder === 'asc' ? <ArrowUpDown className="ml-2 h-4 w-4 text-blue-500" /> : <ArrowUpDown className="ml-2 h-4 w-4 text-blue-500 transform rotate-180" />
                    ) : (
                      <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                    )}
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell className="w-[40px]">
                    <Skeleton className="h-4 w-4" />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.accessorKey}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : tableData.length > 0 ? (
              tableData.map((row) => (
                <TableRow key={row.id} data-state={row.selected && "selected"}>
                  <TableCell>
                    <Checkbox
                      checked={!!row.selected} // Asegurar que sea booleano
                      onCheckedChange={(checked) => handleRowSelect(row.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>{row.nombreCompleto}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.rol}</TableCell>
                  <TableCell>{row.ultimoAcceso}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PaginationControls />
    </div>
  );
};

export default memo(DataTableComponent);