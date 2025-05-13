import React from 'react';
import { CreateCourseForm } from '@/components/dashboard/escuela-altipal/CreateCourseForm';
import PageSubheader from '@/components/dashboard/page-subheader'; // Importar el nuevo componente

export default function CrearCursoPage() {
  return (
    <React.Fragment>
      <PageSubheader title="Crear Nuevo Curso" />
      <main className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        {/* El título y la descripción comentados se pueden eliminar o integrar en el PageSubheader si es necesario */}
        {/*
        <p className="mt-2 text-lg leading-8 text-gray-600 text-center mb-8">
          Completa los siguientes pasos para configurar tu curso.
        </p>
        */}
        <div className="flex justify-center">
          <CreateCourseForm />
        </div>
      </main>
    </React.Fragment>
  );
}