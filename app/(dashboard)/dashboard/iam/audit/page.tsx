import { getSupabaseServerClient } from "@/lib/supabase/server"
import { hasPermission } from "@/lib/auth/auth-utils"
import { redirect } from "next/navigation"
import { AuditLogsDataTable } from "@/components/iam/audit/audit-logs-data-table"
import { columns } from "@/components/iam/audit/columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuditLogFilters } from "@/components/iam/audit/audit-log-filters"

export default async function AuditPage() {
  // Verificar permisos
  const canViewAudit = await hasPermission("view_audit")

  if (!canViewAudit) {
    redirect("/dashboard")
  }

  // Obtener logs de auditoría (limitados a los últimos 100 para rendimiento)
  const supabase = getSupabaseServerClient()
  const { data: auditLogs, error } = await supabase
    .from("audit_logs")
    .select(`
      *,
      profiles (
        id,
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    console.error("Error al obtener logs de auditoría:", error)
  }

  // Obtener entidades únicas para filtros
  const entities = [...new Set(auditLogs?.map((log) => log.entity) || [])]

  // Obtener acciones únicas para filtros
  const actions = [...new Set(auditLogs?.map((log) => log.action) || [])]

  return (
    <div className="space-y-6 mt-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Auditoría</h2>
        <p className="text-muted-foreground">Revisa el historial de actividades y cambios en el sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtra los registros de auditoría por diferentes criterios</CardDescription>
        </CardHeader>
        <CardContent>
          <AuditLogFilters entities={entities} actions={actions} />
        </CardContent>
      </Card>

      <AuditLogsDataTable columns={columns} data={auditLogs || []} />
    </div>
  )
}
