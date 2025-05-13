"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import PageSubheader from "@/components/dashboard/page-subheader"; // Importar el nuevo componente
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StarIcon, ClockIcon, UsersIcon, SearchIcon } from "lucide-react"; // Iconos

interface Course {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  category: string;
  duration: string; // Ej: "10 horas", "4 semanas"
  instructor: {
    name: string;
    avatarUrl?: string;
  };
  rating?: number; // De 1 a 5
  studentCount?: number;
  level: "Principiante" | "Intermedio" | "Avanzado";
  tags?: string[];
  learnings?: string[]; // Qué aprenderá el estudiante
  requirements?: string[];
  slug: string; // Para la URL del detalle del curso
}

// Datos de ejemplo de cursos
const sampleCourses: Course[] = [
  {
    id: "1",
    title: "Desarrollo Web Full Stack con Next.js y Supabase",
    description: "Aprende a construir aplicaciones web modernas y escalables.",
    imageUrl: "/placeholder.svg", // Reemplazar con imágenes reales o de placeholder
    category: "Desarrollo Web",
    duration: "40 horas",
    instructor: { name: "Carlos Santana" },
    rating: 4.8,
    studentCount: 1250,
    level: "Intermedio",
    tags: ["Next.js", "React", "Supabase", "Full Stack"],
    slug: "desarrollo-web-full-stack-nextjs-supabase",
  },
  {
    id: "2",
    title: "Introducción al Marketing Digital Estratégico",
    description:
      "Domina las bases del marketing online y crea estrategias efectivas.",
    imageUrl: "/placeholder.svg",
    category: "Marketing",
    duration: "25 horas",
    instructor: { name: "Laura Gómez" },
    rating: 4.6,
    studentCount: 980,
    level: "Principiante",
    tags: ["SEO", "Redes Sociales", "Email Marketing"],
    slug: "introduccion-marketing-digital",
  },
  {
    id: "3",
    title: "Diseño de Interfaces (UI) con Figma",
    description:
      "Crea prototipos y diseños de alta fidelidad para aplicaciones y webs.",
    imageUrl: "/placeholder.svg",
    category: "Diseño UX/UI",
    duration: "30 horas",
    instructor: { name: "Ana Martínez" },
    rating: 4.9,
    studentCount: 2100,
    level: "Intermedio",
    tags: ["Figma", "UI Design", "Prototipado"],
    slug: "diseno-ui-figma",
  },
  {
    id: "4",
    title: "Python para Data Science y Machine Learning",
    description:
      "Fundamentos de Python aplicados al análisis de datos y modelos predictivos.",
    imageUrl: "/placeholder.svg",
    category: "Data Science",
    duration: "50 horas",
    instructor: { name: "David Ochoa" },
    rating: 4.7,
    studentCount: 1800,
    level: "Avanzado",
    tags: ["Python", "Pandas", "Scikit-learn", "Machine Learning"],
    slug: "python-data-science-ml",
  },
  {
    id: "5",
    title: "Gestión de Proyectos con Metodologías Ágiles",
    description:
      "Aprende Scrum, Kanban y otras prácticas para liderar proyectos exitosos.",
    imageUrl: "/placeholder.svg",
    category: "Gestión de Proyectos",
    duration: "20 horas",
    instructor: { name: "Sofia Vargas" },
    rating: 4.5,
    studentCount: 750,
    level: "Principiante",
    tags: ["Scrum", "Kanban", "Agile"],
    slug: "gestion-proyectos-agiles",
  },
];

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
      <Link
        href={`/dashboard/escuela-altipal/catalogo-cursos/${course.slug}`}
        passHref
        className="flex flex-col h-full"
      >
        <div className="relative w-full h-48">
          <Image
            src={course.imageUrl}
            alt={course.title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-1">
            <Badge variant="secondary" className="text-xs">
              {course.category}
            </Badge>
            {typeof course.rating === "number" && (
              <div className="flex items-center text-xs text-muted-foreground">
                <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                {course.rating.toFixed(1)}
              </div>
            )}
          </div>
          <CardTitle className="text-lg font-semibold leading-tight h-12 line-clamp-2">
            {course.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3 h-[60px]">
            {course.description}
          </p>
          <div className="mt-3 text-xs text-muted-foreground space-y-1">
            <div className="flex items-center">
              <ClockIcon className="h-3.5 w-3.5 mr-1.5" /> {course.duration}
            </div>
            <div className="flex items-center">
              <UsersIcon className="h-3.5 w-3.5 mr-1.5" />{" "}
              {course.instructor.name}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 pb-4 mt-auto"> {/* mt-auto para empujar el footer hacia abajo si el contenido es corto */}
          <Button variant="outline" size="sm" className="w-full"> {/* Botón ocupa todo el ancho */}
            Ver curso
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

const CatalogoCursosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setCourses(sampleCourses);
      setIsLoading(false);
    }, 1000);
  }, []);

  const categories = [
    "all",
    ...new Set(sampleCourses.map((course) => course.category)),
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesSearchTerm =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.tags &&
        course.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));
    return matchesCategory && matchesSearchTerm;
  });

  return (
    <React.Fragment>
      <PageSubheader
        title="Catálogo de Cursos"
        description="Explora nuestra oferta formativa y encuentra el curso perfecto para ti."
      >
        <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
          <div className="relative flex-grow w-full md:w-auto">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cursos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "Todas las categorías" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PageSubheader>
      <main className="container mx-auto p-4 md:p-8">
        {/* La descripción se movió al PageSubheader */}
        {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="flex flex-col h-full">
              <Skeleton className="w-full h-48" />
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-6 w-3/4 mb-1" />
              </CardHeader>
              <CardContent className="flex-grow pb-3">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-2/3 mb-3" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="pt-2 pb-4 flex justify-between items-center">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-8 w-1/3" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <SearchIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground">
            No se encontraron cursos
          </h3>
          <p className="text-muted-foreground mt-2">
            Intenta ajustar tu búsqueda o filtros.
          </p>
        </div>
      )}
    </main>
    </React.Fragment>
  );
};

export default CatalogoCursosPage;
