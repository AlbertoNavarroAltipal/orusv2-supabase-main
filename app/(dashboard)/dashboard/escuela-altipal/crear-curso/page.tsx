import React from 'react';
import { CreateCourseForm } from '@/components/dashboard/escuela-altipal/CreateCourseForm';

export default function CrearCursoPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      {/* Título de la página, podría ser opcional si el Card ya tiene un buen título */}
      {/* 
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Crear un Nuevo Curso
        </h1>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Completa los siguientes pasos para configurar tu curso.
        </p>
      </div>
      */}
      
      <div className="flex justify-center">
        <CreateCourseForm />
      </div>
    </div>
  );
}