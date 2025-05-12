"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { AuditLogDetails } from "./audit-log-details"

// Definir el tipo para los datos de auditoría
interface AuditLog {
  id: string
  user_id: string | null
  action: string
  entity: string
  entity_id: string | null
  old_data: any | null
  new_data: any | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
  profiles?: {
    id: string
    full_name: string | null
    email: string | null
  } | null
}

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "created_at",
    header: "Fecha",
    cell: ({ row }) => {
      const date = new Date(row.original.created_at)
      return (
        <div className="whitespace-nowrap">
          <div>{date.toLocaleDateString()}</div>
          <div className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "action",
    header: "Acción",
    cell: ({ row }) => {
      const action = row.original.action
      let color = "bg-gray-100 text-gray-800"

      switch (action) {
        case "create":
          color = "bg-green-100 text-green-800"
          break
        case "update":
          color = "bg-blue-100 text-blue-800"
          break
        case "delete":
          color = "bg-red-100 text-red-800"
          break
        case "login":
          color = "bg-purple-100 text-purple-800"
          break
      }

      return (
        <Badge variant="outline" className={`capitalize ${color}`}>
          {action}
        </Badge>
      )
    },
  },
  {
    accessorKey: "entity",
    header: "Entidad",
    cell: ({ row }) => {
      return <div className="capitalize">{row.original.entity}</div>
    },
  },
  {
    accessorKey: "profiles.full_name",
    header: "Usuario",
    cell: ({ row }) => {
      const profile = row.original.profiles
      return (
        <div>
          <div>{profile?.full_name || "Sistema"}</div>
          {profile?.email && <div className="text-xs text-muted-foreground">{profile.email}</div>}
        </div>
      )
    },
  },
  {
    accessorKey: "ip_address",
    header: "Dirección IP",
    cell: ({ row }) => {
      return row.original.ip_address || "N/A"
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const log = row.original

      return <AuditLogDetails log={log} />
    },
  },
]
