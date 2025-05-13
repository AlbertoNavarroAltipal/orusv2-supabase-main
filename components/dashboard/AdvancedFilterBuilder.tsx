"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2, XCircle } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

// Definición de la estructura para una condición de filtro avanzado
export interface AdvancedFilterCondition {
  id: string; // Identificador único para la condición
  field: string; // El ID de la columna a filtrar (ej: 'email', 'full_name')
  fieldName?: string; // Nombre legible de la columna (ej: 'Correo Electrónico', 'Nombre Completo')
  operator: string; // El operador (ej: 'contains', 'equals', 'startsWith', 'endsWith', 'notEquals', 'gt', 'lt', 'gte', 'lte')
  value: any; // El valor a filtrar
  conjunction: "AND" | "OR"; // Cómo se combina esta condición con la SIGUIENTE (la primera no usa la conjunción previa)
}

// Operadores disponibles (podemos expandir esto)
// TODO: Considerar tipos de datos de las columnas para ofrecer operadores relevantes
const OPERATORS = [
  { value: "contains", label: "Contiene" },
  { value: "equals", label: "Es igual a" },
  { value: "notEquals", label: "No es igual a" },
  { value: "startsWith", label: "Comienza con" },
  { value: "endsWith", label: "Termina con" },
  { value: "isEmpty", label: "Está vacío" },
  { value: "isNotEmpty", label: "No está vacío" },
  // Operadores numéricos/fecha (ejemplo)
  // { value: 'gt', label: 'Mayor que' },
  // { value: 'lt', label: 'Menor que' },
  // { value: 'gte', label: 'Mayor o igual que' },
  // { value: 'lte', label: 'Menor o igual que' },
];

interface AdvancedFilterBuilderProps<TData> {
  columns: ColumnDef<TData, any>[]; // Columnas de la tabla para seleccionar campos
  initialFilters?: AdvancedFilterCondition[];
  onApplyFilters: (filters: AdvancedFilterCondition[]) => void;
  onClose: () => void;
  onClearFilters?: () => void; // Nueva prop opcional
}

const AdvancedFilterBuilder = <TData extends {}>({
  columns,
  initialFilters = [],
  onApplyFilters,
  onClose,
  onClearFilters, // Recibir la nueva prop
}: AdvancedFilterBuilderProps<TData>) => {
  const [filterConditions, setFilterConditions] =
    useState<AdvancedFilterCondition[]>(initialFilters);

  // Obtener campos filtrables de las columnas
  // Se asume que las columnas que pueden ser filtradas tienen un `accessorKey` o `id`
  // y un `header` que puede ser usado como `fieldName`.
  // Podríamos necesitar una propiedad explícita en ColumnDef para marcar como filtrable y obtener el tipo de dato.
  const filterableColumns = columns.reduce((acc, col) => {
    // Intentar obtener 'id' o 'accessorKey' de forma segura
    let id: string | undefined;
    if ('id' in col && col.id) {
      id = col.id;
    } else if ('accessorKey' in col && col.accessorKey) {
      id = String(col.accessorKey);
    }

    let label: string | undefined;
    if (typeof col.header === 'string') {
      label = col.header;
    } else if (id) {
      // Si header no es string, usar id como fallback para label si existe
      label = id;
    }
    // Considerar también col.header como función o ReactNode si es necesario un manejo más complejo para el label

    if (id && label) {
      acc.push({
        value: id,
        label: label,
        // TODO: Determinar el tipo de dato de la columna para ofrecer operadores y inputs adecuados
        // type: col.meta?.filterType || 'text' (ejemplo de cómo podríamos obtener el tipo)
      });
    }
    return acc;
  }, [] as { value: string; label: string }[]);

  const addCondition = (conjunction: "AND" | "OR" = "AND") => {
    const newCondition: AdvancedFilterCondition = {
      id: Date.now().toString(), // ID simple basado en timestamp
      field: filterableColumns.length > 0 ? filterableColumns[0].value : "",
      fieldName: filterableColumns.length > 0 ? filterableColumns[0].label : "",
      operator: OPERATORS[0].value,
      value: "",
      conjunction: conjunction,
    };
    setFilterConditions((prev) => [...prev, newCondition]);
  };

  const updateCondition = (
    index: number,
    updatedFields: Partial<AdvancedFilterCondition>
  ) => {
    const newConditions = [...filterConditions];
    newConditions[index] = { ...newConditions[index], ...updatedFields };
    if (updatedFields.field) {
      const selectedColumn = filterableColumns.find(
        (col) => col.value === updatedFields.field
      );
      newConditions[index].fieldName =
        selectedColumn?.label || updatedFields.field;
    }
    setFilterConditions(newConditions);
  };

  const removeCondition = (index: number) => {
    setFilterConditions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApply = () => {
    // TODO: Validar filtros antes de aplicar
    onApplyFilters(filterConditions);
    // No cerramos el modal aquí, se maneja desde la página principal o el Dialog
  };

  const handleClearAndClose = () => {
    if (onClearFilters) {
      onClearFilters();
    }
    // onClose(); // El cierre del modal principal lo maneja la página que lo invoca
  };


  return (
    <div className="p-4 bg-background text-foreground"> {/* Eliminado rounded-lg shadow-lg max-w-2xl mx-auto, ya que el DialogContent lo maneja */}
      {/* El div que contenía el título y el botón XCircle ha sido eliminado */}
      <div className="space-y-3 mb-4 max-h-96 overflow-y-auto pr-2">
        {filterConditions.map((condition, index) => (
          <div key={condition.id} className="p-3 border rounded-md bg-card">
            {index > 0 && (
              <div className="mb-2">
                <Select
                  value={condition.conjunction}
                  onValueChange={(value: "AND" | "OR") =>
                    updateCondition(index, { conjunction: value })
                  }
                >
                  <SelectTrigger className="w-24 h-8 text-xs">
                    <SelectValue placeholder="Unir con..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AND">Y</SelectItem>
                    <SelectItem value="OR">O</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
              <div>
                <label
                  htmlFor={`field-${condition.id}`}
                  className="text-xs font-medium text-muted-foreground"
                >
                  Campo
                </label>
                <Select
                  value={condition.field}
                  onValueChange={(value) =>
                    updateCondition(index, { field: value })
                  }
                >
                  <SelectTrigger id={`field-${condition.id}`} className="h-9">
                    <SelectValue placeholder="Seleccionar campo..." />
                  </SelectTrigger>
                  <SelectContent>
                    {filterableColumns.map((col) => (
                      <SelectItem key={col.value} value={col.value}>
                        {col.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor={`operator-${condition.id}`}
                  className="text-xs font-medium text-muted-foreground"
                >
                  Operador
                </label>
                <Select
                  value={condition.operator}
                  onValueChange={(value) =>
                    updateCondition(index, { operator: value })
                  }
                >
                  <SelectTrigger
                    id={`operator-${condition.id}`}
                    className="h-9"
                  >
                    <SelectValue placeholder="Seleccionar operador..." />
                  </SelectTrigger>
                  <SelectContent>
                    {OPERATORS.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor={`value-${condition.id}`}
                  className="text-xs font-medium text-muted-foreground"
                >
                  Valor
                </label>
                {/* TODO: Cambiar el tipo de input según el tipo de dato del campo y operador */}
                <Input
                  id={`value-${condition.id}`}
                  className="h-9"
                  value={condition.value}
                  onChange={(e) =>
                    updateCondition(index, { value: e.target.value })
                  }
                  placeholder="Escribir valor..."
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:bg-destructive/10 self-end h-9 w-9"
                onClick={() => removeCondition(index)}
                aria-label="Eliminar condición"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filterConditions.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No hay filtros definidos. Agrega una condición para empezar.
        </p>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex gap-2">
          {onClearFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAndClose}
              disabled={filterConditions.length === 0 && initialFilters.length === 0}
            >
              Borrar Todos
            </Button>
          )}
           <Button
            variant="outline"
            size="sm"
            onClick={() =>
              addCondition(
                filterConditions.length > 0
                  ? filterConditions[filterConditions.length - 1].conjunction
                  : "AND"
              )
            }
            disabled={
              filterConditions.length > 0 &&
              !filterConditions[filterConditions.length - 1].field
            } // Deshabilitar si el último filtro no está completo
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir condición
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleApply}
            disabled={filterConditions.length === 0}
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilterBuilder;
