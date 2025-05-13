import React from 'react';
import PageSubheader from '@/components/dashboard/page-subheader';

const IAMDashboardPage = () => {
  return (
    <>
      <PageSubheader
        title="Panel de IAM"
        description="Bienvenido al panel de Gestión de Identidad y Acceso."
      />
      <div className="container mx-auto p-4 mt-6"> {/* Añadido margen superior para separar del subheader */}
        {/* <h1 className="text-2xl font-bold mb-4">Panel de IAM</h1> */}
        {/* <p>Bienvenido al panel de Gestión de Identidad y Acceso.</p> */}
        <p>Contenido principal del panel de IAM.</p>
        {/* Aquí se mostrará más contenido del panel principal de IAM */}
      </div>
    </>
  );
};

export default IAMDashboardPage;