"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "@/components/ui/card"; // <--- IMPORTACIÓN AÑADIDA
import {
  ArrowLeftIcon,
  BookOpenTextIcon,
  CheckCircleIcon,
  ListChecksIcon,
  TargetIcon,
  UserCircleIcon,
  ClockIcon,
  BarChart3Icon,
  InfoIcon,
} from "lucide-react";

// Definición de la interfaz Course (sin precios)
interface Course {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  category: string;
  duration: string;
  instructor: {
    name: string;
    avatarUrl?: string;
    bio?: string;
  };
  rating?: number;
  studentCount?: number;
  level: "Principiante" | "Intermedio" | "Avanzado";
  tags?: string[];
  learnings?: string[];
  requirements?: string[];
  modules?: CourseModule[];
  slug: string;
}

interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
  duration?: string;
}

interface CourseLesson {
  id: string;
  title: string;
  type: "video" | "lectura" | "quiz";
  duration?: string; // Ej: "10 min", "1 hora"
  isCompleted?: boolean; // Para seguimiento de progreso del usuario
}

// Datos de ejemplo (deberían venir de un servicio/API en una app real)
// Asegúrate de que los slugs coincidan con los de la página del catálogo
const sampleCoursesData: Course[] = [
  {
    id: "1",
    title: "Desarrollo Web Full Stack con Next.js y Supabase",
    description: "Aprende a construir aplicaciones web modernas y escalables.",
    longDescription:
      "Este curso te llevará desde los fundamentos hasta técnicas avanzadas para crear aplicaciones full-stack utilizando Next.js para el frontend y Supabase como backend. Cubriremos autenticación, bases de datos en tiempo real, serverless functions y despliegue.",
    imageUrl: "/placeholder.svg",
    category: "Desarrollo Web",
    duration: "40 horas",
    instructor: {
      name: "Carlos Santana",
      bio: "Ingeniero de Software con 10+ años de experiencia en desarrollo web y arquitecturas cloud.",
    },
    rating: 4.8,
    studentCount: 1250,
    level: "Intermedio",
    tags: ["Next.js", "React", "Supabase", "Full Stack", "JavaScript"],
    learnings: [
      "Construir aplicaciones web interactivas con Next.js.",
      "Gestionar bases de datos y autenticación con Supabase.",
      "Desplegar aplicaciones en plataformas modernas.",
      "Entender la arquitectura full-stack y sus componentes.",
    ],
    requirements: [
      "Conocimientos básicos de HTML, CSS y JavaScript.",
      "Experiencia previa con React (recomendado).",
      "Un editor de código y Node.js instalado.",
    ],
    slug: "desarrollo-web-full-stack-nextjs-supabase",
    modules: [
      {
        id: "m1",
        title: "Introducción a Next.js",
        lessons: [
          {
            id: "l1-1",
            title: "¿Qué es Next.js?",
            type: "lectura",
            duration: "15 min",
          },
          {
            id: "l1-2",
            title: "Instalación y configuración",
            type: "video",
            duration: "25 min",
          },
        ],
      },
      {
        id: "m2",
        title: "Fundamentos de Supabase",
        lessons: [
          {
            id: "l2-1",
            title: "Creando tu primer proyecto en Supabase",
            type: "video",
            duration: "30 min",
          },
          {
            id: "l2-2",
            title: "Autenticación de usuarios",
            type: "lectura",
            duration: "40 min",
          },
        ],
      },
      {
        id: "m3",
        title: "Construyendo la Aplicación",
        lessons: [
          {
            id: "l3-1",
            title: "CRUD de Tareas",
            type: "video",
            duration: "1h 30min",
          },
          {
            id: "l3-2",
            title: "Realtime con Supabase",
            type: "video",
            duration: "1h",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    title: "Introducción al Marketing Digital Estratégico",
    description:
      "Domina las bases del marketing online y crea estrategias efectivas.",
    longDescription:
      "Un curso completo para entender el panorama del marketing digital, desde SEO y SEM hasta marketing de contenidos y redes sociales. Aprende a planificar, ejecutar y medir campañas exitosas.",
    imageUrl: "/placeholder.svg",
    category: "Marketing",
    duration: "25 horas",
    instructor: {
      name: "Laura Gómez",
      bio: "Consultora de Marketing Digital especializada en PYMES y startups.",
    },
    rating: 4.6,
    studentCount: 980,
    level: "Principiante",
    tags: ["SEO", "Redes Sociales", "Email Marketing", "Google Ads"],
    learnings: [
      "Definir objetivos de marketing claros.",
      "Crear un plan de marketing digital.",
      "Optimizar contenido para motores de búsqueda (SEO).",
      "Gestionar campañas en redes sociales.",
    ],
    requirements: [
      "Acceso a internet.",
      "Interés en aprender sobre marketing digital.",
    ],
    slug: "introduccion-marketing-digital",
    modules: [
      {
        id: "m1",
        title: "Fundamentos del Marketing Digital",
        lessons: [
          {
            id: "l1-1",
            title: "Ecosistema Digital",
            type: "lectura",
            duration: "20 min",
          },
        ],
      },
      {
        id: "m2",
        title: "SEO y Marketing de Contenidos",
        lessons: [
          {
            id: "l2-1",
            title: "Investigación de Palabras Clave",
            type: "video",
            duration: "45 min",
          },
        ],
      },
    ],
  },
  // Añadir más cursos aquí si es necesario, con sus slugs correspondientes
];

const CourseDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const [course, setCourse] = useState<Course | null | undefined>(undefined); // undefined para estado inicial de carga

  useEffect(() => {
    if (slug) {
      // Simular carga de datos
      setTimeout(() => {
        const foundCourse = sampleCoursesData.find((c) => c.slug === slug);
        setCourse(foundCourse || null); // null si no se encuentra
      }, 500);
    }
  }, [slug]);

  if (course === undefined) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Skeleton className="h-72 w-full mb-6" />
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-4" />
        <div className="grid md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <InfoIcon className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h1 className="text-3xl font-bold mb-4">Curso no encontrado</h1>
        <p className="text-muted-foreground mb-6">
          Lo sentimos, el curso que buscas no existe o la URL es incorrecta.
        </p>
        <Button asChild>
          <Link href="/dashboard/escuela-altipal/catalogo-cursos">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al Catálogo
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/escuela-altipal/catalogo-cursos">
            <ArrowLeftIcon className="mr-2 h-4 w-4" /> Volver al Catálogo
          </Link>
        </Button>
      </div>

      <header className="mb-8 md:mb-12">
        <div className="relative w-full h-60 md:h-96 rounded-lg overflow-hidden shadow-lg mb-6">
          <Image
            src={course.imageUrl}
            alt={course.title}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <Badge variant="secondary" className="mb-2 text-sm">
              {course.category}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center bg-card p-3 rounded-md shadow-sm">
            <UserCircleIcon className="h-5 w-5 mr-2 text-primary" />
            <span>
              Instructor: <strong>{course.instructor.name}</strong>
            </span>
          </div>
          <div className="flex items-center bg-card p-3 rounded-md shadow-sm">
            <ClockIcon className="h-5 w-5 mr-2 text-primary" />
            <span>
              Duración: <strong>{course.duration}</strong>
            </span>
          </div>
          <div className="flex items-center bg-card p-3 rounded-md shadow-sm">
            <BarChart3Icon className="h-5 w-5 mr-2 text-primary" />
            <span>
              Nivel: <strong>{course.level}</strong>
            </span>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <main className="lg:col-span-2">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-3 flex items-center">
              <BookOpenTextIcon className="mr-3 h-6 w-6 text-primary" />
              Acerca de este curso
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {course.longDescription || course.description}
            </p>
          </section>

          {course.learnings && course.learnings.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <TargetIcon className="mr-3 h-6 w-6 text-primary" />
                ¿Qué aprenderás?
              </h2>
              <ul className="space-y-2">
                {course.learnings.map((learning, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{learning}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.requirements && course.requirements.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <ListChecksIcon className="mr-3 h-6 w-6 text-primary" />
                Requisitos
              </h2>
              <ul className="space-y-2">
                {course.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <InfoIcon className="h-5 w-5 text-blue-500 mr-3 mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{requirement}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>

        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            {" "}
            {/* Para que el aside se quede fijo al hacer scroll */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Contenido del Curso</CardTitle>
              </CardHeader>
              <CardContent>
                {course.modules && course.modules.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {course.modules.map((module, index) => (
                      <AccordionItem value={`module-${index}`} key={module.id}>
                        <AccordionTrigger className="text-base font-medium hover:no-underline">
                          <div className="flex justify-between w-full pr-2">
                            <span>{module.title}</span>
                            {module.duration && (
                              <span className="text-xs text-muted-foreground">
                                {module.duration}
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 pl-4">
                            {module.lessons.map((lesson) => (
                              <li
                                key={lesson.id}
                                className="text-sm text-muted-foreground flex justify-between items-center hover:text-primary transition-colors cursor-pointer"
                              >
                                <span>
                                  {lesson.title} ({lesson.type})
                                </span>
                                {lesson.duration && (
                                  <span className="text-xs">
                                    {lesson.duration}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-muted-foreground">
                    El contenido del curso se añadirá pronto.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button size="lg" className="w-full">
                  Empezar Curso
                </Button>
              </CardFooter>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetailPage;
