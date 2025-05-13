import React from 'react';
import PageSubheader from '@/components/dashboard/page-subheader';

const IAMRolesPage = () => {
  return (
    <>
      <PageSubheader
        title="Gestión de Roles IAM"
        description="Defina y administre los roles y sus conjuntos de permisos."
      />
      <div className="container mx-auto p-4 mt-6">
        <p>Aquí se mostrará la lista de roles y las opciones para gestionarlos.</p>
        {/* Contenido futuro: tabla de roles, botones de agregar/editar/eliminar, etc. */}
      </div>
    </>
  );
};

export default IAMRolesPage;