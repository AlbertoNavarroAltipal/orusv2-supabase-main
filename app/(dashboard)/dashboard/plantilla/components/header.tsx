import React, { memo } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, RefreshCw, UploadCloud, DownloadCloud, PlusCircle } from 'lucide-react';

interface HeaderProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  // Aquí se podrían añadir más props para los otros botones si se necesita pasarles funcionalidad desde la página
  // onAdvancedFilterClick: () => void;
  // onRefreshClick: () => void;
  // etc.
}

const Header: React.FC<HeaderProps> = ({ searchTerm, onSearchTermChange }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">Gestione los usuarios del sistema y sus accesos.</p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline">
            <UploadCloud className="mr-2 h-4 w-4" /> Importar
          </Button>
          <Button variant="outline">
            <DownloadCloud className="mr-2 h-4 w-4" /> Exportar
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Usuario
          </Button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0 md:space-x-2">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filtros Avanzados
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-destructive hover:text-destructive">
            Eliminar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(Header);