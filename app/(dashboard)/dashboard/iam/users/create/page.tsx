import { hasPermission } from "@/lib/auth/auth-utils"
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { CreateUserForm } from "@/components/iam/users/create-user-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default async function CreateUserPage() {
  // Verificar permisos
  const canCreateUsers = await hasPermission("create_users")

  if (!canCreateUsers) {
    redirect("/dashboard/iam/users")
  }

  // Obtener roles para el formulario
  const supabase = getSupabaseServerClient()
  const { data: roles } = await supabase.from("roles").select("*").order("name", { ascending: true })

  return (
    <div className="space-y-6 mt-6">
      <div className="flex items-center">
        <Link href="/dashboard/iam/users">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Crear Usuario</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo Usuario</CardTitle>
          <CardDescription>Crea un nuevo usuario y asígnale roles</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateUserForm roles={roles || []} />
        </CardContent>
      </Card>
    </div>
  )
}
