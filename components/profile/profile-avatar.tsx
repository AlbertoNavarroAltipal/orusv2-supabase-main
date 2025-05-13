"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, Loader2 } from "lucide-react" // Mantener Loader2 por si se usa en el futuro

interface ProfileAvatarProps {
  userId: string // Mantener userId por si se necesita para generar nombres de archivo únicos en el padre
  avatarUrl: string | null // URL del avatar actual o previsualización
  onFileSelect: (file: File | null, previewUrl: string | null) => void // Callback para pasar el archivo y la URL de previsualización
  isLoading?: boolean // Indicador de carga desde el padre
}

export function ProfileAvatar({ userId, avatarUrl, onFileSelect, isLoading = false }: ProfileAvatarProps) {
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(avatarUrl)

  // Actualizar la URL del avatar si cambia la prop
  useEffect(() => {
    setCurrentAvatarUrl(avatarUrl)
  }, [avatarUrl])

  // TODO: Calcular iniciales dinámicamente desde el nombre del usuario si está disponible
  const initials = "U"

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setCurrentAvatarUrl(previewUrl) // Mostrar previsualización
      onFileSelect(file, previewUrl) // Pasar archivo y URL de previsualización al padre
    } else {
      // Si el usuario cancela la selección, revertir a la URL original y notificar al padre
      setCurrentAvatarUrl(avatarUrl) // Revertir a la URL original (la que viene de props)
      onFileSelect(null, null)
    }

    // Limpiar el valor del input para permitir seleccionar el mismo archivo de nuevo
    event.target.value = ""
  }

  // Limpiar la URL del objeto cuando el componente se desmonte o la URL cambie
  useEffect(() => {
    let currentPreviewUrl = currentAvatarUrl
    return () => {
      if (currentPreviewUrl && currentPreviewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreviewUrl)
      }
    }
  }, [currentAvatarUrl])

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32">
        {/* Usar currentAvatarUrl que puede ser la original o la de previsualización */}
        <AvatarImage src={currentAvatarUrl || ""} alt="Avatar" />
        <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
      </Avatar>
      <div className="relative">
        <Button variant="outline" size="sm" className="relative" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Cambiar foto
            </>
          )}
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </Button>
      </div>
    </div>
  )
}
