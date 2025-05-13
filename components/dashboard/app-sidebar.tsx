"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAppStore } from "@/lib/stores/app-store";

export function AppSidebar() {
  const pathname = usePathname();
  const { appSidebarOpen, toggleAppSidebar } = useAppStore();

  // Determinar qué aplicación está activa basado en la ruta
  const currentApp = pathname.split("/")[2] || "dashboard";

  console.log("AppSidebar pathname:", pathname);
  console.log("AppSidebar currentApp:", currentApp);

  if (!appSidebarOpen) return null;

  return (
    <div className="bg-amber-50 w-64 border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">Menú de {currentApp}</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAppSidebar}
          className="text-gray-500 hover:bg-amber-100"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Cerrar menú</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-gray-600 mb-4">
          En esta sección se mostrará solo el menú del módulo o app que tengo
          abierto en ese momento
        </p>

        {/* Renderizar menú según la aplicación activa */}
        {currentApp === "dashboard" && <DashboardMenu pathname={pathname} />}
        {currentApp === "users" && <UsersMenu pathname={pathname} />}
        {currentApp === "roles" && <RolesMenu pathname={pathname} />}
        {currentApp === "tickets" && <TicketsMenu pathname={pathname} />}
      </div>
    </div>
  );
}

function DashboardMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-1">
      <NavLink href="/dashboard" pathname={pathname}>
        Resumen
      </NavLink>
      <NavLink href="/dashboard/profile" pathname={pathname}>
        Mi perfil
      </NavLink>
      <NavLink href="/dashboard/settings" pathname={pathname}>
        Configuración
      </NavLink>
    </nav>
  );
}

function UsersMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-1">
      <NavLink href="/dashboard/users" pathname={pathname}>
        Listado de usuarios
      </NavLink>
      <NavLink href="/dashboard/users/create" pathname={pathname}>
        Crear usuario
      </NavLink>
    </nav>
  );
}

function RolesMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-1">
      <NavLink href="/dashboard/roles" pathname={pathname}>
        Listado de roles
      </NavLink>
      <NavLink href="/dashboard/roles/create" pathname={pathname}>
        Crear rol
      </NavLink>
      <NavLink href="/dashboard/permissions" pathname={pathname}>
        Permisos
      </NavLink>
    </nav>
  );
}

function TicketsMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-1">
      <NavLink href="/dashboard/tickets" pathname={pathname}>
        Todos los Tickets
      </NavLink>
      <NavLink href="/dashboard/tickets/abiertos" pathname={pathname}>
        Abiertos
      </NavLink>
      <NavLink href="/dashboard/tickets/cerrados" pathname={pathname}>
        Cerrados
      </NavLink>
      <NavLink href="/dashboard/tickets/crear" pathname={pathname}>
        Crear Ticket
      </NavLink>
      <NavLink href="/dashboard/tickets/agentes" pathname={pathname}>
        Tickets para Agentes
      </NavLink>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  pathname: string;
  children: React.ReactNode;
}

function NavLink({ href, pathname, children }: NavLinkProps) {
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 text-sm rounded-md",
        isActive
          ? "bg-amber-200 text-amber-900 font-medium"
          : "text-gray-700 hover:bg-amber-100"
      )}
    >
      {children}
    </Link>
  );
}
