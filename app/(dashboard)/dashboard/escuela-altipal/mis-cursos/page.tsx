import React from "react";
import Link from "next/link";
import PageSubheader from "@/components/dashboard/page-subheader"; // Importar el nuevo componente
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; // Asumiendo que este componente existe
import { Button } from "@/components/ui/button";

// Datos de ejemplo para los cursos
const coursesData = [
  {
    id: "1",
    title: "Curso de Introducción a React",
    description:
      "Aprende los fundamentos de React y cómo construir interfaces de usuario interactivas.",
    imageUrl: "/placeholder.svg", // Reemplazar con imágenes reales o de placeholder
    progress: 75,
    category: "Desarrollo Web",
    instructor: "Juan Pérez",
  },
  {
    id: "2",
    title: "Marketing Digital para Principiantes",
    description:
      "Descubre las estrategias esenciales para impulsar tu presencia en línea.",
    imageUrl: "/placeholder.svg",
    progress: 40,
    category: "Marketing",
    instructor: "Ana Gómez",
  },
  {
    id: "3",
    title: "Gestión de Proyectos Ágiles con Scrum",
    description:
      "Domina Scrum y lleva tus proyectos al siguiente nivel de eficiencia.",
    imageUrl: "/placeholder.svg",
    progress: 90,
    category: "Negocios",
    instructor: "Carlos López",
  },
  {
    id: "4",
    title: "Diseño de Interfaces (UI) Modernas",
    description:
      "Crea interfaces atractivas y funcionales que enamoren a tus usuarios.",
    imageUrl: "/placeholder.svg",
    progress: 60,
    category: "Diseño",
    instructor: "Sofía Martínez",
  },
];

const MisCursosPage = () => {
  return (
    <React.Fragment>
      <PageSubheader title="Mis Cursos" />
      <main className="container mx-auto p-4 md:p-8">
        <p className="text-gray-600 text-lg mb-8">
          Continúa tu aprendizaje y alcanza tus metas.
        </p>
        {/* El h1 se movió al PageSubheader */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {coursesData.map((course) => (
          <Card
            key={course.id}
            className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
          >
            <CardHeader className="p-0">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-5 flex-grow flex flex-col">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
                {course.category}
              </span>
              <CardTitle className="text-lg font-semibold text-gray-800 mb-2 leading-tight">
                {course.title}
              </CardTitle>
              <p className="text-sm text-gray-600 mb-4 flex-grow">
                {course.description}
              </p>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progreso</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress
                  value={course.progress}
                  className="w-full h-2 [&>div]:bg-amber-500"
                />
              </div>
              <p className="text-xs text-gray-500">
                Instructor: {course.instructor}
              </p>
            </CardContent>
            <CardFooter className="p-5 bg-gray-50 border-t border-gray-200">
              <Link
                href={`/dashboard/escuela-altipal/cursos/${course.id}`}
                passHref
                className="w-full"
              >
                <Button
                  variant="default"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Continuar Curso
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
    </React.Fragment>
  );
};

export default MisCursosPage;
