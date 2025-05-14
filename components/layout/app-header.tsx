"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Info, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/stores"
import { cn } from "@/lib/utils";

export function AppHeader() {
  const pathname = usePathname()
  const { appSidebarOpen, toggleAppSidebar, infoSidebarOpen, toggleInfoSidebar } = useAppStore()

  // Obtener la ruta actual para mostrar en la miga de pan
  const pathSegments = pathname.split("/").filter(Boolean)
  const currentModule = pathSegments.length > 0 ? pathSegments[0] : "dashboard"
  const currentPage = pathSegments.length > 1 ? pathSegments[1] : ""

  return (
    <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAppSidebar}
          className={cn(
            "hover:bg-gray-100 rounded-full",
            appSidebarOpen
              ? "bg-[#004f93] text-white hover:bg-[#004f93]/90 hover:text-white"
              : "text-gray-700"
          )}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menú de la aplicación</span>
        </Button>

        <div className="text-sm text-gray-600">
          {currentModule && (
            <Link href={`/${pathSegments.slice(0, 1).join("/")}`} legacyBehavior>
              <a className="capitalize hover:underline">{currentModule}</a>
            </Link>
          )}
          {currentPage && (
            <>
              <span className="mx-2">/</span>
              <Link href={`/${pathSegments.slice(0, 2).join("/")}`} legacyBehavior>
                <a className="capitalize hover:underline">{currentPage}</a>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleInfoSidebar}
          className={cn(
            "hover:bg-gray-100 rounded-full",
            infoSidebarOpen
              ? "bg-[#004f93] text-white hover:bg-[#004f93]/90 hover:text-white"
              : "text-gray-700"
          )}
        >
          <Info className="h-5 w-5" />
          <span className="sr-only">Abrir panel de información</span>
        </Button>

        <Button variant="ghost" size="icon" className="text-gray-700 hover:bg-gray-100">
          <Sparkles className="h-5 w-5" />
          <span className="sr-only">Abrir asistente IA</span>
        </Button>
      </div>
    </header>
  )
}
