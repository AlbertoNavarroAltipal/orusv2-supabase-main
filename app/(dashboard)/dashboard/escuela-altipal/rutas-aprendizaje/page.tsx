import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PageSubheader from '@/components/dashboard/page-subheader'; // Importar el nuevo componente

const rutasAprendizaje = [
  {
    id: 'ruta-desarrollo-web',
    titulo: 'Desarrollo Web Completo',
    descripcion: 'Aprende a construir aplicaciones web modernas desde cero, dominando frontend y backend.',
    modulos: 5,
    duracionEstimada: '40 horas',
    imagen: '/placeholder.svg', // Reemplazar con imagen real
  },
  {
    id: 'ruta-ciencia-datos',
    titulo: 'Introducción a la Ciencia de Datos',
    descripcion: 'Descubre los fundamentos de la ciencia de datos, análisis y visualización.',
    modulos: 4,
    duracionEstimada: '30 horas',
    imagen: '/placeholder.svg', // Reemplazar con imagen real
  },
  {
    id: 'ruta-marketing-digital',
    titulo: 'Estrategias de Marketing Digital',
    descripcion: 'Domina las herramientas y técnicas para crear campañas de marketing exitosas.',
    modulos: 6,
    duracionEstimada: '35 horas',
    imagen: '/placeholder.svg', // Reemplazar con imagen real
  },
];

const RutasAprendizajePage = () => {
  return (
    <React.Fragment>
      <PageSubheader
        title="Rutas de Aprendizaje"
        description="Explora nuestras rutas de aprendizaje diseñadas para ayudarte a alcanzar tus metas profesionales."
      />
      <main className="container mx-auto p-4">
        {/* La descripción <p> se movió al PageSubheader */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rutasAprendizaje.map((ruta) => (
          <Card key={ruta.id} className="flex flex-col">
            <CardHeader>
              <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                <img 
                  src={ruta.imagen} 
                  alt={ruta.titulo} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <CardTitle>{ruta.titulo}</CardTitle>
              <CardDescription>{ruta.descripcion}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="text-sm text-muted-foreground mb-4">
                <p>Módulos: {ruta.modulos}</p>
                <p>Duración Estimada: {ruta.duracionEstimada}</p>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Link href={`/dashboard/escuela-altipal/rutas-aprendizaje/${ruta.id}`} passHref>
                <Button className="w-full">Ver Ruta de Aprendizaje</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </main>
    </React.Fragment>
  );
};

export default RutasAprendizajePage;