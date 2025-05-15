"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserData } from "./data-table"; // Asumiendo que UserData define las columnas

// Definición de las props del modal
interface TableConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  paginationPosition: "top" | "bottom" | "both" | "none";
  onPaginationPositionChange: (position: "top" | "bottom" | "both" | "none") => void;
  availableColumns: { key: keyof UserData; header: string }[];
  visibleColumns: (keyof UserData)[];
  onVisibleColumnsChange: (columns: (keyof UserData)[]) => void;
}

const TableConfigModal: React.FC<TableConfigModalProps> = ({
  isOpen,
  onClose,
  itemsPerPage,
  onItemsPerPageChange,
  availableColumns,
  visibleColumns,
  onVisibleColumnsChange,
  paginationPosition,
  onPaginationPositionChange,
}) => {
  // Estados locales para manejar los cambios antes de guardarlos
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(itemsPerPage);
  const [currentSelectedColumns, setCurrentSelectedColumns] = useState<(keyof UserData)[]>(visibleColumns);
  const [currentPaginationPosition, setCurrentPaginationPosition] = useState(paginationPosition);

  const handleColumnToggle = (columnKey: keyof UserData) => {
    setCurrentSelectedColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const handleSaveChanges = () => {
    onItemsPerPageChange(currentItemsPerPage);
    onVisibleColumnsChange(currentSelectedColumns);
    onPaginationPositionChange(currentPaginationPosition);
    onClose();
  };

  // Sincronizar selectedColumns si visibleColumns cambia desde fuera
  // Sincronizar estados internos si las props cambian desde fuera (cuando el modal se abre)
  React.useEffect(() => {
    if (isOpen) {
      setCurrentItemsPerPage(itemsPerPage);
      setCurrentSelectedColumns(visibleColumns);
      setCurrentPaginationPosition(paginationPosition);
    }
  }, [isOpen, itemsPerPage, visibleColumns, paginationPosition]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Preferencia de la tabla</DialogTitle>
          <DialogDescription>
            Personaliza cómo se muestra la información en la tabla según tus necesidades.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Items per page */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="itemsPerPage" className="text-right col-span-1">
              Registros por página
            </Label>
            <Select
              value={currentItemsPerPage.toString()}
              onValueChange={(value) => setCurrentItemsPerPage(parseInt(value, 10))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar cantidad" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50, 100].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Pagination position */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right col-span-1 pt-2">
              Posición Paginación
            </Label>
            <RadioGroup
              value={currentPaginationPosition}
              onValueChange={(value: "top" | "bottom" | "both" | "none") => setCurrentPaginationPosition(value)}
              className="col-span-3 grid grid-cols-2 gap-x-4 gap-y-2"
            >
              {[
                { value: "top", label: "Arriba" },
                { value: "bottom", label: "Abajo" },
                { value: "both", label: "Ambos" },
                { value: "none", label: "Ninguno" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`pos-${option.value}`} />
                  <Label htmlFor={`pos-${option.value}`} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Column visibility */}
          <div>
            <Label className="text-sm font-medium">Columnas Visibles</Label>
            <div className="grid grid-cols-2 gap-2 mt-2 max-h-60 overflow-y-auto p-1">
              {availableColumns.map((col) => (
                <div key={col.key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`col-${col.key}`}
                    checked={currentSelectedColumns.includes(col.key)}
                    onCheckedChange={() => handleColumnToggle(col.key)}
                  />
                  <Label htmlFor={`col-${col.key}`} className="font-normal">
                    {col.header}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSaveChanges}>Guardar Cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TableConfigModal;