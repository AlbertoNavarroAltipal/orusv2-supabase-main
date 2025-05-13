import React from 'react';
import PageSubheader from '@/components/dashboard/page-subheader'; // Importar el nuevo componente

const CrearTicketPage = () => {
  return (
    <React.Fragment>
      <PageSubheader
        title="Crear Nuevo Ticket"
        description="Completa el formulario para registrar un nuevo ticket de soporte."
      />
      <main className="container mx-auto p-4">
        {/* La descripción anterior <p> se movió y mejoró en PageSubheader */}
        {/* Aquí se agregará el formulario y más contenido */}
      </main>
    </React.Fragment>
  );
};

export default CrearTicketPage;