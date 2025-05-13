import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: {
    cursoNombre: string;
    fechaObtencion: string;
    institucion: string;
    nombreEstudiante?: string;
    logoInstitucion?: string;
  } | null;
}

const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose, certificate }) => {
  if (!certificate) return null;

  const studentName = certificate.nombreEstudiante || "Nombre del Estudiante";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-full max-h-full p-0 overflow-y-auto flex flex-col items-center justify-center bg-black/80">
        <VisuallyHidden>
          <DialogTitle>Certificado de {certificate.cursoNombre} para {studentName}</DialogTitle>
          <DialogDescription>
            Visualización del certificado obtenido por {studentName} en el curso {certificate.cursoNombre} de {certificate.institucion}.
          </DialogDescription>
        </VisuallyHidden>
        
        {/* Contenedor del diploma para centrarlo y darle un tamaño máximo */}
        <div className="w-full max-w-4xl mx-auto my-auto p-4">
          {/* Fondo del Diploma con tonos azules y blancos */}
          <div className="diploma-bg aspect-[1.414/1] w-full bg-gradient-to-br from-sky-50 via-blue-100 to-sky-50 p-8 shadow-2xl border-8 border-blue-700 relative">
            {/* Contenido del Diploma */}
            <div className="text-center mb-6">
              {certificate.logoInstitucion ? (
                <Image src={certificate.logoInstitucion} alt="Logo Institución" width={100} height={100} className="mx-auto mb-4" />
              ) : (
                <Image src="/placeholder-logo.svg" alt="Logo Placeholder" width={80} height={80} className="mx-auto mb-4 opacity-50" />
              )}
              <h1 className="text-4xl font-bold text-blue-800" style={{ fontFamily: "'Satisfy', cursive" }}>
                Certificado de Finalización
              </h1>
              <p className="text-lg text-blue-700 mt-2">Otorgado a</p>
            </div>

            <div className="text-center my-8">
              <h2 className="text-5xl font-semibold text-blue-900" style={{ fontFamily: "'Merriweather', serif" }}>
                {studentName}
              </h2>
            </div>

            <div className="text-center text-blue-800 mb-8">
              <p className="text-lg">Por haber completado satisfactoriamente el curso de</p>
              <h3 className="text-3xl font-medium mt-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {certificate.cursoNombre}
              </h3>
            </div>

            <div className="text-center text-sm text-blue-700 mb-10">
              <p>Otorgado por {certificate.institucion}</p>
              <p>En la fecha: {new Date(certificate.fechaObtencion).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div className="flex justify-between items-center mt-auto absolute bottom-8 left-8 right-8">
              <div className="text-center">
                <div className="w-24 h-1 bg-blue-700 mx-auto mb-1"></div>
                <p className="text-xs text-blue-800">Firma del Instructor</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 border-2 border-blue-600 rounded-full mx-auto flex items-center justify-center text-blue-700 text-xs">
                  SELLO
                </div>
              </div>
              <div className="text-center">
                <div className="w-24 h-1 bg-blue-700 mx-auto mb-1"></div>
                <p className="text-xs text-blue-800">Firma del Director</p>
              </div>
            </div>

            {/* Bordes decorativos */}
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-blue-400 pointer-events-none"></div>
            <div className="absolute top-4 left-4 right-4 bottom-4 border border-blue-300 pointer-events-none"></div>
          </div>
        </div>
        
        <DialogFooter className="p-4 bg-transparent absolute bottom-4 right-4">
          <Button onClick={onClose} variant="outline" className="bg-white hover:bg-slate-100">Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
