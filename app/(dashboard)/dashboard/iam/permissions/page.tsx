import { getSupabaseServerClient } from "@/lib/supabase/server"
import { hasPermission } from "@/lib/auth/auth-utils"
import { PermissionsDataTable } from "@/components/iam/permissions/permissions-data-table"
import { columns } from "@/components/iam/permissions/columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function PermissionsPage() {
  // Verificar permisos
  const canManagePermissions = await hasPermission("manage_permissions")

  // Obtener permisos
  const supabase = getSupabaseServerClient()
  const { data: permissions, error } = await supabase
    .from("permissions")
    .select("*")
    .order("resource", { ascending: true })
    .order("name", { ascending: true })

  if (error) {
    console.error("Error al obtener permisos:", error)
  }

  // Obtener conteo de roles por permiso
  const { data: roleCounts } = await supabase
    .from("role_permissions")
    .select("permission_id, count")
    .group("permission_id")

  // Crear un mapa de conteos de roles por permiso
  const roleCountMap = new Map()
  roleCounts?.forEach((item) => {
    roleCountMap.set(item.permission_id, item.count)
  })

  // Procesar los datos para incluir el conteo de roles
  const processedPermissions =
    permissions?.map((permission) => ({
      ...permission,
      roleCount: roleCountMap.get(permission.id) || 0,
    })) || []

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Permisos</h2>
          <p className="text-muted-foreground">Gestiona los permisos del sistema</p>
        </div>

        {canManagePermissions && (
          <Link href="/dashboard/iam/permissions/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear permiso
            </Button>
          </Link>
        )}
      </div>

      <PermissionsDataTable columns={columns} data={processedPermissions} />
    </div>
  )
}
