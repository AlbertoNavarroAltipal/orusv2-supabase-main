import React from 'react';
import PageSubheader from '@/components/dashboard/page-subheader';

const TicketsAbiertosPage = () => {
  return (
    <>
      <PageSubheader
        title="Tickets Abiertos"
        description="Aquí se mostrarán los tickets abiertos."
      />
      <main className="container mx-auto p-4">
        {/* La descripción anterior <p> se movió al PageSubheader */}
        {/* Aquí se agregará más contenido */}
      </main>
    </>
  );
};

export default TicketsAbiertosPage;