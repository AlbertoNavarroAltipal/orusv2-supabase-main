"use client"

import { useState } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { columns } from "./columns"

// Datos de ejemplo para los permisos
const mockPermissions = [
  {
    id: "1",
    name: "users:read",
    description: "Permite ver usuarios",
    resource: "users",
    action: "read",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "users:create",
    description: "Permite crear usuarios",
    resource: "users",
    action: "create",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "roles:read",
    description: "Permite ver roles",
    resource: "roles",
    action: "read",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "roles:update",
    description: "Permite actualizar roles",
    resource: "roles",
    action: "update",
    createdAt: new Date().toISOString(),
  },
]

interface PermissionsDataTableProps {
  filters?: Record<string, any>
}

export function PermissionsDataTable({ filters = {} }: PermissionsDataTableProps) {
  const [permissions, setPermissions] = useState(mockPermissions)
  const [loading, setLoading] = useState(false)

  // Función para editar un permiso
  const handleEdit = (id: string) => {
    console.log(`Editar permiso ${id}`)
    // Aquí iría la lógica para editar un permiso
  }

  // Función para eliminar un permiso
  const handleDelete = (id: string) => {
    console.log(`Eliminar permiso ${id}`)
    // Aquí iría la lógica para eliminar un permiso
  }

  return (
    <Card className="w-full">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Permisos</h2>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo permiso
        </Button>
      </div>
      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id}>{column.header}</TableHead>
              ))}
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  Cargando permisos...
                </TableCell>
              </TableRow>
            ) : permissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  No se encontraron permisos
                </TableCell>
              </TableRow>
            ) : (
              permissions.map((permission) => (
                <TableRow key={permission.id}>
                  {columns.map((column) => (
                    <TableCell key={`${permission.id}-${column.id}`}>
                      {column.cell ? column.cell(permission) : permission[column.id as keyof typeof permission]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(permission.id)}>
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(permission.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
