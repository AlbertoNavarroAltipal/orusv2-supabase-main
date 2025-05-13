import React from 'react';
import PageSubheader from '@/components/dashboard/page-subheader';

const TicketsAbiertosPage = () => {
  return (
    <>
      <PageSubheader title="Tickets Abiertos" />
      <div className="container mx-auto p-4">
        <p>Aquí se mostrarán los tickets abiertos.</p>
        {/* Aquí se agregará más contenido */}
      </div>
    </>
  );
};

export default TicketsAbiertosPage;