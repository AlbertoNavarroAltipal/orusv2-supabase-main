import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PageSubheader from '@/components/dashboard/page-subheader'; // Importar el nuevo componente

// Simulación de datos de rutas (en una aplicación real, esto vendría de una API o base de datos)
const todasLasRutas = [
  {
    id: 'ruta-desarrollo-web',
    titulo: 'Desarrollo Web Completo',
    descripcion: 'Aprende a construir aplicaciones web modernas desde cero, dominando frontend y backend.',
    modulosDetalle: [
      { id: 'modulo-1', titulo: 'Introducción al Desarrollo Web', contenido: 'Conceptos básicos, HTML, CSS, JavaScript.' },
      { id: 'modulo-2', titulo: 'Frontend con React', contenido: 'Componentes, estado, props, hooks.' },
      { id: 'modulo-3', titulo: 'Backend con Node.js y Express', contenido: 'APIs RESTful, bases de datos.' },
      { id: 'modulo-4', titulo: 'Bases de Datos (SQL y NoSQL)', contenido: 'Modelado de datos, consultas.' },
      { id: 'modulo-5', titulo: 'Despliegue y Mantenimiento', contenido: 'Servidores, CI/CD, monitoreo.' },
    ],
    duracionEstimada: '40 horas',
    imagen: '/placeholder.svg',
  },
  {
    id: 'ruta-ciencia-datos',
    titulo: 'Introducción a la Ciencia de Datos',
    descripcion: 'Descubre los fundamentos de la ciencia de datos, análisis y visualización.',
    modulosDetalle: [
      { id: 'modulo-1', titulo: 'Fundamentos de Python para Datos', contenido: 'Pandas, NumPy, Matplotlib.' },
      { id: 'modulo-2', titulo: 'Estadística Descriptiva e Inferencial', contenido: 'Conceptos clave y aplicaciones.' },
      { id: 'modulo-3', titulo: 'Limpieza y Preparación de Datos', contenido: 'Técnicas esenciales.' },
      { id: 'modulo-4', titulo: 'Visualización de Datos con Seaborn', contenido: 'Creación de gráficos efectivos.' },
    ],
    duracionEstimada: '30 horas',
    imagen: '/placeholder.svg',
  },
  {
    id: 'ruta-marketing-digital',
    titulo: 'Estrategias de Marketing Digital',
    descripcion: 'Domina las herramientas y técnicas para crear campañas de marketing exitosas.',
    modulosDetalle: [
        { id: 'modulo-1', titulo: 'Fundamentos del Marketing Digital', contenido: 'SEO, SEM, Email Marketing.' },
        { id: 'modulo-2', titulo: 'Marketing de Contenidos', contenido: 'Creación y distribución de contenido valioso.' },
        { id: 'modulo-3', titulo: 'Redes Sociales para Negocios', contenido: 'Estrategias para Facebook, Instagram, LinkedIn.' },
        { id: 'modulo-4', titulo: 'Publicidad Online (PPC)', contenido: 'Google Ads, Facebook Ads.' },
        { id: 'modulo-5', titulo: 'Analítica Web y KPIs', contenido: 'Medición de resultados y optimización.' },
        { id: 'modulo-6', titulo: 'Email Marketing y Automatización', contenido: 'Campañas efectivas y personalizadas.' },
    ],
    duracionEstimada: '35 horas',
    imagen: '/placeholder.svg',
  },
];

interface RutaDetailPageProps {
  params: {
    id: string;
  };
}

const RutaDetailPage: React.FC<RutaDetailPageProps> = ({ params }) => {
  const ruta = todasLasRutas.find(r => r.id === params.id);

  if (!ruta) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">Ruta de Aprendizaje no encontrada</h1>
        <Link href="/dashboard/escuela-altipal/rutas-aprendizaje">
          <Button variant="link">Volver a las rutas de aprendizaje</Button>
        </Link>
      </div>
    );
  }

  return (
    <React.Fragment>
      <PageSubheader title={ruta.titulo || "Detalle de Ruta de Aprendizaje"}>
        <Link href="/dashboard/escuela-altipal/rutas-aprendizaje">
          <Button variant="outline">&larr; Volver a todas las Rutas</Button>
        </Link>
      </PageSubheader>
      <main className="container mx-auto p-4">
        <Card className="mb-8">
          <CardHeader>
          <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
            <img 
              src={ruta.imagen} 
              alt={ruta.titulo} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardTitle className="text-3xl">{ruta.titulo}</CardTitle>
          <CardDescription>{ruta.descripcion}</CardDescription>
          <p className="text-sm text-muted-foreground mt-2">Duración Estimada: {ruta.duracionEstimada}</p>
        </CardHeader>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Módulos del Curso</h2>
      <div className="space-y-6">
        {ruta.modulosDetalle.map((modulo, index) => (
          <Card key={modulo.id}>
            <CardHeader>
              <CardTitle>Módulo {index + 1}: {modulo.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{modulo.contenido}</p>
              {/* Aquí podrías agregar enlaces a lecciones específicas, progreso, etc. */}
              <Button variant="secondary" className="mt-4">Comenzar Módulo</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Button size="lg">Inscribirse en esta Ruta de Aprendizaje</Button>
      </div>
    </main>
    </React.Fragment>
  );
};

export default RutaDetailPage;

// Función para generar rutas estáticas si se usa SSG (Static Site Generation)
export async function generateStaticParams() {
  return todasLasRutas.map((ruta) => ({
    id: ruta.id,
  }));
}