import React from 'react';
import PageSubheader from '@/components/dashboard/page-subheader';

const IAMUsuariosPage = () => {
  return (
    <>
      <PageSubheader
        title="Gestión de Usuarios IAM"
        description="Administre los usuarios del sistema y sus accesos."
      />
      <div className="container mx-auto p-4 mt-6">
        <p>Aquí se mostrará la lista de usuarios y las opciones para gestionarlos.</p>
        {/* Contenido futuro: tabla de usuarios, botones de agregar/editar/eliminar, etc. */}
      </div>
    </>
  );
};

export default IAMUsuariosPage;