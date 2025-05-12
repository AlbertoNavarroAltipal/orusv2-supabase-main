"use client"

import type { Profile } from "@/types/user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth/auth-provider"

interface UserProfileProps {
  profile: Profile | null
}

export function UserProfile({ profile }: UserProfileProps) {
  const { user } = useAuth()

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Usuario</CardTitle>
        <CardDescription>Información completa de tu perfil</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "Usuario"} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-medium">{profile?.full_name || "Usuario"}</h3>
            <p className="text-sm text-muted-foreground">{profile?.email || user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Departamento</h4>
            <p>{profile?.department || "No especificado"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Cargo</h4>
            <p>{profile?.position || "No especificado"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Teléfono</h4>
            <p>{profile?.phone || "No especificado"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Último acceso</h4>
            <p>{profile?.last_sign_in ? new Date(profile.last_sign_in).toLocaleString() : "No disponible"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
