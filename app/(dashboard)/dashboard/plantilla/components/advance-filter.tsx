"use client";

import React, {
  useState,
  useCallback,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
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
import { PlusCircle, Trash2, X, Loader2, FilterX } from "lucide-react";
import type { UserData } from "./data-table"; // Asegúrate que la ruta sea correcta

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

const AdvancedFilterModal: React.FC<AdvancedFilterModalProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onClearFilters,
  initialFilters = [],
}) => {
  const [filters, setFilters] =
    useState<AdvancedFilterCondition[]>(initialFilters);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);

  useEffect(() => {
    // Si se proporcionan initialFilters, usarlos. Sino, empezar con un array vacío.
    setFilters(initialFilters.length > 0 ? [...initialFilters] : []);
  }, [initialFilters]);

  const handleAddFilter = () => {
    if (isApplyingFilters) return;
    setFilters([
      ...filters,
      {
        id: Date.now().toString(),
        field: "",
        operator: "contains",
        value: "",
        logicalOperator: filters.length > 0 ? "AND" : undefined,
      },
    ]);
  };

  const handleRemoveFilter = (id: string) => {
    if (isApplyingFilters) return;
    const newFilters = filters.filter((filter) => filter.id !== id);
    if (newFilters.length > 0 && filters.findIndex((f) => f.id === id) === 0) {
      delete newFilters[0].logicalOperator;
    }
    setFilters(newFilters.length > 0 ? newFilters : []);
  };

  const handleFilterChange = (
    id: string,
    field: keyof AdvancedFilterCondition,
    value: any
  ) => {
    if (isApplyingFilters) return;
    setFilters(
      filters.map((filter) =>
        filter.id === id ? { ...filter, [field]: value } : filter
      )
    );
  };

  const handleApply = async () => {
    setIsApplyingFilters(true);
    const validFilters = filters.filter(
      (f) => f.field && f.operator && f.value.trim() !== ""
    );
    
    try {
      // Asumimos que onApplyFilters podría ser una promesa si la página lo implementa así.
      // Si no, se ejecutará sincrónicamente.
      await Promise.resolve(onApplyFilters(validFilters));
    } catch (error) {
      console.error("Error applying filters:", error);
      // Opcional: manejar el error en la UI, ej. mostrar un toast
    } finally {
      // Incluso si onApplyFilters no es una promesa real, el Promise.resolve asegura que el bloque finally se ejecute después.
      // El cierre del modal y el reseteo del estado de carga se hacen después de que onApplyFilters haya tenido la oportunidad de ejecutarse.
      // Si onApplyFilters es síncrono, esto ocurrirá inmediatamente después.
      // Si fuera asíncrono (y devolviera una promesa), esperaría.
      setIsApplyingFilters(false);
      onClose();
    }
  };

  const handleClear = () => {
    if (isApplyingFilters) return;
    setFilters([]); // Vaciar completamente los filtros
    onClearFilters(); // Notificar a la página que los filtros se limpiaron
  };
  
  const handleDialogClose = () => {
    if (isApplyingFilters) return;
    onClose();
  }

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent
        className="sm:max-w-2xl"
        onInteractOutside={(e) => {
          if (isApplyingFilters) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold">Constructor de Filtros Avanzados</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Cree condiciones de filtro complejas para refinar la lista de usuarios. Las condiciones se aplican secuencialmente según el operador Y/O.
          </p>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              disabled={isApplyingFilters}
              onClick={handleDialogClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="py-2 max-h-[55vh] overflow-y-auto pr-3">
          {filters.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-10">
              <FilterX className="h-16 w-16 mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-1">No hay condiciones de filtro</p>
              <p className="text-sm">Haga clic en "Añadir condición" para empezar a construir sus filtros.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filters.map((filter, index) => (
                <div key={filter.id} className="space-y-3">
                  {index > 0 && (
                    <div className="flex items-center ml-1 mb-2"> {/* Alineado a la izquierda */}
                      <Select
                        value={filter.logicalOperator}
                        onValueChange={(value: "AND" | "OR") =>
                          handleFilterChange(filter.id, "logicalOperator", value)
                        }
                        disabled={isApplyingFilters}
                      >
                        <SelectTrigger className="w-[80px] text-xs h-8"> {/* Más pequeño */}
                          <SelectValue placeholder="Y/O" />
                        </SelectTrigger>
                        <SelectContent>
                          {logicalOperators.map((op) => (
                            <SelectItem key={op.value} value={op.value} className="text-xs">
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="border rounded-md p-4 space-y-3 bg-card shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-3 items-start">
                      <div>
                        <label htmlFor={`field-${filter.id}`} className="block text-xs font-medium text-muted-foreground mb-1">Campo</label>
                        <Select
                          value={filter.field}
                          onValueChange={(value: keyof UserData | "") =>
                            handleFilterChange(filter.id, "field", value)
                          }
                          disabled={isApplyingFilters}
                        >
                          <SelectTrigger id={`field-${filter.id}`}>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableColumns.map((col) => (
                              <SelectItem key={col.value} value={col.value}>
                                {col.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label htmlFor={`operator-${filter.id}`} className="block text-xs font-medium text-muted-foreground mb-1">Operador</label>
                        <Select
                          value={filter.operator}
                          onValueChange={(value) =>
                            handleFilterChange(filter.id, "operator", value)
                          }
                          disabled={isApplyingFilters}
                        >
                          <SelectTrigger id={`operator-${filter.id}`}>
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterOperators.map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label htmlFor={`value-${filter.id}`} className="block text-xs font-medium text-muted-foreground mb-1">Valor</label>
                        <Input
                          id={`value-${filter.id}`}
                          placeholder="Escribir valor..."
                          value={filter.value}
                          onChange={(e) =>
                            handleFilterChange(filter.id, "value", e.target.value)
                          }
                          disabled={isApplyingFilters}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                       {/* El botón de eliminar siempre debe estar si la fila existe, no depende de filters.length > 0 aquí */}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFilter(filter.id)}
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10 h-8 w-8"
                          disabled={isApplyingFilters}
                          aria-label="Eliminar condición"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center w-full gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isApplyingFilters || filters.length === 0}
              className="w-full sm:w-auto"
            >
              Borrar Todos
            </Button>
            <Button
              variant="outline"
              onClick={handleAddFilter}
              disabled={isApplyingFilters}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" /> Añadir condición
            </Button>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="ghost" // Cambiado a ghost o outline según preferencia para "Cancelar"
              onClick={handleDialogClose}
              disabled={isApplyingFilters}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleApply}
              disabled={isApplyingFilters || filters.length === 0 || !filters.some(f => f.field && f.operator && f.value.trim() !== "")}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90" // Estilo de botón primario
            >
              {isApplyingFilters ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isApplyingFilters ? "Aplicando..." : "Aplicar Filtros"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export interface AdvanceFilterHandle {
  openModal: () => void;
}

interface AdvanceFilterProps {
  onFiltersApplied: (filters: AdvancedFilterCondition[]) => void;
  onFiltersCleared: () => void;
  initialAppliedFilters?: AdvancedFilterCondition[];
  // Podrías pasar las columnas aquí si fueran dinámicas desde la página
  // filterableColumns: { value: keyof UserData; label: string }[];
}

const AdvanceFilter = forwardRef<AdvanceFilterHandle, AdvanceFilterProps>(
  (
    {
      onFiltersApplied,
      onFiltersCleared,
      initialAppliedFilters = [],
      // filterableColumns
    },
    ref
  ) => {
    const [isAdvancedFilterModalOpen, setIsAdvancedFilterModalOpen] =
      useState(false);
    // El estado de los filtros aplicados se maneja ahora aquí o se recibe como prop si se necesita más arriba
    // Para este ejemplo, lo manejaremos internamente y lo comunicaremos hacia arriba.
    // Si la página necesita conocer los filtros aplicados directamente, este estado debería elevarse.

    useImperativeHandle(ref, () => ({
      openModal: () => {
        setIsAdvancedFilterModalOpen(true);
      },
    }));

    const handleApplyAdvancedFilters = useCallback(
      (filters: AdvancedFilterCondition[]) => {
        onFiltersApplied(filters); // Notifica a la página/componente padre
        setIsAdvancedFilterModalOpen(false);
      },
      [onFiltersApplied]
    );

    const handleClearAdvancedFilters = useCallback(() => {
      onFiltersCleared(); // Notifica a la página/componente padre
      // setIsAdvancedFilterModalOpen(false); // Opcional: no cerrar el modal al limpiar
    }, [onFiltersCleared]);

    // Este botón o trigger para abrir el modal podría estar aquí o en el componente Header.
    // Por ahora, asumimos que el Header llamará a una función para abrirlo,
    // o que este componente renderizará su propio botón si es necesario.
    // Para el ejemplo, vamos a exponer la función para abrir el modal
    // y el modal mismo. El componente Header en page.tsx necesitará una forma de llamar a handleOpenAdvancedFilterModal.
    // Una forma es pasar esta función como prop al Header.

    // Si el botón de "Filtros Avanzados" está en el Header de la página,
    // la página necesitará una ref a este componente para llamar a handleOpenAdvancedFilterModal,
    // o este componente debe ser reestructurado para incluir el botón que se pasa al Header,
    // o el estado isAdvancedFilterModalOpen y su setter se elevan a la página.

    // Para mantener la encapsulación, este componente manejará su propio estado de apertura.
    // La página le pasará una función para que este componente la llame cuando se abra el modal.
    // O, más simple, la página le pasa una prop para abrir el modal.

    // Vamos a simplificar: el botón de abrir estará en el Header de la página,
    // y la página controlará la prop `isOpen` del modal directamente a través de este componente.
    // No, eso rompe la encapsulación.

    // Mejor: Este componente renderiza el modal y la página le pasa una función para abrirlo.
    // O este componente es llamado desde el Header.

    // La forma más limpia es que este componente reciba una prop que indique si debe estar abierto.
    // Y que el Header en la página controle esa prop.

    // Revisando la estructura original: page.tsx tiene el botón en Header y controla el estado.
    // Para mover la lógica, advance-filter.tsx debe controlar el estado de apertura.
    // El Header en page.tsx necesitará una forma de decirle a advance-filter.tsx que se abra.

    // Opción: `advance-filter.tsx` expone una función para abrirse, que `page.tsx` pasa al `Header`.
    // Esto se puede hacer con `useImperativeHandle` o pasando callbacks.

    // Por ahora, `advance-filter.tsx` renderizará el modal y controlará su visibilidad.
    // La página necesitará una forma de interactuar con él.
    // El `Header` en `page.tsx` llama a `onAdvancedFilterClick` que es `handleOpenAdvancedFilterModal` en `page.tsx`.
    // Esta función ahora debe estar en `advance-filter.tsx`.

    // Solución: `page.tsx` renderizará `AdvanceFilter` y le pasará una función que `Header` pueda llamar.
    // O `AdvanceFilter` se renderiza DENTRO de `Header` o recibe una prop para renderizar el botón.

    // Vamos a asumir que `AdvanceFilter` es un componente que se usa en `page.tsx`
    // y que `page.tsx` le pasará las funciones necesarias al `Header`.

    return (
      <>
        {/* El botón para abrir el modal se manejará en el componente Header de la página,
          el cual llamará a `handleOpenAdvancedFilterModal` que se le pasará como prop.
          Este componente solo se encarga de la lógica del modal en sí.
          Por lo tanto, `handleOpenAdvancedFilterModal` debe ser accesible por la página.
          Esto se puede lograr si `page.tsx` maneja el estado `isAdvancedFilterModalOpen`
          y lo pasa a este componente.
          
          No, el objetivo es mover la lógica. Así que `advance-filter.tsx` debe manejar
          `isAdvancedFilterModalOpen`.
          
          `page.tsx` pasará una función al `Header` que, al ser llamada,
          activará una función dentro de `AdvanceFilter` para abrir el modal.
          Esto se puede hacer con un estado en `page.tsx` que `AdvanceFilter` lee,
          o con `useImperativeHandle`.
          
          Simplifiquemos: `AdvanceFilter` tendrá su propio botón o se le pasará una prop para abrirlo.
          Dado que el `Header` ya tiene un `onAdvancedFilterClick`, `page.tsx`
          necesitará llamar a una función de `AdvanceFilter`.
          
          Vamos a hacer que `AdvanceFilter` reciba `isOpen` y `onClose` como props,
          y la página `page.tsx` manejará el estado `isAdvancedFilterModalOpen`.
          Esto contradice "mover la lógica de estado".
          
          Reconsideración:
          `advance-filter.tsx` manejará `isAdvancedFilterModalOpen`.
          `page.tsx` renderizará `<AdvanceFilter ref={advanceFilterRef} ... />`.
          El `Header` en `page.tsx` llamará a `advanceFilterRef.current.openModal()`.
      */}
        <AdvancedFilterModal
          isOpen={isAdvancedFilterModalOpen}
          onClose={() => setIsAdvancedFilterModalOpen(false)}
          onApplyFilters={handleApplyAdvancedFilters}
          onClearFilters={handleClearAdvancedFilters}
          initialFilters={initialAppliedFilters}
          // columns={filterableColumns} // Si se pasan dinámicamente
        />
        {/* Este componente necesita una forma de ser "activado" desde el Header.
          Podemos pasar `setIsAdvancedFilterModalOpen` a la página, y la página al Header.
          O usar un ref como se mencionó.
          Para este ejercicio, vamos a asumir que la página pasará una función
          al Header que llame a `setIsAdvancedFilterModalOpen(true)`.
          Esto significa que `setIsAdvancedFilterModalOpen` debe ser accesible.
          
          La forma más directa es que `page.tsx` siga teniendo el botón en `Header`
          y el estado `isAdvancedFilterModalOpen`.
          Y `AdvanceFilter` solo recibe los filtros y callbacks.
          
          No, la tarea es mover los *filtros* al componente.
          Esto incluye el estado de si el modal de filtros está abierto.
          
          `page.tsx` tendrá:
          const [appliedFilters, setAppliedFilters] = useState();
          const advanceFilterRef = useRef();
          <Header onAdvancedFilterClick={() => advanceFilterRef.current.open()} />
          <AdvanceFilter ref={advanceFilterRef} onApply={setAppliedFilters} />
          
          Esto requiere `useImperativeHandle` en `AdvanceFilter`.
      */}
      </>
    );
  }
);
AdvanceFilter.displayName = "AdvanceFilter";

// AdvancedFilterCondition ya se exporta en su definición.

// Esto es un placeholder si el componente necesita renderizar un botón propio
// export const AdvancedFilterTrigger = ({ onClick }: { onClick: () => void }) => (
//   <Button onClick={onClick}>Filtros Avanzados</Button>
// );

export default AdvanceFilter;
