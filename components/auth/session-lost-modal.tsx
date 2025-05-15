"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react" // Asumiendo que lucide-react está disponible

interface SessionLostModalProps {
  isOpen: boolean
  onClose: () => void // Aunque la redirección se maneja internamente, podría ser útil
}

export function SessionLostModal({ isOpen, onClose }: SessionLostModalProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5) // Reset countdown when modal is closed or not open initially
      return
    }

    if (countdown === 0) {
      router.push("/auth/login")
      onClose() // Cierra el modal después de la redirección
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isOpen, countdown, router, onClose])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader className="items-center text-center">
          <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
          <DialogTitle className="text-2xl font-bold">Sesión Perdida</DialogTitle>
          <DialogDescription className="text-center">
            Tu sesión ha expirado o ha sido cerrada.
            Serás redirigido a la página de inicio de sesión en {countdown} segundos.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              router.push("/auth/login")
              onClose()
            }}
          >
            Ir a Login Ahora
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}