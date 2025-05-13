import React from 'react';
import PageSubheader from '@/components/dashboard/page-subheader';

const IAMAuditoriaPage = () => {
  return (
    <>
      <PageSubheader
        title="Auditoría de IAM"
        description="Revise los registros de actividad y cambios en el sistema de IAM."
      />
      <div className="container mx-auto p-4 mt-6">
        <p>Aquí se mostrarán los registros de auditoría relacionados con IAM.</p>
        {/* Contenido futuro: tabla de logs de auditoría, filtros, etc. */}
      </div>
    </>
  );
};

export default IAMAuditoriaPage;