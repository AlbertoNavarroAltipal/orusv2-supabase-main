"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useAppStore } from "@/lib/stores"
import { PermissionGuard } from "@/lib/auth/client-permissions"

export function AppSidebar() {
  const pathname = usePathname()
  const { appSidebarOpen, toggleAppSidebar } = useAppStore()

  // Determinar qué aplicación está activa basado en la ruta
  const pathSegments = pathname.split("/").filter(Boolean)
  let currentModule = "dashboard" // Valor por defecto

  if (pathSegments.length > 1 && pathSegments[0] === "dashboard" && pathSegments[1] === "escuela-altipal") {
    currentModule = "escuela-altipal"
  } else if (pathSegments.length > 1 && pathSegments[0] === "dashboard" && pathSegments[1] === "tickets") {
    currentModule = "tickets"
  } else if (pathSegments.length > 0 && pathSegments[0] !== "dashboard") {
    currentModule = pathSegments[0]
  }
  // Si es solo /dashboard, currentModule sigue siendo "dashboard"

  if (!appSidebarOpen) return null

  return (
    <div className="bg-amber-50 w-64 border-r border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">Menú dedicado de la app</h2>
        <Button variant="ghost" size="icon" onClick={toggleAppSidebar} className="text-gray-500 hover:bg-amber-100">
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Cerrar menú</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-gray-600 mb-4">
          En esta sección se mostrará solo el menú del módulo o app que tengo abierto en ese momento
        </p>

        {/* Renderizar menú según la aplicación activa */}
        {currentModule === "dashboard" && <DashboardMenu pathname={pathname} />}
        {currentModule === "users" && <UsersMenu pathname={pathname} />}
        {currentModule === "roles" && <RolesMenu pathname={pathname} />}
        {currentModule === "escuela-altipal" && <EscuelaAltipalMenu pathname={pathname} />}
        {currentModule === "tickets" && <TicketsMenu pathname={pathname} />}
      </div>
    </div>
  )
}

function DashboardMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-2"> {/* Aumentar el espacio entre elementos */}
      <NavLink href="/dashboard" pathname={pathname}>
        Muro de notificas
      </NavLink>
      <NavLink href="/dashboard/escuela-altipal" pathname={pathname}> {/* Ruta provisional */}
        Escuela Altipal
      </NavLink>
      {/* Asumiendo que Tickets no necesita un PermissionGuard específico por ahora */}
      {/* Si se necesita, se puede añadir como el de Configuración anteriormente */}
      <NavLink href="/dashboard/tickets" pathname={pathname}> {/* Ruta provisional */}
        Tickets
      </NavLink>
      {/* Puedes añadir más NavLink aquí si es necesario para el "etc..." */}
    </nav>
  )
}

function EscuelaAltipalMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-2">
      <NavLink href="/dashboard/escuela-altipal" pathname={pathname}>
        Resumen
      </NavLink>
      <NavLink href="/dashboard/escuela-altipal/mis-cursos" pathname={pathname}>
        Mis Cursos
      </NavLink>
      <NavLink href="/dashboard/escuela-altipal/mis-calificaciones" pathname={pathname}>
        Mis Calificaciones
      </NavLink>
      <NavLink href="/dashboard/escuela-altipal/catalogo-cursos" pathname={pathname}>
        Catálogo de Cursos
      </NavLink>
      <NavLink href="/dashboard/escuela-altipal/rutas-aprendizaje" pathname={pathname}>
        Rutas de Aprendizaje
      </NavLink>
      <NavLink href="/dashboard/escuela-altipal/certificados" pathname={pathname}>
        Certificados
      </NavLink>
      {/* Agrega más enlaces aquí si es necesario */}
    </nav>
  )
}

function TicketsMenu({ pathname }: { pathname: string }) {
  return (
    <nav className="space-y-2">
      <NavLink href="/dashboard/tickets" pathname={pathname}>
        Ver mis tickets
      </NavLink>
      <NavLink href="/dashboard/tickets/crear" pathname={pathname}>
        Crear nuevo ticket
      </NavLink>
      {/* Agrega más enlaces aquí si es necesario */}
    </nav>
  )
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
  )
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
  )
}

interface NavLinkProps {
  href: string
  pathname: string
  children: React.ReactNode
}

function NavLink({ href, pathname, children }: NavLinkProps) {
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-4 py-2.5 text-sm rounded-md transition-colors duration-150 ease-in-out", // Padding aumentado y transición
        isActive
          ? "bg-amber-300 text-amber-900 font-semibold" // Estado activo más prominente
          : "text-gray-700 hover:bg-amber-200 hover:text-amber-800", // Hover mejorado
      )}
    >
      {children}
    </Link>
  )
}
