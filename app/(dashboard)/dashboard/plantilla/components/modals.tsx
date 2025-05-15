"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2, X } from "lucide-react";
import type { UserData } from "./data-table"; // Asumiendo que UserData está aquí o se importa correctamente

// Definición de las columnas disponibles para filtrar (basado en UserData y DataTable)
// Esto podría pasarse como prop o definirse de forma más dinámica
const availableColumns: { value: keyof UserData; label: string }[] = [
  { value: "nombreCompleto", label: "Nombre Completo" },
  { value: "email", label: "Email" },
  { value: "rol", label: "Rol" },
  //   { value: "ultimoAcceso", label: "Último Acceso" }, // Fechas pueden requerir un date picker
];

// Operadores de filtro
const filterOperators = [
  { value: "contains", label: "Contiene" },
  { value: "not_contains", label: "No contiene" },
  { value: "equals", label: "Igual a" },
  { value: "not_equals", label: "No es igual a" },
  { value: "starts_with", label: "Comienza con" },
  { value: "ends_with", label: "Termina con" },
  // Para numéricos/fechas (requeriría validación/manejo especial)
  // { value: "gt", label: "Mayor que" },
  // { value: "lt", label: "Menor que" },
  // { value: "gte", label: "Mayor o igual que" },
  // { value: "lte", label: "Menor o igual que" },
];

const logicalOperators = [
  { value: "AND", label: "Y" },
  { value: "OR", label: "O" },
];

export interface AdvancedFilterCondition {
  id: string; // Para el key en React
  field: keyof UserData | "";
  operator: string;
  value: string;
  logicalOperator?: "AND" | "OR";
}

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: AdvancedFilterCondition[]) => void;
  onClearFilters: () => void;
  initialFilters?: AdvancedFilterCondition[];
  // columns prop podría usarse si se quiere pasar dinámicamente
  // columns: { value: keyof UserData; label: string }[];
}

export const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  initialFilters = [],
}) => {
  const [filters, setFilters] = useState<AdvancedFilterCondition[]>(initialFilters);

  useEffect(() => {
    // Si no hay filtros iniciales o se borran, asegurar al menos una fila vacía
    if (initialFilters.length === 0 && filters.length === 0) {
      setFilters([
        {
          id: Date.now().toString(),
          field: "",
          operator: "contains",
          value: "",
        },
      ]);
    } else {
      setFilters(initialFilters);
    }
  }, [initialFilters]);


  const handleAddFilter = () => {
    setFilters([
      ...filters,
      {
        id: Date.now().toString(),
        field: "",
        operator: "contains",
        value: "",
        logicalOperator: filters.length > 0 ? "AND" : undefined, // Por defecto AND si no es el primero
      },
    ]);
  };

  const handleRemoveFilter = (id: string) => {
    const newFilters = filters.filter((filter) => filter.id !== id);
    // Si se elimina el primer filtro y hay más, quitar el operador lógico del nuevo primer filtro
    if (newFilters.length > 0 && filters.findIndex(f => f.id === id) === 0) {
        delete newFilters[0].logicalOperator;
    }
    setFilters(newFilters.length > 0 ? newFilters : []); // Dejar vacío si no hay filtros
  };

  const handleFilterChange = (
    id: string,
    field: keyof AdvancedFilterCondition,
    value: any
  ) => {
    setFilters(
      filters.map((filter) =>
        filter.id === id ? { ...filter, [field]: value } : filter
      )
    );
  };

  const handleApply = () => {
    // Filtrar condiciones incompletas antes de aplicar
    const validFilters = filters.filter(f => f.field && f.operator && f.value.trim() !== "");
    onApplyFilters(validFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters([
      {
        id: Date.now().toString(),
        field: "",
        operator: "contains",
        value: "",
      },
    ]);
    onClearFilters(); // Llama a la prop para que la página también limpie
    // onClose(); // Opcional: cerrar modal al limpiar
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Filtros Avanzados</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          {filters.map((filter, index) => (
            <div key={filter.id} className="space-y-2">
              {index > 0 && (
                <div className="flex justify-center mb-2">
                  <Select
                    value={filter.logicalOperator}
                    onValueChange={(value: "AND" | "OR") =>
                      handleFilterChange(filter.id, "logicalOperator", value)
                    }
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Operador" />
                    </SelectTrigger>
                    <SelectContent>
                      {logicalOperators.map((op) => (
                        <SelectItem key={op.value} value={op.value}>
                          {op.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                <Select
                  value={filter.field}
                  onValueChange={(value: keyof UserData | "") =>
                    handleFilterChange(filter.id, "field", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar columna" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColumns.map((col) => (
                      <SelectItem key={col.value} value={col.value}>
                        {col.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filter.operator}
                  onValueChange={(value) =>
                    handleFilterChange(filter.id, "operator", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar operador" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOperators.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Valor"
                  value={filter.value}
                  onChange={(e) =>
                    handleFilterChange(filter.id, "value", e.target.value)
                  }
                />
              </div>
              {filters.length > 0 && ( // Mostrar botón de eliminar solo si hay filtros
                 <div className="flex justify-end mt-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFilter(filter.id)}
                        className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                    >
                        <Trash2 className="mr-1 h-4 w-4" /> Eliminar
                    </Button>
                 </div>
              )}
            </div>
          ))}
        </div>

        <Button variant="outline" onClick={handleAddFilter} className="w-full sm:w-auto">
          <PlusCircle className="mr-2 h-4 w-4" /> Añadir Filtro
        </Button>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={handleClear}>
            Borrar Filtros
          </Button>
          <Button onClick={handleApply}>Aplicar Filtros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};