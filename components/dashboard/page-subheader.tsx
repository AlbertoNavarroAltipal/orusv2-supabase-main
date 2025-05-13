import React from 'react';

interface PageSubheaderProps {
  title: string;
  description?: string; // Nueva prop opcional para la descripción
  children?: React.ReactNode; // Para elementos de acción como botones, buscador, etc.
}

const PageSubheader: React.FC<PageSubheaderProps> = ({ title, description, children }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-4"> {/* Ajuste de padding si es necesario */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-grow">
          <h1 className="text-2xl font-semibold text-primary-600">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {children && <div className="flex items-center gap-x-2 flex-shrink-0">{children}</div>} {/* Ajuste de gap si es necesario */}
      </div>
    </header>
  );
};

export default PageSubheader;