import React, { memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  RefreshCw,
  PlusCircle,
  SlidersHorizontal,
} from "lucide-react"; // Eliminados UploadCloud, DownloadCloud. Añadido SlidersHorizontal

interface HeaderProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onAdvancedFilterClick: () => void;
  appliedFiltersCount?: number;
  // Props para nuevos botones si es necesario, ej: onConfigClick, onDeleteClick, onCreateUserClick
  // onRefreshClick: () => void; // Ya existe el botón, se puede añadir la prop si se maneja desde fuera
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  onSearchTermChange,
  onAdvancedFilterClick,
  appliedFiltersCount = 0,
  // Aquí se podrían desestructurar las nuevas props para los manejadores de eventos
}) => {
  return (
    <div className="bg-white pl-6 pr-6 pt-3 pb-3 border-b mb-0 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 w-full sticky top-0 z-50">
      {/* Sección Izquierda: Título y Subtítulo */}
      <div>
        <h1 className="text-2xl font-bold">Usuarios</h1>
        <p className="text-sm text-muted-foreground">
          Gestione los usuarios del sistema y sus accesos.
        </p>
      </div>

      {/* Sección Derecha: Controles */}
      <div className="flex items-center space-x-2">
        {/* Buscador */}
        <div className="relative w-full md:w-auto md:min-w-[250px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>

        {/* Botón Filtros Avanzados */}
        <Button
          variant="outline"
          onClick={onAdvancedFilterClick}
          className="relative"
        >
          <Filter className="mr-2 h-4 w-4" /> Filtros Avanzados
          {appliedFiltersCount > 0 && (
            <Badge
              variant="destructive" // O 'default' si el color debe ser el primario
              className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full"
            >
              {appliedFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Botón Refrescar */}
        <Button variant="outline" size="icon" aria-label="Refrescar datos">
          <RefreshCw className="h-4 w-4" />
        </Button>

        {/* Botón Sliders/Configuración (Nuevo) */}
        <Button variant="outline" size="icon" aria-label="Configurar vista">
          <SlidersHorizontal className="h-4 w-4" />
        </Button>

        {/* Botón Eliminar */}
        <Button
          variant="outline"
          className="text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Eliminar
        </Button>

        {/* Botón Crear Usuario */}
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Usuario
        </Button>
      </div>
    </div>
  );
};

export default memo(Header);
