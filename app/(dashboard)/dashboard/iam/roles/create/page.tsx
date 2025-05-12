import { hasPermission } from "@/lib/auth/auth-utils"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { CreateRoleForm } from "@/components/iam/roles/create-role-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function CreateRolePage() {
  // Verificar permisos
  const canManageRoles = await hasPermission("manage_roles")

  if (!canManageRoles) {
    redirect("/dashboard/iam/roles")
  }

  // Obtener permisos para el formulario
  const supabase = getSupabaseServerClient()
  const { data: permissions } = await supabase
    .from("permissions")
    .select("*")
    .order("resource", { ascending: true })
    .order("name", { ascending: true })

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
        <h2 className="text-2xl font-bold tracking-tight">Crear Rol</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo Rol</CardTitle>
          <CardDescription>Crea un nuevo rol y asígnale permisos</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateRoleForm groupedPermissions={groupedPermissions} />
        </CardContent>
      </Card>
    </div>
  )
}
