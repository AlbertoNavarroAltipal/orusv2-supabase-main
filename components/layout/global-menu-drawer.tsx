"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Truck, UserCog, BarChart3, ShoppingCart, FileText, Settings, X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
// import { PermissionGuard } from "@/lib/auth/client-permissions" // Removing this import as the component is being redefined

interface GlobalMenuDrawerProps {
  isOpen: boolean
  onClose: () => void
}

interface AppMenuItem {
  name: string
  description: string
  icon: React.ReactNode
  href: string
  permission: string
  color: string
}

export function GlobalMenuDrawer({ isOpen, onClose }: GlobalMenuDrawerProps) {
  const router = useRouter()

  // Cerrar el drawer con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  // Prevenir scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  const appMenuItems: AppMenuItem[] = [
    {
      name: "IAM",
      description: "Gestión de identidades y accesos",
      icon: <Shield className="h-6 w-6" />,
      href: "/dashboard/iam",
      permission: "view_iam",
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Operaciones Logísticas",
      description: "Gestión de inventario y distribución",
      icon: <Truck className="h-6 w-6" />,
      href: "/dashboard/logistics",
      permission: "view_logistics",
      color: "bg-green-100 text-green-700",
    },
    {
      name: "Gestión Humana",
      description: "Administración de personal",
      icon: <UserCog className="h-6 w-6" />,
      href: "/dashboard/hr",
      permission: "view_hr",
      color: "bg-purple-100 text-purple-700",
    },
    {
      name: "Reportes",
      description: "Análisis y estadísticas",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "/dashboard/reports",
      permission: "view_reports",
      color: "bg-amber-100 text-amber-700",
    },
    {
      name: "Compras",
      description: "Gestión de proveedores y compras",
      icon: <ShoppingCart className="h-6 w-6" />,
      href: "/dashboard/purchases",
      permission: "view_purchases",
      color: "bg-red-100 text-red-700",
    },
    {
      name: "Documentos",
      description: "Gestión documental",
      icon: <FileText className="h-6 w-6" />,
      href: "/dashboard/documents",
      permission: "view_documents",
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      name: "Configuración",
      description: "Ajustes del sistema",
      icon: <Settings className="h-6 w-6" />,
      href: "/dashboard/settings",
      permission: "view_settings",
      color: "bg-gray-100 text-gray-700",
    },
  ]

  const handleNavigate = (href: string) => {
    router.push(href)
    onClose()
  }

  console.log("Rendering GlobalMenuDrawer with items:", appMenuItems)

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-full max-w-md bg-white z-50 shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold">Aplicaciones ORUS</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Cerrar</span>
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appMenuItems.map((item) => (
                // Mostrar todos los elementos del menú sin verificar permisos
                <AppMenuCard key={item.name} item={item} onClick={() => handleNavigate(item.href)} />

                // La implementación original está comentada para referencia
                /*
                <PermissionGuard key={item.name} permission={item.permission} fallback={null}>
                  <AppMenuCard item={item} onClick={() => handleNavigate(item.href)} />
                </PermissionGuard>
                */
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </>
  )
}

interface AppMenuCardProps {
  item: AppMenuItem
  onClick: () => void
}

function AppMenuCard({ item, onClick }: AppMenuCardProps) {
  return (
    <button
      className="flex flex-col items-start p-4 rounded-lg border hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
      onClick={onClick}
    >
      <div className={cn("p-2 rounded-md mb-3", item.color)}>{item.icon}</div>
      <h3 className="font-medium text-gray-900">{item.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
    </button>
  )
}
