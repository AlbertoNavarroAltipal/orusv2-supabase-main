"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAppStore } from "@/lib/stores";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Importar cn

export function InfoSidebar() {
  const { infoSidebarOpen, toggleInfoSidebar } = useAppStore();
  const pathname = usePathname();

  // Determinar qué aplicación está activa basado en la ruta
  const pathSegments = pathname.split("/").filter(Boolean);
  const currentModule = pathSegments.length > 0 ? pathSegments[0] : "dashboard";

  // Ya no retornamos null aquí para permitir la animación
  // if (!infoSidebarOpen) return null

  return (
    <div
      className={cn(
        "bg-green-50 border-l border-gray-200 flex flex-col",
        "transition-all duration-300 ease-in-out", // Clases para la animación de ancho
        infoSidebarOpen ? "w-80" : "w-0 overflow-hidden" // Controla el ancho y oculta contenido
      )}
    >
      {/* El contenido solo se renderiza si el sidebar está abierto para evitar problemas de layout con w-0 */}
      {infoSidebarOpen && (
        <>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-800">
              Información del módulo
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleInfoSidebar}
              className="text-gray-500 hover:bg-green-100"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar panel</span>
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-sm text-gray-600 mb-4">
              Esta sección solo se mostrará cuando el botón de ver información
              se le de click
            </p>

            {/* Mostrar información según la aplicación activa */}
            {currentModule === "dashboard" && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Dashboard</h3>
                <p className="text-sm text-gray-600">
                  El dashboard muestra un resumen de la actividad y estado del
                  sistema.
                </p>
              </div>
            )}

            {currentModule === "users" && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">
                  Gestión de Usuarios
                </h3>
                <p className="text-sm text-gray-600">
                  Este módulo permite administrar los usuarios del sistema,
                  crear nuevos usuarios, asignar roles y permisos.
                </p>
              </div>
            )}

            {currentModule === "roles" && (
              <div className="space-y-4">
                <h3 className="font-medium text-gray-800">Gestión de Roles</h3>
                <p className="text-sm text-gray-600">
                  Este módulo permite administrar los roles del sistema, crear
                  nuevos roles, y asignar permisos a cada rol.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
