"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Users, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useClientPermission } from "@/lib/auth/client-permissions"

// Definir el tipo para los datos de rol procesados
interface RoleWithCounts {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  userCount: number
  permissionCount: number
}

export const columns: ColumnDef<RoleWithCounts>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      return <div className="font-medium capitalize">{row.original.name}</div>
    },
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      return row.original.description || "Sin descripción"
    },
  },
  {
    accessorKey: "userCount",
    header: "Usuarios",
    cell: ({ row }) => {
      const count = row.original.userCount
      return (
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{count}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "permissionCount",
    header: "Permisos",
    cell: ({ row }) => {
      const count = row.original.permissionCount
      return (
        <div className="flex items-center">
          <ShieldCheck className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{count}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "updated_at",
    header: "Última actualización",
    cell: ({ row }) => {
      return new Date(row.original.updated_at).toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const role = row.original
      const router = useRouter()
      const { hasPermission } = useClientPermission("manage_roles")

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(role.id)}>Copiar ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/dashboard/iam/roles/${role.id}`)}>
              Ver detalles
            </DropdownMenuItem>
            {hasPermission && (
              <DropdownMenuItem onClick={() => router.push(`/dashboard/iam/roles/${role.id}?tab=permissions`)}>
                Gestionar permisos
              </DropdownMenuItem>
            )}
            {hasPermission && (
              <DropdownMenuItem onClick={() => router.push(`/dashboard/iam/roles/${role.id}?tab=users`)}>
                Ver usuarios
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {hasPermission && <DropdownMenuItem className="text-red-600">Eliminar rol</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
