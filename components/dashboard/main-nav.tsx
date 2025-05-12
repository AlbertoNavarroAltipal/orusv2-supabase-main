"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, MessageSquare, Bell, Home, Users, Settings, Shield, Layers } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div
      className={cn(
        "bg-primary-500 text-white flex flex-col h-full transition-all duration-300",
        isOpen ? "w-64" : "w-20",
      )}
    >
      <div className="flex items-center p-4 border-b border-primary-600">
        <Button variant="ghost" size="icon" onClick={toggleMenu} className="text-white hover:bg-primary-600">
          <Menu className="h-5 w-5" />
        </Button>
        {isOpen && <div className="ml-3 font-bold text-xl">ORUS</div>}
      </div>

      <div className="p-4">
        {isOpen ? (
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
            <Input
              type="search"
              placeholder="Buscar en ORUS..."
              className="pl-8 bg-primary-600 border-primary-400 text-white placeholder:text-white/70"
            />
          </div>
        ) : (
          <Button variant="ghost" size="icon" className="w-full text-white hover:bg-primary-600">
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-1 px-2 py-4">
          <NavItem
            href="/dashboard"
            icon={<Home className="h-5 w-5" />}
            label="Inicio"
            isActive={pathname === "/dashboard"}
            isOpen={isOpen}
          />
          <NavItem
            href="/dashboard/users"
            icon={<Users className="h-5 w-5" />}
            label="Usuarios"
            isActive={pathname.startsWith("/dashboard/users")}
            isOpen={isOpen}
          />
          <NavItem
            href="/dashboard/roles"
            icon={<Shield className="h-5 w-5" />}
            label="Roles"
            isActive={pathname.startsWith("/dashboard/roles")}
            isOpen={isOpen}
          />
          <NavItem
            href="/dashboard/apps"
            icon={<Layers className="h-5 w-5" />}
            label="Aplicaciones"
            isActive={pathname.startsWith("/dashboard/apps")}
            isOpen={isOpen}
          />
          <NavItem
            href="/dashboard/settings"
            icon={<Settings className="h-5 w-5" />}
            label="Configuración"
            isActive={pathname.startsWith("/dashboard/settings")}
            isOpen={isOpen}
          />
        </nav>
      </div>

      <div className="p-4 flex items-center justify-around border-t border-primary-600">
        <Button variant="ghost" size="icon" className="text-white hover:bg-primary-600">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-primary-600">
          <Bell className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  isOpen: boolean
}

function NavItem({ href, icon, label, isActive, isOpen }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-2 py-2 rounded-md",
        isActive ? "bg-primary-600 text-white" : "text-white/80 hover:bg-primary-600 hover:text-white",
      )}
    >
      <div className={cn("flex items-center", !isOpen && "justify-center w-full")}>
        {icon}
        {isOpen && <span className="ml-3">{label}</span>}
      </div>
    </Link>
  )
}
