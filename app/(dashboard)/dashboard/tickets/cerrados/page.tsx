import React from 'react';
import PageSubheader from '@/components/dashboard/page-subheader';

const TicketsCerradosPage = () => {
  return (
    <>
      <PageSubheader title="Tickets Cerrados" />
      <div className="container mx-auto p-4">
        <p>Aquí se mostrarán los tickets cerrados.</p>
        {/* Aquí se agregará más contenido */}
      </div>
    </>
  );
};

export default TicketsCerradosPage;