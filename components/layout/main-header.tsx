"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Search, Settings, ChevronDown, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppStore } from "@/lib/stores"
import { useAuth } from "@/lib/auth/auth-provider"
import { GlobalMenuDrawer } from "./global-menu-drawer"
import { LogoutConfirmationDialog } from "./logout-confirmation-dialog"
import { NotificationsDropdown } from "./notifications-dropdown"
import { ChatDropdown } from "./chat-dropdown"
import { cn } from "@/lib/utils"

// Eliminar MainHeaderProps ya que no se recibe 'user' como prop

export function MainHeader() { // Eliminar { user } de los parámetros
  const router = useRouter()
  const { toggleMainSidebar } = useAppStore()
  // Obtener profile y signOut del contexto de autenticación
  const { profile, signOut, user } = useAuth() // Añadir profile y user (para email)
  const [searchQuery, setSearchQuery] = useState("")
  const [isGlobalMenuOpen, setIsGlobalMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar scroll para cambiar la apariencia del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    handleResize() // Comprobar tamaño inicial

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  // Calcular iniciales desde el profile del contexto
  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U" // Fallback a la inicial del email o "U"

  // Podríamos añadir un estado de carga si useAuth tiene isLoading
  // const { profile, signOut, user, isLoading } = useAuth();
  // if (isLoading) return <HeaderSkeleton />; // O algún indicador de carga

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 text-white z-50 transition-all duration-300",
          isScrolled
            ? "bg-primary-600/95 backdrop-blur-sm h-14 shadow-md"
            : "bg-gradient-to-b from-primary-600 via-primary-500 to-primary-400 h-16",
        )}
      >
        <div className="max-w-screen-2xl mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-bold text-xl flex items-center">
              <span className="bg-white text-primary-600 rounded-lg px-2 py-1 mr-1.5">O</span>
              <span className={cn("transition-opacity", isScrolled && isMobile ? "opacity-0 w-0" : "opacity-100")}>
                RUS
              </span>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsGlobalMenuOpen(true)}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú global</span>
            </Button>

            <form onSubmit={handleSearch} className="relative hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar en ORUS..."
                  className="w-[300px] lg:w-[400px] bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 pl-10 focus:bg-white focus:text-gray-800 focus:placeholder:text-gray-500 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          <div className="flex items-center gap-1 md:gap-2">
            <div className="hidden md:flex items-center mr-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 flex items-center gap-2 h-9 px-3"
              >
                <Building className="h-4 w-4" />
                <span className="font-medium">Centro Bogotá</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70" />
              </Button>
            </div>

            <div className="flex items-center">
              <ChatDropdown />
              <NotificationsDropdown />

              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full hidden md:flex">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Ajustes</span>
              </Button>
            </div>

            <div className="h-6 w-px bg-white/20 mx-1 hidden md:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-white hover:bg-white/10 rounded-full p-1 md:pl-2 md:pr-3"
                >
                  <Avatar className="h-8 w-8 border-2 border-white/20">
                    {/* Usar profile?.avatar_url */}
                    <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "Usuario"} />
                    <AvatarFallback className="bg-primary-300 text-primary-800 font-medium">{initials}</AvatarFallback>
                  </Avatar>
                  {/* Usar profile?.full_name */}
                  <span className="hidden md:inline-block font-medium">{profile?.full_name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1">
                <div className="flex flex-col space-y-1 p-2">
                  {/* Usar profile?.full_name y user?.email (el email suele estar en user) */}
                  <p className="text-sm font-medium">{profile?.full_name || "Usuario"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link href="/dashboard/profile" className="flex w-full items-center">
                      <Avatar className="h-4 w-4 mr-2">
                         {/* Usar profile?.avatar_url */}
                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "Usuario"} />
                        <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
                      </Avatar>
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/dashboard/settings" className="flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Centro de distribución
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    <span>Bogotá</span>
                    <span className="ml-auto bg-primary-100 text-primary-800 text-xs rounded-full px-1.5 py-0.5">
                      Actual
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Building className="mr-2 h-4 w-4" />
                    Medellín
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Building className="mr-2 h-4 w-4" />
                    Cali
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <LogoutConfirmationDialog />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Espacio para compensar el header fijo */}
      <div className={isScrolled ? "h-14" : "h-16"}></div>

      <GlobalMenuDrawer isOpen={isGlobalMenuOpen} onClose={() => setIsGlobalMenuOpen(false)} />
    </>
  )
}
