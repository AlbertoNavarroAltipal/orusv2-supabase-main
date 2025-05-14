"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image"; // Importar Image
import { useRouter } from "next/navigation";
import {
  LayoutGrid,
  Search,
  Settings,
  ChevronDown,
  Building,
} from "lucide-react"; // Cambiar Menu por LayoutGrid
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/lib/stores";
import { useAuth } from "@/lib/auth/auth-provider";
import { AppGeneralMenu } from "./app-general-menu";
import { LogoutConfirmationDialog } from "./logout-confirmation-dialog";
import { NotificationsDropdown } from "./notifications-dropdown";
import { ChatDropdown } from "./chat-dropdown";
import { cn } from "@/lib/utils";

// Eliminar MainHeaderProps ya que no se recibe 'user' como prop

export function MainHeader() {
  // Eliminar { user } de los parámetros
  const router = useRouter();
  const { toggleMainSidebar } = useAppStore();
  // Obtener profile y signOut del contexto de autenticación
  const { profile, signOut, user } = useAuth(); // Añadir profile y user (para email)
  const [searchQuery, setSearchQuery] = useState("");
  const [isGlobalMenuOpen, setIsGlobalMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar scroll para cambiar la apariencia del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize(); // Comprobar tamaño inicial

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // Calcular iniciales desde el profile del contexto
  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "U"; // Fallback a la inicial del email o "U"

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
            : "bg-gradient-to-b from-primary-600 via-primary-500 to-primary-400 h-16"
        )}
      >
        <div className="max-w-screen-2xl mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/logo-white.png" // Usar el logo
                alt="ORUS Logo"
                width={40} // Reducir tamaño
                height={40} // Reducir tamaño proporcionalmente
                priority
              />
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsGlobalMenuOpen(true)}
              className="text-white hover:bg-white/10 rounded-full"
            >
              <LayoutGrid style={{ width: "1.8rem", height: "1.8rem" }} />{" "}
              {/* Aumentar tamaño con style */}
              <span className="sr-only">Abrir menú global</span>
            </Button>

            <form onSubmit={handleSearch} className="relative hidden md:block">
              <div className="relative">
                <Search
                  style={{ fontSize: "1.8rem" }}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 peer-focus:text-primary-600"
                />{" "}
                {/* Usar style y color visible */}
                <Input
                  type="search"
                  placeholder="Buscar en ORUS..."
                  className="peer w-[300px] lg:w-[400px] h-10 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-500 pl-10 pr-4 rounded-full focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:ring-opacity-50 transition-all duration-300 ease-in-out" // Fondo blanco, texto oscuro, placeholder gris
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
                <Building /> {/* Aumentar tamaño con style */}
                <span className="font-medium">Centro Bogotá</span>
                <ChevronDown className="opacity-70" />{" "}
                {/* Aumentar tamaño con style */}
              </Button>
            </div>

            <div className="flex items-center">
              <ChatDropdown />
              <NotificationsDropdown />

              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 rounded-full hidden md:flex"
              >
                <Settings /> {/* Aumentar tamaño con style */}
                <span className="sr-only">Ajustes</span>
              </Button>
            </div>

            <div className="h-6 w-px bg-white/20 mx-1 hidden md:block"></div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center text-white hover:bg-white/10 rounded-full p-1" // Quitar padding horizontal extra y gap
                >
                  <Avatar className="h-9 w-9 border-2 border-white/20">
                    {" "}
                    {/* Avatar un poco más grande */}
                    {/* Usar profile?.avatar_url */}
                    <AvatarImage
                      src={profile?.avatar_url || undefined}
                      alt={profile?.full_name || "Usuario"}
                    />
                    <AvatarFallback className="bg-primary-300 text-primary-800 font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {/* Eliminar el nombre del usuario del trigger */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1">
                <div className="flex flex-col space-y-1 p-2">
                  {/* Usar profile?.full_name y user?.email (el email suele estar en user) */}
                  <p className="text-sm font-medium">
                    {profile?.full_name || "Usuario"}
                  </p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link
                      href="/dashboard/profile"
                      className="flex w-full items-center"
                    >
                      <Avatar className="h-4 w-4 mr-2">
                        {/* Usar profile?.avatar_url */}
                        <AvatarImage
                          src={profile?.avatar_url || undefined}
                          alt={profile?.full_name || "Usuario"}
                        />
                        <AvatarFallback className="text-[10px]">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href="/dashboard/settings"
                      className="flex w-full items-center"
                    >
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

      <AppGeneralMenu
        isOpen={isGlobalMenuOpen}
        onClose={() => setIsGlobalMenuOpen(false)}
      />
    </>
  );
}
