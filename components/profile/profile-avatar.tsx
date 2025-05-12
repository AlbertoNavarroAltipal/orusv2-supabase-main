"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Camera, Loader2 } from "lucide-react"

interface ProfileAvatarProps {
  userId: string
  avatarUrl: string | null
  onAvatarChange: (url: string) => void
}

export function ProfileAvatar({ userId, avatarUrl, onAvatarChange }: ProfileAvatarProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)

  const initials = "U"

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      // Crear un nombre único para el archivo
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Subir el archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Obtener la URL pública del archivo
      const { data } = await supabase.storage.from("avatars").getPublicUrl(filePath)

      if (!data.publicUrl) {
        throw new Error("No se pudo obtener la URL pública del avatar")
      }

      // Actualizar el perfil con la nueva URL del avatar
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", userId)

      if (updateError) {
        throw updateError
      }

      // Actualizar el estado local
      onAvatarChange(data.publicUrl)

      toast({
        title: "Avatar actualizado",
        description: "Tu foto de perfil ha sido actualizada correctamente.",
      })

      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al actualizar el avatar",
        description: error.message,
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl || ""} alt="Avatar" />
        <AvatarFallback className="text-4xl">{initials}</AvatarFallback>
      </Avatar>
      <div className="relative">
        <Button variant="outline" size="sm" className="relative" disabled={isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
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
            onChange={handleUpload}
            disabled={isUploading}
          />
        </Button>
      </div>
    </div>
  )
}
