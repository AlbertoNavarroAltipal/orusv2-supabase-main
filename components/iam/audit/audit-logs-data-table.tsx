"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { columns } from "./columns"

// Datos de ejemplo para los registros de auditoría
const mockAuditLogs = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    user: "admin@example.com",
    action: "login",
    resource: "auth",
    details: "Usuario inició sesión",
    ip: "192.168.1.1",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: "admin@example.com",
    action: "create",
    resource: "users",
    details: "Usuario creado: john.doe@example.com",
    ip: "192.168.1.1",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    user: "admin@example.com",
    action: "update",
    resource: "roles",
    details: "Rol actualizado: Editor",
    ip: "192.168.1.1",
  },
]

interface AuditLogsDataTableProps {
  filters?: Record<string, any>
}

export function AuditLogsDataTable({ filters = {} }: AuditLogsDataTableProps) {
  const router = useRouter()
  const [auditLogs, setAuditLogs] = useState(mockAuditLogs)
  const [loading, setLoading] = useState(false)

  // Función para ver detalles de un registro de auditoría
  const handleViewDetails = (id: string) => {
    // Aquí iría la lógica para mostrar detalles, por ejemplo:
    console.log(`Ver detalles del registro ${id}`)
    // Podría abrir un modal o navegar a una página de detalles
  }

  return (
    <Card className="w-full">
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
                  Cargando registros...
                </TableCell>
              </TableRow>
            ) : auditLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center">
                  No se encontraron registros de auditoría
                </TableCell>
              </TableRow>
            ) : (
              auditLogs.map((log) => (
                <TableRow key={log.id}>
                  {columns.map((column) => (
                    <TableCell key={`${log.id}-${column.id}`}>
                      {column.cell ? column.cell(log) : log[column.id as keyof typeof log]}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(log.id)}>
                      Ver detalles
                    </Button>
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
