import { hasPermission } from "@/lib/auth/auth-utils"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { EditRoleForm } from "@/components/iam/roles/edit-role-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RolePermissions } from "@/components/iam/roles/role-permissions"
import { RoleUsers } from "@/components/iam/roles/role-users"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface RolePageProps {
  params: {
    id: string
  }
}

export default async function RolePage({ params }: RolePageProps) {
  const { id } = params

  // Verificar permisos
  const canViewRoles = await hasPermission("view_roles")
  const canManageRoles = await hasPermission("manage_roles")

  if (!canViewRoles) {
    redirect("/dashboard")
  }

  // Obtener datos del rol
  const supabase = getSupabaseServerClient()
  const { data: role } = await supabase.from("roles").select("*").eq("id", id).single()

  if (!role) {
    redirect("/dashboard/iam/roles")
  }

  // Obtener permisos para el formulario
  const { data: permissions } = await supabase
    .from("permissions")
    .select("*")
    .order("resource", { ascending: true })
    .order("name", { ascending: true })

  // Obtener permisos asignados al rol
  const { data: rolePermissions } = await supabase
    .from("role_permissions")
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
    .eq("role_id", id)

  // Obtener usuarios con este rol
  const { data: roleUsers } = await supabase
    .from("user_roles")
    .select(`
      *,
      profiles (
        id,
        full_name,
        email,
        avatar_url,
        department,
        position
      )
    `)
    .eq("role_id", id)

  // Agrupar permisos por recurso
  const groupedPermissions: Record<string, any[]> = {}
  permissions?.forEach((permission) => {
    if (!groupedPermissions[permission.resource]) {
      groupedPermissions[permission.resource] = []
    }
    groupedPermissions[permission.resource].push(permission)
  })

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center">
        <Link href="/dashboard/iam/roles">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Rol: {role.name}</h2>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="permissions">Permisos</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Información del Rol</CardTitle>
              <CardDescription>Edita la información básica del rol</CardDescription>
            </CardHeader>
            <CardContent>
              <EditRoleForm role={role} canEdit={canManageRoles} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Permisos del Rol</CardTitle>
              <CardDescription>Gestiona los permisos asignados al rol</CardDescription>
            </CardHeader>
            <CardContent>
              <RolePermissions
                roleId={id}
                rolePermissions={rolePermissions || []}
                groupedPermissions={groupedPermissions}
                canEdit={canManageRoles}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Usuarios con este Rol</CardTitle>
              <CardDescription>Usuarios que tienen asignado este rol</CardDescription>
            </CardHeader>
            <CardContent>
              <RoleUsers roleId={id} roleUsers={roleUsers || []} canEdit={canManageRoles} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
