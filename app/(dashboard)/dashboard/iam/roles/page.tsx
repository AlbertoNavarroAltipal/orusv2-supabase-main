import { getSupabaseServerClient } from "@/lib/supabase/server"
import { hasPermission } from "@/lib/auth/auth-utils"
import { RolesDataTable } from "@/components/iam/roles/roles-data-table"
import { columns } from "@/components/iam/roles/columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function RolesPage() {
  // Verificar permisos
  const canCreateRoles = await hasPermission("manage_roles")

  // Obtener roles
  const supabase = getSupabaseServerClient()
  const { data: roles, error } = await supabase
    .from("roles")
    .select(`
      *,
      role_permissions (
        count
      )
    `)
    .order("name", { ascending: true })

  if (error) {
    console.error("Error al obtener roles:", error)
  }

  // Obtener conteo de usuarios por rol
  const { data: userCounts } = await supabase.from("user_roles").select("role_id, count").group("role_id")

  // Crear un mapa de conteos de usuarios por rol
  const userCountMap = new Map()
  userCounts?.forEach((item) => {
    userCountMap.set(item.role_id, item.count)
  })

  // Procesar los datos para incluir el conteo de usuarios
  const processedRoles =
    roles?.map((role) => ({
      ...role,
      userCount: userCountMap.get(role.id) || 0,
      permissionCount: role.role_permissions?.length || 0,
    })) || []

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Roles</h2>
          <p className="text-muted-foreground">Gestiona los roles del sistema y sus permisos</p>
        </div>

        {canCreateRoles && (
          <Link href="/dashboard/iam/roles/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear rol
            </Button>
          </Link>
        )}
      </div>

      <RolesDataTable columns={columns} data={processedRoles} />
    </div>
  )
}
