import { getUserProfile } from "@/lib/auth/auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function DashboardPage() {
  const profile = await getUserProfile()

  if (!profile) {
    return null
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U"

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido a ORUS, tu plataforma integral de aplicaciones</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Perfil de Usuario</CardTitle>
            <CardDescription>Información de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "Usuario"} />
                <AvatarFallback className="bg-primary-100 text-primary-800">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{profile?.full_name || "Usuario"}</p>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Departamento:</span>
                <span className="text-sm">{profile?.department || "No especificado"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cargo:</span>
                <span className="text-sm">{profile?.position || "No especificado"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Teléfono:</span>
                <span className="text-sm">{profile?.phone || "No especificado"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas acciones realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-2 border-primary-300 pl-3 py-1">
                <p className="text-sm font-medium">Inicio de sesión</p>
                <p className="text-xs text-muted-foreground">Hace 10 minutos</p>
              </div>
              <div className="border-l-2 border-primary-300 pl-3 py-1">
                <p className="text-sm font-medium">Actualización de perfil</p>
                <p className="text-xs text-muted-foreground">Ayer a las 15:30</p>
              </div>
              <div className="border-l-2 border-primary-300 pl-3 py-1">
                <p className="text-sm font-medium">Creación de usuario</p>
                <p className="text-xs text-muted-foreground">12/05/2023 a las 10:15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Aplicaciones Recientes</CardTitle>
            <CardDescription>Módulos utilizados recientemente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  <span className="text-sm">Gestión de Usuarios</span>
                </div>
                <span className="text-xs text-muted-foreground">Hace 2h</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  <span className="text-sm">Reportes</span>
                </div>
                <span className="text-xs text-muted-foreground">Ayer</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  <span className="text-sm">Configuración</span>
                </div>
                <span className="text-xs text-muted-foreground">Hace 3 días</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
