"use client"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/dashboard/user-nav"
import { Menu, Info, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/stores/app-store"

export function AppHeader() {
  const pathname = usePathname()
  const { toggleSidebar, toggleInfoPanel, sidebarOpen, infoPanelOpen } = useAppStore()

  // Obtener la ruta actual para mostrar en la miga de pan
  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 justify-between">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("text-gray-700 hover:bg-gray-100", sidebarOpen && "bg-gray-100")}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú de la aplicación</span>
        </Button>

        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            {pathSegments.map((segment, index) => (
              <li key={segment} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                <span
                  className={cn(
                    "capitalize",
                    index === pathSegments.length - 1 ? "font-medium text-gray-900" : "text-gray-600",
                  )}
                >
                  {segment}
                </span>
              </li>
            ))}
          </ol>
        </nav>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleInfoPanel}
          className={cn("text-gray-700 hover:bg-gray-100", infoPanelOpen && "bg-gray-100")}
        >
          <Info className="h-5 w-5" />
          <span className="sr-only">Abrir panel de información</span>
        </Button>

        <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
          <Sparkles className="h-5 w-5" />
          <span className="sr-only">Abrir asistente IA</span>
        </Button>

        <UserNav />
      </div>
    </header>
  )
}
