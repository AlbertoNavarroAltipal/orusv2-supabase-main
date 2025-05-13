import React from 'react';
import PageSubheader from '@/components/dashboard/page-subheader'; // Importar el nuevo componente

const CrearTicketPage = () => {
  return (
    <>
      <PageSubheader title="Crear Nuevo Ticket" />
      <main className="container mx-auto p-4">
        <p>Formulario para crear un nuevo ticket.</p>
        {/* Aquí se agregará el formulario y más contenido */}
      </main>
    </>
  );
};

export default CrearTicketPage;