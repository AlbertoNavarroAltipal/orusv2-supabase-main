import { hasPermission } from "@/lib/auth/auth-utils"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { EditUserForm } from "@/components/iam/users/edit-user-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserRoles } from "@/components/iam/users/user-roles"
import { UserPermissions } from "@/components/iam/users/user-permissions"
import { UserActivity } from "@/components/iam/users/user-activity"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface UserPageProps {
  params: {
    id: string
  }
}

export default async function UserPage({ params }: UserPageProps) {
  const { id } = params

  // Verificar permisos
  const canViewUsers = await hasPermission("view_users")
  const canUpdateUsers = await hasPermission("update_users")

  if (!canViewUsers) {
    redirect("/dashboard")
  }

  // Obtener datos del usuario
  const supabase = getSupabaseServerClient()
  const { data: user } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (!user) {
    redirect("/dashboard/iam/users")
  }

  // Obtener roles para el formulario
  const { data: roles } = await supabase.from("roles").select("*").order("name", { ascending: true })

  // Obtener roles asignados al usuario
  const { data: userRoles } = await supabase
    .from("user_roles")
    .select(`
      *,
      roles (
        id,
        name,
        description
      )
    `)
    .eq("user_id", id)

  // Obtener permisos directos del usuario
  const { data: userPermissions } = await supabase
    .from("user_permissions")
    .select(`
      *,
      permissions (
        id,
        name,
        description,
        resource,
        action
      )
    `)
    .eq("user_id", id)

  // Obtener actividad del usuario (auditoría)
  const { data: userActivity } = await supabase
    .from("audit_logs")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center">
        <Link href="/dashboard/iam/users">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Usuario: {user.full_name || "Sin nombre"}</h2>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permisos</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Usuario</CardTitle>
              <CardDescription>Edita la información del usuario</CardDescription>
            </CardHeader>
            <CardContent>
              <EditUserForm user={user} canEdit={canUpdateUsers} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Roles del Usuario</CardTitle>
              <CardDescription>Gestiona los roles asignados al usuario</CardDescription>
            </CardHeader>
            <CardContent>
              <UserRoles
                userId={id}
                userRoles={userRoles || []}
                availableRoles={roles || []}
                canEdit={canUpdateUsers}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Permisos del Usuario</CardTitle>
              <CardDescription>Gestiona los permisos directos del usuario</CardDescription>
            </CardHeader>
            <CardContent>
              <UserPermissions userId={id} userPermissions={userPermissions || []} canEdit={canUpdateUsers} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Actividad del Usuario</CardTitle>
              <CardDescription>Historial de actividad del usuario</CardDescription>
            </CardHeader>
            <CardContent>
              <UserActivity userId={id} activities={userActivity || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
