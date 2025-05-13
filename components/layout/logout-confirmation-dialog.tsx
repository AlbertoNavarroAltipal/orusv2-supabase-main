"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-provider"
import { LogOut } from "lucide-react"

export function LogoutConfirmationDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signOut } = useAuth()
  const router = useRouter()

  const handleOpenChange = (open: boolean) => {
    setOpen(open)
  }

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await signOut()
      // The signOut function in AuthProvider already handles redirection.
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setIsLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <Button variant="ghost" className="flex w-full items-center justify-start" onClick={() => setOpen(true)}>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Cerrar sesión</span>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cerrar sesión</DialogTitle>
            <DialogDescription>¿Estás seguro de que deseas cerrar sesión?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-2 sm:justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="button" variant="destructive" onClick={handleLogout} disabled={isLoading}>
              {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
