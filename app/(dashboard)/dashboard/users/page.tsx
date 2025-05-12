import { hasPermission } from "@/lib/auth/auth-utils"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DataTable } from "@/components/dashboard/data-table"
import { columns } from "./columns"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

export default async function UsersPage() {
  // Verificar permisos
  const canViewUsers = await hasPermission("view_users")
  const canCreateUsers = await hasPermission("create_users")

  if (!canViewUsers) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">Gestión de usuarios del sistema</p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">No tienes permisos para ver esta página.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Obtener usuarios
  const supabase = getSupabaseServerClient()
  const { data: users } = await supabase.from("profiles").select("*").order("full_name", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">Gestión de usuarios del sistema</p>
        </div>

        {canCreateUsers && (
          <Link href="/dashboard/users/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Crear usuario
            </Button>
          </Link>
        )}
      </div>

      <DataTable columns={columns} data={users || []} />
    </div>
  )
}
