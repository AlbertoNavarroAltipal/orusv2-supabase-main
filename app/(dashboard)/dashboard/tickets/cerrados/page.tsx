import React from 'react';
import PageSubheader from '@/components/dashboard/page-subheader';

const TicketsCerradosPage = () => {
  return (
    <>
      <PageSubheader
        title="Tickets Cerrados"
        description="Aquí se mostrarán los tickets cerrados."
      />
      <main className="container mx-auto p-4">
        {/* La descripción anterior <p> se movió al PageSubheader */}
        {/* Aquí se agregará más contenido */}
      </main>
    </>
  );
};

export default TicketsCerradosPage;