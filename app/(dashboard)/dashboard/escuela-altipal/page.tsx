
"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfileSummaryCard } from "@/components/dashboard/widgets/UserProfileSummaryCard";
import { useAuth } from "@/lib/auth/auth-provider";
import { Skeleton } from "@/components/ui/skeleton"; // Para el estado de carga
import { Profile } from "@/types/user"; // <--- IMPORTACIÓN AÑADIDA

const EscuelaAltipalPage = () => {
  const { profile, isLoading } = useAuth();

  // Simulación de datos de perfil para desarrollo si no se cargan desde useAuth
  // En un entorno real, estos datos vendrían del backend a través de `profile`
  const mockProfile: Profile = {
    id: "1",
    updated_at: null,
    full_name: "Alberto Navarro (Mock)",
    avatar_url: "https://via.placeholder.com/150",
    role: null,
    email: "alberto.navarro.mock@example.com",
    phone: null,
    department: null,
    position: "Desarrollador Frontend (Mock)",
    last_sign_in: null,
    average_grade: 4.5,
    points: 1250,
    pending_tasks: 3,
    due_soon_tasks: 1,
  };

  // Usar perfil real si está disponible y no está cargando.
  // Si está cargando, displayProfile será null y se mostrará el Skeleton.
  // Si no está cargando y profile es null (error de carga), se mostrará mensaje de error.
  // Si no está cargando y profile existe, se usa profile.
  // El mockProfile se usa como fallback si profile es null y no estamos en isLoading,
  // aunque UserProfileSummaryCard maneja el caso de profile null.
  // Para simplificar y evitar el error de TS, nos aseguramos que mockProfile es del tipo Profile.
  // La lógica de displayProfile se ajusta para priorizar el perfil real.
  const displayProfile =
    !isLoading && profile ? profile : isLoading ? null : mockProfile;
  // const displayProfile = profile; // Usar esto cuando la carga de datos reales esté implementada y probada

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const eLearningItems = [
    {
      title: "Mis Cursos",
      href: "/dashboard/escuela-altipal/mis-cursos",
      description: "Accede a tus cursos inscritos y progreso.",
    },
    {
      title: "Mis Calificaciones",
      href: "/dashboard/escuela-altipal/mis-calificaciones",
      description: "Consulta tus calificaciones y rendimiento.",
    },
    {
      title: "Catálogo de Cursos",
      href: "/dashboard/escuela-altipal/catalogo-cursos",
      description: "Explora todos los cursos disponibles.",
    },
    {
      title: "Rutas de Aprendizaje",
      href: "/dashboard/escuela-altipal/rutas-aprendizaje",
      description: "Sigue rutas de aprendizaje estructuradas.",
    },
    {
      title: "Certificados",
      href: "/dashboard/escuela-altipal/certificados",
      description: "Visualiza y descarga tus certificados.",
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Escuela Altipal</h1>

      {isLoading && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-1">
            <Skeleton className="h-[280px] w-full rounded-lg" />
          </div>
        </div>
      )}

      {!isLoading && displayProfile && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3">
          <div className="md:col-span-1">
            {" "}
            {/* Ajusta el span según el diseño deseado */}
            <UserProfileSummaryCard
              profile={displayProfile}
              initials={getInitials(displayProfile.full_name)}
            />
          </div>
        </div>
      )}

      {!isLoading && !displayProfile && (
        <p className="text-center text-red-500 mb-8">
          No se pudo cargar el resumen del perfil.
        </p>
      )}

      <p className="text-center text-gray-600 mb-8">
        Bienvenido al portal de e-learning de Altipal. Aquí encontrarás todo lo
        necesario para tu desarrollo profesional.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eLearningItems.map((item) => (
          <Link href={item.href} key={item.title} passHref>
            <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl text-amber-700">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EscuelaAltipalPage;
