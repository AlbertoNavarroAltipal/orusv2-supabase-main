"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal } from "lucide-react"
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

// Definir el tipo para los datos de usuario procesados
interface UserWithRoles {
  id: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
  department: string | null
  position: string | null
  roles: {
    id: string
    name: string
    description: string | null
  }[]
}

export const columns: ColumnDef<UserWithRoles>[] = [
  {
    accessorKey: "avatar_url",
    header: "",
    cell: ({ row }) => {
      const user = row.original
      const initials = user.full_name
        ? user.full_name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "U"

      return (
        <Avatar className="h-9 w-9">
          <AvatarImage src={user.avatar_url || ""} alt={user.full_name || "Usuario"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )
    },
  },
  {
    accessorKey: "full_name",
    header: "Nombre",
    cell: ({ row }) => {
      return (
        <div>
          <div className="font-medium">{row.original.full_name || "Sin nombre"}</div>
          <div className="text-sm text-muted-foreground">{row.original.email}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "department",
    header: "Departamento",
    cell: ({ row }) => {
      return row.original.department || "N/A"
    },
  },
  {
    accessorKey: "position",
    header: "Cargo",
    cell: ({ row }) => {
      return row.original.position || "N/A"
    },
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = row.original.roles

      if (!roles || roles.length === 0) return "Sin roles"

      return (
        <div className="flex flex-wrap gap-1">
          {roles.slice(0, 2).map((role) => (
            <Badge key={role.id} variant="outline" className="capitalize">
              {role.name}
            </Badge>
          ))}
          {roles.length > 2 && <Badge variant="outline">+{roles.length - 2}</Badge>}
        </div>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original
      const router = useRouter()
      const { hasPermission } = useClientPermission("update_users")
      const { hasPermission: canDeleteUser } = useClientPermission("delete_users")

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>Copiar ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/dashboard/iam/users/${user.id}`)}>
              Ver detalles
            </DropdownMenuItem>
            {hasPermission && (
              <DropdownMenuItem onClick={() => router.push(`/dashboard/iam/users/${user.id}?tab=profile`)}>
                Editar usuario
              </DropdownMenuItem>
            )}
            {hasPermission && (
              <DropdownMenuItem onClick={() => router.push(`/dashboard/iam/users/${user.id}?tab=roles`)}>
                Gestionar roles
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            {canDeleteUser && <DropdownMenuItem className="text-red-600">Eliminar usuario</DropdownMenuItem>}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
