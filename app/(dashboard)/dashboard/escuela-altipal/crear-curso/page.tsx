import React from 'react';
import { CreateCourseForm } from '@/components/dashboard/escuela-altipal/CreateCourseForm';
import PageSubheader from '@/components/dashboard/page-subheader'; // Importar el nuevo componente

export default function CrearCursoPage() {
  return (
    <React.Fragment>
      <PageSubheader
        title="Crear Nuevo Curso"
        description="Completa los siguientes pasos para configurar tu curso."
      />
      <main className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        {/* La descripción se movió al PageSubheader */}
        <div className="flex justify-center">
          <CreateCourseForm />
        </div>
      </main>
    </React.Fragment>
  );
}