"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AuditLogDetailsProps {
  log: {
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
}

export function AuditLogDetails({ log }: AuditLogDetailsProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Ver detalles</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Detalles del registro de auditoría</DialogTitle>
          <DialogDescription>Información completa del evento registrado</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">ID</h4>
              <p className="text-sm">{log.id}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Fecha</h4>
              <p className="text-sm">{new Date(log.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Acción</h4>
              <p className="text-sm capitalize">{log.action}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Entidad</h4>
              <p className="text-sm capitalize">{log.entity}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">ID de Entidad</h4>
              <p className="text-sm">{log.entity_id || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Usuario</h4>
              <p className="text-sm">{log.profiles?.full_name || "Sistema"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Dirección IP</h4>
              <p className="text-sm">{log.ip_address || "N/A"}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Agente de usuario</h4>
              <p className="text-sm truncate">{log.user_agent || "N/A"}</p>
            </div>
          </div>

          <Tabs defaultValue="changes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="changes">Cambios</TabsTrigger>
              <TabsTrigger value="raw">Datos completos</TabsTrigger>
            </TabsList>
            <TabsContent value="changes" className="mt-4">
              <div className="space-y-4">
                {log.old_data && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Datos anteriores</h4>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      <pre className="text-xs">{JSON.stringify(log.old_data, null, 2)}</pre>
                    </ScrollArea>
                  </div>
                )}
                {log.new_data && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Datos nuevos</h4>
                    <ScrollArea className="h-[200px] rounded-md border p-4">
                      <pre className="text-xs">{JSON.stringify(log.new_data, null, 2)}</pre>
                    </ScrollArea>
                  </div>
                )}
                {!log.old_data && !log.new_data && (
                  <p className="text-sm text-muted-foreground">No hay datos de cambios disponibles</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="raw" className="mt-4">
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <pre className="text-xs">{JSON.stringify(log, null, 2)}</pre>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
