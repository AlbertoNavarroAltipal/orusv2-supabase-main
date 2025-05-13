import React from 'react';
import PageSubheader from '@/components/dashboard/page-subheader';

const IAMPermisosPage = () => {
  return (
    <>
      <PageSubheader
        title="Gestión de Permisos IAM"
        description="Visualice y gestione los permisos detallados del sistema."
      />
      <div className="container mx-auto p-4 mt-6">
        <p>Aquí se mostrará la lista de permisos y las opciones para gestionarlos.</p>
        {/* Contenido futuro: tabla de permisos, etc. */}
      </div>
    </>
  );
};

export default IAMPermisosPage;