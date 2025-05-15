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
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  enableSorting: boolean;
  onEnableSortingChange: (enabled: boolean) => void;
  enableRowSelection: boolean;
  onEnableRowSelectionChange: (enabled: boolean) => void;
  tableDensity: "compact" | "normal" | "spacious";
  onTableDensityChange: (density: "compact" | "normal" | "spacious") => void;
  showGridLines: boolean;
  onShowGridLinesChange: (show: boolean) => void;
  stripedRows: boolean;
  onStripedRowsChange: (striped: boolean) => void;
  hoverHighlight: boolean;
  onHoverHighlightChange: (highlight: boolean) => void;
  // Nuevas props
  stickyHeader: boolean;
  onStickyHeaderChange: (sticky: boolean) => void;
  tableFontSize: "xs" | "sm" | "base";
  onTableFontSizeChange: (size: "xs" | "sm" | "base") => void;
  cellTextAlignment: "left" | "center" | "right";
  onCellTextAlignmentChange: (alignment: "left" | "center" | "right") => void;
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
  enableSorting,
  onEnableSortingChange,
  enableRowSelection,
  onEnableRowSelectionChange,
  tableDensity,
  onTableDensityChange,
  showGridLines,
  onShowGridLinesChange,
  stripedRows,
  onStripedRowsChange,
  hoverHighlight,
  onHoverHighlightChange,
  // Nuevas props
  stickyHeader,
  onStickyHeaderChange,
  tableFontSize,
  onTableFontSizeChange,
  cellTextAlignment,
  onCellTextAlignmentChange,
}) => {
  // Estados locales para manejar los cambios antes de guardarlos
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(itemsPerPage);
  const [currentSelectedColumns, setCurrentSelectedColumns] = useState<(keyof UserData)[]>(visibleColumns);
  const [currentPaginationPosition, setCurrentPaginationPosition] = useState(paginationPosition);
  const [currentEnableSorting, setCurrentEnableSorting] = useState(enableSorting);
  const [currentEnableRowSelection, setCurrentEnableRowSelection] = useState(enableRowSelection);
  const [currentTableDensity, setCurrentTableDensity] = useState(tableDensity);
  const [currentShowGridLines, setCurrentShowGridLines] = useState(showGridLines);
  const [currentStripedRows, setCurrentStripedRows] = useState(stripedRows);
  const [currentHoverHighlight, setCurrentHoverHighlight] = useState(hoverHighlight);
  // Nuevos estados locales
  const [currentStickyHeader, setCurrentStickyHeader] = useState(stickyHeader);
  const [currentTableFontSize, setCurrentTableFontSize] = useState(tableFontSize);
  const [currentCellTextAlignment, setCurrentCellTextAlignment] = useState(cellTextAlignment);

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
    onEnableSortingChange(currentEnableSorting);
    onEnableRowSelectionChange(currentEnableRowSelection);
    onTableDensityChange(currentTableDensity);
    onShowGridLinesChange(currentShowGridLines);
    onStripedRowsChange(currentStripedRows);
    onHoverHighlightChange(currentHoverHighlight);
    // Guardar nuevas preferencias
    onStickyHeaderChange(currentStickyHeader);
    onTableFontSizeChange(currentTableFontSize);
    onCellTextAlignmentChange(currentCellTextAlignment);
    onClose();
  };

  // Sincronizar selectedColumns si visibleColumns cambia desde fuera
  // Sincronizar estados internos si las props cambian desde fuera (cuando el modal se abre)
  React.useEffect(() => {
    if (isOpen) {
      setCurrentItemsPerPage(itemsPerPage);
      setCurrentSelectedColumns(visibleColumns);
      setCurrentPaginationPosition(paginationPosition);
      setCurrentEnableSorting(enableSorting);
      setCurrentEnableRowSelection(enableRowSelection);
      setCurrentTableDensity(tableDensity);
      setCurrentShowGridLines(showGridLines);
      setCurrentStripedRows(stripedRows);
      setCurrentHoverHighlight(hoverHighlight);
      // Sincronizar nuevos estados
      setCurrentStickyHeader(stickyHeader);
      setCurrentTableFontSize(tableFontSize);
      setCurrentCellTextAlignment(cellTextAlignment);
    }
  }, [
    isOpen,
    itemsPerPage,
    visibleColumns,
    paginationPosition,
    enableSorting,
    enableRowSelection,
    tableDensity,
    showGridLines,
    stripedRows,
    hoverHighlight,
    stickyHeader,
    tableFontSize,
    cellTextAlignment,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Aumentar el ancho máximo del modal para acomodar pestañas verticales */}
      <DialogContent className="sm:max-w-[750px] md:max-w-[850px] lg:max-w-[900px] min-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Preferencia de la tabla</DialogTitle>
          <DialogDescription>
            Personaliza cómo se muestra la información en la tabla según tus necesidades.
          </DialogDescription>
        </DialogHeader>
        {/* Contenedor principal para pestañas verticales */}
        <Tabs defaultValue="general" orientation="vertical" className="flex-1 flex gap-x-6 py-4">
          <TabsList className="flex flex-col h-full space-y-1 border-r pr-4 w-1/4"> {/* Ajustar ancho según sea necesario */}
            <TabsTrigger value="general" className="w-full justify-start px-3 py-2 text-sm">General</TabsTrigger>
            <TabsTrigger value="pagination" className="w-full justify-start px-3 py-2 text-sm">Paginación</TabsTrigger>
            <TabsTrigger value="columns" className="w-full justify-start px-3 py-2 text-sm">Columnas</TabsTrigger>
            <TabsTrigger value="appearance" className="w-full justify-start px-3 py-2 text-sm">Apariencia</TabsTrigger>
            <TabsTrigger value="behavior" className="w-full justify-start px-3 py-2 text-sm">Comportamiento</TabsTrigger>
          </TabsList>

          {/* Contenedor para el contenido de las pestañas con scroll */}
          <div className="flex-1 overflow-y-auto max-h-[calc(80vh-180px)] pr-2"> {/* Ajustar max-h según cabecera/pie */}
            {/* Pestaña General */}
            <TabsContent value="general" className="mt-0 grid gap-y-6 pt-1"> {/* mt-0 y pt-1 para alinear mejor */}
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
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
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                <Label className="text-right col-span-1">
                  Densidad
                </Label>
                <RadioGroup
                  value={currentTableDensity}
                  onValueChange={(value: "compact" | "normal" | "spacious") => setCurrentTableDensity(value)}
                  className="col-span-3 grid grid-cols-3 gap-x-2"
                >
                  {[
                    { value: "compact", label: "Compacta" },
                    { value: "normal", label: "Normal" },
                    { value: "spacious", label: "Espaciosa" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`density-${option.value}`} />
                      <Label htmlFor={`density-${option.value}`} className="font-normal text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                <Label className="text-right col-span-1">
                  Tamaño Fuente
                </Label>
                <RadioGroup
                  value={currentTableFontSize}
                  onValueChange={(value: "xs" | "sm" | "base") => setCurrentTableFontSize(value)}
                  className="col-span-3 grid grid-cols-3 gap-x-2"
                >
                  {[
                    { value: "xs", label: "Pequeña" },
                    { value: "sm", label: "Mediana" },
                    { value: "base", label: "Grande" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`fontSize-${option.value}`} />
                      <Label htmlFor={`fontSize-${option.value}`} className="font-normal text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>

            {/* Pestaña Paginación */}
            <TabsContent value="pagination" className="mt-0 grid gap-y-6 pt-1">
              <div className="grid grid-cols-4 items-start gap-x-4 gap-y-2">
                <Label className="text-right col-span-1 pt-1">
                  Posición
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
                      <Label htmlFor={`pos-${option.value}`} className="font-normal text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>

            {/* Pestaña Columnas */}
            <TabsContent value="columns" className="mt-0 grid gap-y-6 pt-1">
              <div>
                <Label className="text-sm font-medium mb-2 block">Columnas Visibles</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md">
                  {availableColumns.map((col) => (
                    <div key={col.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${col.key}`}
                        checked={currentSelectedColumns.includes(col.key)}
                        onCheckedChange={() => handleColumnToggle(col.key)}
                      />
                      <Label htmlFor={`col-${col.key}`} className="font-normal text-sm">
                        {col.header}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-x-4 gap-y-2">
                <Label className="text-right col-span-1">
                  Alineación Texto
                </Label>
                <RadioGroup
                  value={currentCellTextAlignment}
                  onValueChange={(value: "left" | "center" | "right") => setCurrentCellTextAlignment(value)}
                  className="col-span-3 grid grid-cols-3 gap-x-2"
                >
                  {[
                    { value: "left", label: "Izquierda" },
                    { value: "center", label: "Centro" },
                    { value: "right", label: "Derecha" },
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`align-${option.value}`} />
                      <Label htmlFor={`align-${option.value}`} className="font-normal text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </TabsContent>

            {/* Pestaña Apariencia */}
            <TabsContent value="appearance" className="mt-0 grid gap-y-4 pt-1">
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="showGridLines" className="font-normal">
                  Mostrar líneas de cuadrícula
                </Label>
                <Switch
                  id="showGridLines"
                  checked={currentShowGridLines}
                  onCheckedChange={setCurrentShowGridLines}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="stripedRows" className="font-normal">
                  Filas rayadas
                </Label>
                <Switch
                  id="stripedRows"
                  checked={currentStripedRows}
                  onCheckedChange={setCurrentStripedRows}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="hoverHighlight" className="font-normal">
                  Resaltar fila al pasar cursor
                </Label>
                <Switch
                  id="hoverHighlight"
                  checked={currentHoverHighlight}
                  onCheckedChange={setCurrentHoverHighlight}
                />
              </div>
            </TabsContent>

            {/* Pestaña Comportamiento */}
            <TabsContent value="behavior" className="mt-0 grid gap-y-4 pt-1">
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="enableSorting" className="font-normal">
                  Habilitar ordenación
                </Label>
                <Switch
                  id="enableSorting"
                  checked={currentEnableSorting}
                  onCheckedChange={setCurrentEnableSorting}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="enableRowSelection" className="font-normal">
                  Habilitar selección de filas
                </Label>
                <Switch
                  id="enableRowSelection"
                  checked={currentEnableRowSelection}
                  onCheckedChange={setCurrentEnableRowSelection}
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="stickyHeader" className="font-normal">
                  Cabecera pegajosa
                </Label>
                <Switch
                  id="stickyHeader"
                  checked={currentStickyHeader}
                  onCheckedChange={setCurrentStickyHeader}
                />
              </div>
            </TabsContent>
          </div>
        </Tabs>
        <DialogFooter className="pt-6 border-t"> {/* Añadido border-t y pt-6 */}
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