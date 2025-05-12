"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useAppStore } from "@/lib/stores/app-store"
import { usePathname } from "next/navigation"

export function InfoPanel() {
  const { infoPanelOpen, toggleInfoPanel } = useAppStore()
  const pathname = usePathname()

  // Determinar qué aplicación está activa basado en la ruta
  const currentApp = pathname.split("/")[2] || "dashboard"

  if (!infoPanelOpen) return null

  return (
    <div className="bg-green-50 w-80 border-l border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-semibold text-gray-800">Información del módulo</h2>
        <Button variant="ghost" size="icon" onClick={toggleInfoPanel} className="text-gray-500 hover:bg-green-100">
          <X className="h-5 w-5" />
          <span className="sr-only">Cerrar panel</span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-gray-600 mb-4">
          Esta sección solo se mostrará cuando el botón de ver información de le de click
        </p>

        {/* Mostrar información según la aplicación activa */}
        {currentApp === "dashboard" && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Dashboard</h3>
            <p className="text-sm text-gray-600">
              El dashboard muestra un resumen de la actividad y estado del sistema.
            </p>
          </div>
        )}

        {currentApp === "users" && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Gestión de Usuarios</h3>
            <p className="text-sm text-gray-600">
              Este módulo permite administrar los usuarios del sistema, crear nuevos usuarios, asignar roles y permisos.
            </p>
          </div>
        )}

        {currentApp === "roles" && (
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Gestión de Roles</h3>
            <p className="text-sm text-gray-600">
              Este módulo permite administrar los roles del sistema, crear nuevos roles, y asignar permisos a cada rol.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
