import { getSupabaseServerClient } from "@/lib/supabase/server"
import { hasPermission } from "@/lib/auth/auth-utils"
import { UsersDataTable } from "@/components/iam/users/users-data-table"
import { columns } from "@/components/iam/users/columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function UsersPage() {
  // Verificar permisos
  const canCreateUsers = await hasPermission("create_users")

  // Obtener usuarios
  const supabase = getSupabaseServerClient()
  const { data: users, error } = await supabase
    .from("profiles")
    .select(`
      *,
      user_roles (
        roles (
          id,
          name,
          description
        )
      )
    `)
    .order("full_name", { ascending: true })

  if (error) {
    console.error("Error al obtener usuarios:", error)
  }

  // Procesar los datos para incluir los roles
  const processedUsers =
    users?.map((user) => ({
      ...user,
      roles: user.user_roles?.map((ur) => ur.roles) || [],
    })) || []

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
          <p className="text-muted-foreground">Gestiona los usuarios del sistema y sus roles</p>
        </div>

        {canCreateUsers && (
          <Link href="/dashboard/iam/users/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear usuario
            </Button>
          </Link>
        )}
      </div>

      <UsersDataTable columns={columns} data={processedUsers} />
    </div>
  )
}
