'use client'; // Necesario para useState y useEffect

import React, { useState } from 'react';
import Head from 'next/head'; // Para importar fuentes de Google
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadCloud, Eye } from 'lucide-react'; // Iconos
import CertificateModal from '@/components/dashboard/escuela-altipal/CertificateModal'; // Importar el modal

// Definición del tipo para un certificado
interface Certificado {
  id: string;
  cursoNombre: string;
  fechaObtencion: string;
  institucion: string;
  urlDescarga?: string; // Opcional si el modal es la vista principal
  imagenCurso: string;
  nombreEstudiante?: string; // Para el diploma
  logoInstitucion?: string; // Para el diploma
}

const certificadosObtenidos: Certificado[] = [
  {
    id: 'cert-web-dev',
    cursoNombre: 'Desarrollo Web Completo',
    fechaObtencion: '2024-03-15',
    institucion: 'Escuela Altipal Online',
    urlDescarga: '/api/certificados/cert-web-dev.pdf',
    imagenCurso: '/placeholder.svg',
    nombreEstudiante: 'Alberto Navarro', // Ejemplo
    logoInstitucion: '/logo.png', // Usar el logo del proyecto
  },
  {
    id: 'cert-data-intro',
    cursoNombre: 'Introducción a la Ciencia de Datos',
    fechaObtencion: '2023-11-20',
    institucion: 'Escuela Altipal Online',
    urlDescarga: '/api/certificados/cert-data-intro.pdf',
    imagenCurso: '/placeholder.svg',
    nombreEstudiante: 'Alberto Navarro',
    logoInstitucion: '/logo.png',
  },
  {
    id: 'cert-marketing-strategy',
    cursoNombre: 'Estrategias de Marketing Digital',
    fechaObtencion: '2024-01-10',
    institucion: 'Escuela Altipal Online',
    urlDescarga: '/api/certificados/cert-marketing-strategy.pdf',
    imagenCurso: '/placeholder.svg',
    nombreEstudiante: 'Alberto Navarro',
    logoInstitucion: '/logo.png',
  },
];

const CertificadosPage = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificado | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (certificado: Certificado) => {
    setSelectedCertificate(certificado);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Montserrat:wght@400;500;700&family=Satisfy&display=swap" rel="stylesheet" />
      </Head>
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mis Certificados</h1>
          <p className="text-muted-foreground">
            Aquí puedes ver y descargar los certificados de los cursos y rutas de aprendizaje que has completado.
          </p>
        </div>

        {certificadosObtenidos.length === 0 ? (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">Aún no tienes certificados.</h2>
            <p className="text-muted-foreground">Completa cursos para obtener tus certificados y verlos aquí.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificadosObtenidos.map((certificado) => (
              <Card key={certificado.id} className="flex flex-col">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                    <img
                      src={certificado.imagenCurso}
                      alt={`Certificado de ${certificado.cursoNombre}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle>{certificado.cursoNombre}</CardTitle>
                  <CardDescription>Otorgado por: {certificado.institucion}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground">
                    Fecha de obtención: {new Date(certificado.fechaObtencion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </CardContent>
                <div className="p-6 pt-0 grid grid-cols-2 gap-2">
                  <Button className="w-full" onClick={() => handleOpenModal(certificado)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver Diploma
                  </Button>
                  {certificado.urlDescarga && (
                    <a href={certificado.urlDescarga} download target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full">
                        <DownloadCloud className="mr-2 h-4 w-4" />
                        Descargar
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {selectedCertificate && (
          <CertificateModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            certificate={selectedCertificate}
          />
        )}
      </div>
    </>
  );
};

export default CertificadosPage;