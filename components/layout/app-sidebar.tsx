"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAppStore } from "@/lib/stores";
import { PermissionGuard } from "@/lib/auth/client-permissions";

export function AppSidebar() {
  const pathname = usePathname();
  const { appSidebarOpen, toggleAppSidebar } = useAppStore();

  // Si estamos en una ruta de IAM, no mostrar este sidebar global,
  // ya que IAM tiene su propio sidebar dedicado.
  // if (pathname.startsWith("/dashboard/iam")) {
  //   return null;
  // }

  // Determinar qué aplicación está activa basado en la ruta
  const pathSegments = pathname.split("/").filter(Boolean);
  let currentModule = "dashboard"; // Valor por defecto

  if (
    pathSegments.length > 1 &&
    pathSegments[0] === "dashboard" &&
    pathSegments[1] === "escuela-altipal"
  ) {
    currentModule = "escuela-altipal";
  } else if (
    pathSegments.length > 1 &&
    pathSegments[0] === "dashboard" &&
    pathSegments[1] === "tickets"
  ) {
    currentModule = "tickets";
  } else if (
    pathSegments.length > 1 &&
    pathSegments[0] === "dashboard" &&
    pathSegments[1] === "iam"
  ) {
    currentModule = "iam";
  } else if (pathSegments.length > 0 && pathSegments[0] !== "dashboard") {
    currentModule = pathSegments[0];
  }
  // Si es solo /dashboard, currentModule sigue siendo "dashboard"

  if (!appSidebarOpen) return null;

  const getModuleTitle = (moduleName: string): string => {
    switch (moduleName) {
      case "dashboard":
        return "Inicio";
      case "escuela-altipal":
        return "Escuela Altipal";
      case "tickets":
        return "Tickets";
      case "users":
        return "Gestión de Usuarios"; // Ejemplo de título más descriptivo
      case "roles":
        return "Gestión de Roles"; // Ejemplo de título más descriptivo
      case "iam":
        return "Gestión de Accesos (IAM)";
      default:
        // Capitaliza la primera letra y reemplaza guiones por espacios para un fallback genérico
        return moduleName
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  };

  const sidebarTitle = getModuleTitle(currentModule);

  return (
    <div className="bg-white w-64 border-r border-slate-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        <h2 className="font-semibold text-slate-900 text-lg">{sidebarTitle}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAppSidebar}
          className="text-slate-500 hover:bg-slate-100"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Cerrar menú</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* El párrafo descriptivo se podría eliminar o comentar si se busca una réplica exacta del diseño de la imagen */}
        <p className="text-sm text-slate-500 mb-4">
          En esta sección se mostrará solo el menú del módulo o app que tengo
          abierto en ese momento
        </p>

        {/* Renderizar menú según la aplicación activa */}
        {currentModule === "dashboard" && <DashboardMenu pathname={pathname} />}
        {currentModule === "users" && <UsersMenu pathname={pathname} />}
        {currentModule === "roles" && <RolesMenu pathname={pathname} />}
        {currentModule === "escuela-altipal" && (
          <EscuelaAltipalMenu pathname={pathname} />
        )}
        {currentModule === "tickets" && <TicketsMenu pathname={pathname} />}
        {currentModule === "iam" && <IAMMenu pathname={pathname} />}
      </div>
    </div>
  );
}

function DashboardMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-2">
      {" "}
      {/* Aumentar el espacio entre elementos */}
      <NavLink href="/dashboard" pathname={pathname}>
        Muro de notificas
      </NavLink>
      <NavLink href="/dashboard/escuela-altipal" pathname={pathname}>
        {" "}
        {/* Ruta provisional */}
        Escuela Altipal
      </NavLink>
      {/* Asumiendo que Tickets no necesita un PermissionGuard específico por ahora */}
      {/* Si se necesita, se puede añadir como el de Configuración anteriormente */}
      <NavLink href="/dashboard/tickets" pathname={pathname}>
        {" "}
        {/* Ruta provisional */}
        Tickets
      </NavLink>
      {/* Puedes añadir más NavLink aquí si es necesario para el "etc..." */}
    </nav>
  );
}

function EscuelaAltipalMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-2">
      <NavLink
        href="/dashboard/escuela-altipal/crear-curso"
        pathname={pathname}
      >
        Crear nuevo curso
      </NavLink>
      <NavLink href="/dashboard/escuela-altipal" pathname={pathname}>
        Resumen
      </NavLink>
      <NavLink href="/dashboard/escuela-altipal/mis-cursos" pathname={pathname}>
        Mis Cursos
      </NavLink>
      <NavLink
        href="/dashboard/escuela-altipal/mis-calificaciones"
        pathname={pathname}
      >
        Mis Calificaciones
      </NavLink>
      <NavLink
        href="/dashboard/escuela-altipal/catalogo-cursos"
        pathname={pathname}
      >
        Catálogo de Cursos
      </NavLink>
      <NavLink
        href="/dashboard/escuela-altipal/rutas-aprendizaje"
        pathname={pathname}
      >
        Rutas de Aprendizaje
      </NavLink>
      <NavLink
        href="/dashboard/escuela-altipal/certificados"
        pathname={pathname}
      >
        Certificados
      </NavLink>
      {/* Agrega más enlaces aquí si es necesario */}
    </nav>
  );
}

function TicketsMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-2">
      <NavLink href="/dashboard/tickets/crear" pathname={pathname}>
        Crear nuevo ticket
      </NavLink>
      <NavLink href="/dashboard/tickets" pathname={pathname}>
        Ver mis tickets
      </NavLink>
      <NavLink href="/dashboard/tickets/agentes" pathname={pathname}>
        Agentes
      </NavLink>
      <NavLink href="/dashboard/tickets/analytics" pathname={pathname}>
        Analytics
      </NavLink>

      {/* Agrega más enlaces aquí si es necesario */}
    </nav>
  );
}

function UsersMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-1">
      <PermissionGuard permission="view_users">
        <NavLink href="/dashboard/users" pathname={pathname}>
          Listado de usuarios
        </NavLink>
      </PermissionGuard>
      <PermissionGuard permission="create_users">
        <NavLink href="/dashboard/users/create" pathname={pathname}>
          Crear usuario
        </NavLink>
      </PermissionGuard>
    </nav>
  );
}

function RolesMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-1">
      <PermissionGuard permission="view_roles">
        <NavLink href="/dashboard/roles" pathname={pathname}>
          Listado de roles
        </NavLink>
      </PermissionGuard>
      <PermissionGuard permission="create_roles">
        <NavLink href="/dashboard/roles/create" pathname={pathname}>
          Crear rol
        </NavLink>
      </PermissionGuard>
      <PermissionGuard permission="view_permissions">
        <NavLink href="/dashboard/permissions" pathname={pathname}>
          Permisos
        </NavLink>
      </PermissionGuard>
    </nav>
  );
}

function IAMMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-1">
      <NavLink href="/dashboard/iam" pathname={pathname}>
        Panel Principal IAM
      </NavLink>
      {/* <PermissionGuard permission="view_users_iam"> */}
      <NavLink href="/dashboard/iam/usuarios" pathname={pathname}>
        Usuarios
      </NavLink>
      {/* </PermissionGuard> */}
      {/* <PermissionGuard permission="view_roles_iam"> */}
      <NavLink href="/dashboard/iam/roles" pathname={pathname}>
        Roles
      </NavLink>
      {/* </PermissionGuard> */}
      {/* <PermissionGuard permission="view_permissions_iam"> */}
      <NavLink href="/dashboard/iam/permisos" pathname={pathname}>
        Permisos
      </NavLink>
      {/* </PermissionGuard> */}
      {/* <PermissionGuard permission="view_audit_iam"> */}
      <NavLink href="/dashboard/iam/auditoria" pathname={pathname}>
        Auditoría
      </NavLink>
      {/* </PermissionGuard> */}
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  pathname: string;
  children: React.ReactNode;
}

function NavLink({ href, pathname, children }: NavLinkProps) {
  const isActive = pathname === href || (href !== "/dashboard/iam" && pathname.startsWith(href));


  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-4 py-2 text-sm transition-colors duration-150 ease-in-out", // py reducido, rounded-md eliminado
        isActive
          ? "bg-[#004F9F] text-white font-semibold" // Estado activo: fondo azul personalizado, texto blanco
          : "text-slate-700 hover:bg-[#004F9F] hover:text-white" // Estado normal y hover con azul personalizado y texto blanco
      )}
    >
      {children}
    </Link>
  );
}
