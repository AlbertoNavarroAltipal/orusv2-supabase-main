"use client";

import React from "react";
import { useAuth } from "@/lib/auth/auth-provider";
import PageSubheader from "@/components/dashboard/page-subheader"; // Importar el nuevo componente
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Para el estado de carga
import { Badge } from "@/components/ui/badge"; // Para mostrar el estado de la calificación
import { Progress } from "@/components/ui/progress"; // Para la barra de progreso de calificación

interface Grade {
  id: string;
  courseName: string;
  score: number; // Puntuación obtenida
  maxScore: number; // Puntuación máxima posible
  date: string; // Fecha de la calificación
  status: "Aprobado" | "Reprobado" | "Pendiente";
  feedback?: string; // Comentarios adicionales
}

const MisCalificacionesPage = () => {
  const { profile, isLoading: authLoading } = useAuth();

  // TODO: Reemplazar con la lógica real de obtención de calificaciones del usuario
  const [grades, setGrades] = React.useState<Grade[]>([]);
  const [isLoadingGrades, setIsLoadingGrades] = React.useState(true);

  React.useEffect(() => {
    // Simulación de carga de datos
    if (profile) {
      // Solo cargar si el perfil está disponible
      setTimeout(() => {
        setGrades([
          {
            id: "1",
            courseName: "Introducción a la Programación",
            score: 85,
            maxScore: 100,
            date: "2024-03-15",
            status: "Aprobado",
            feedback: "Buen trabajo en el proyecto final.",
          },
          {
            id: "2",
            courseName: "Marketing Digital Avanzado",
            score: 92,
            maxScore: 100,
            date: "2024-04-20",
            status: "Aprobado",
          },
          {
            id: "3",
            courseName: "Gestión de Proyectos Ágiles",
            score: 70,
            maxScore: 100,
            date: "2024-05-01",
            status: "Aprobado",
            feedback: "Necesitas mejorar la participación en clase.",
          },
          {
            id: "4",
            courseName: "Diseño UX/UI para Principiantes",
            score: 55,
            maxScore: 100,
            date: "2024-05-10",
            status: "Reprobado",
          },
          {
            id: "5",
            courseName: "Contabilidad Financiera",
            score: 0,
            maxScore: 100,
            date: "N/A",
            status: "Pendiente",
          },
        ]);
        setIsLoadingGrades(false);
      }, 1500);
    } else if (!authLoading) {
      // Si no hay perfil y la autenticación no está cargando, no hay calificaciones que mostrar o error.
      setIsLoadingGrades(false);
    }
  }, [profile, authLoading]);

  const getStatusBadgeVariant = (
    status: Grade["status"]
  ): "default" | "destructive" | "secondary" | "outline" => {
    switch (status) {
      case "Aprobado":
        return "default"; // Verde para aprobado (usando el color por defecto de Badge)
      case "Reprobado":
        return "destructive"; // Rojo para reprobado
      case "Pendiente":
        return "secondary"; // Gris/amarillo para pendiente
      default:
        return "default";
    }
  };

  const getProgressColor = (status: Grade["status"], score: number) => {
    if (status === "Pendiente") return "bg-gray-400";
    if (status === "Reprobado") return "bg-red-500";
    if (score >= 70) return "bg-green-500"; // Aprobado con buena nota
    return "bg-yellow-500"; // Aprobado con nota baja o por defecto
  };

  if (authLoading || isLoadingGrades) {
    return (
      <div className="container mx-auto px-4 py-8"> {/* Este div es para el contenido de carga, no el principal */}
        {/* El título se moverá al PageSubheader */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
            >
              <CardHeader className="p-6">
                <Skeleton className="h-7 w-3/4 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-4" />
              </CardHeader>
              <CardContent className="p-6">
                <Skeleton className="h-5 w-1/3 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <React.Fragment>
        <PageSubheader title="Mis Calificaciones" />
        <main className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Por favor, inicia sesión para ver tus calificaciones.
          </p>
        </main>
      </React.Fragment>
    );
  }

  if (grades.length === 0) {
    return (
      <React.Fragment>
        <PageSubheader title="Mis Calificaciones" />
        <main className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            Aún no tienes calificaciones registradas.
          </p>
          {/* Podríamos añadir un CTA para explorar cursos */}
        </main>
      </React.Fragment>
    );
  }

  // Ajuste para el return principal
  if (authLoading || isLoadingGrades) { // Mover el return del loading aquí para que PageSubheader no dependa de 'profile' o 'grades'
    return (
      <React.Fragment>
        <PageSubheader title="Mis Calificaciones" />
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card
                key={index}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden"
              >
                <CardHeader className="p-6">
                  <Skeleton className="h-7 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                </CardHeader>
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-1/3 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </React.Fragment>
    );
  }
  
  return (
    <React.Fragment>
      <PageSubheader title="Mis Calificaciones" />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 text-center mb-10">
            Aquí puedes ver el detalle de tu desempeño en cada curso.
          </p>
          {/* Sección de Resumen General - Estilo mejorado */}
          <Card className="mb-10 bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 md:p-8">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
              Resumen de Progreso
            </CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Una vista rápida de tu avance general.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* TODO: Implementar lógica de resumen (promedio, cursos aprobados, etc.) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Promedio General
                </p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  - %
                </p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Cursos Aprobados
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  -
                </p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Cursos Pendientes
                </p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  -
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {grades.map((grade) => (
            <Card
              key={grade.id}
              className="flex flex-col bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
            >
              <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white leading-tight">
                    {grade.courseName}
                  </CardTitle>
                  <Badge
                    variant={getStatusBadgeVariant(grade.status)}
                    className="text-xs px-2.5 py-1"
                  >
                    {grade.status}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                  Evaluado el:{" "}
                  {grade.date === "N/A"
                    ? "Pendiente de evaluación"
                    : grade.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-gray-700 dark:text-gray-100">
                      {grade.status === "Pendiente" ? "-" : grade.score}
                    </span>
                    {grade.status !== "Pendiente" && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        / {grade.maxScore} pts
                      </span>
                    )}
                  </div>
                  {grade.status !== "Pendiente" && (
                    <Progress
                      value={(grade.score / grade.maxScore) * 100}
                      className="h-2 mb-3"
                      indicatorClassName={getProgressColor(
                        grade.status,
                        grade.score
                      )}
                    />
                  )}
                  {grade.feedback && (
                    <p className="mt-3 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                      <span className="font-semibold">Comentario:</span>{" "}
                      {grade.feedback}
                    </p>
                  )}
                </div>
                {/* Podríamos añadir un botón/link para "Ver detalles del curso" o "Repetir examen" si aplica */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
    </React.Fragment>
  );
};

export default MisCalificacionesPage;
