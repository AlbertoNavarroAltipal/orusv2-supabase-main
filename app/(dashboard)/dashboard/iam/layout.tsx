import type React from "react"
import { hasPermission } from "@/lib/auth/auth-utils"
import { redirect } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default async function IAMLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Verificar permisos para acceder al módulo IAM
  const canViewIAM = await hasPermission("view_iam")

  if (!canViewIAM) {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Identidades y Accesos</h1>
        <p className="text-muted-foreground">Administra usuarios, roles, permisos y auditorías de seguridad</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4">
          <Link href="/dashboard/iam/users">
            <TabsTrigger value="users" className="w-full">
              Usuarios
            </TabsTrigger>
          </Link>
          <Link href="/dashboard/iam/roles">
            <TabsTrigger value="roles" className="w-full">
              Roles
            </TabsTrigger>
          </Link>
          <Link href="/dashboard/iam/permissions">
            <TabsTrigger value="permissions" className="w-full">
              Permisos
            </TabsTrigger>
          </Link>
          <Link href="/dashboard/iam/audit">
            <TabsTrigger value="audit" className="w-full">
              Auditoría
            </TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}
