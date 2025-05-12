"use client"

import { useState } from "react"
import { Bell, Check, MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Tipo para las notificaciones
interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
  sender?: {
    name: string
    avatar?: string
  }
}

export function NotificationsDropdown() {
  const { toast } = useToast()
  // Estado para las notificaciones (simulado)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Nueva tarea asignada",
      message: "Se te ha asignado la tarea 'Revisar inventario'",
      time: "Hace 5 minutos",
      read: false,
      type: "info",
      sender: {
        name: "Sistema",
      },
    },
    {
      id: "2",
      title: "Recordatorio de reunión",
      message: "Reunión de equipo en 30 minutos",
      time: "Hace 20 minutos",
      read: false,
      type: "warning",
      sender: {
        name: "Calendario",
      },
    },
    {
      id: "3",
      title: "Actualización completada",
      message: "La actualización del sistema se ha completado correctamente",
      time: "Hace 1 hora",
      read: true,
      type: "success",
      sender: {
        name: "Sistema",
      },
    },
    {
      id: "4",
      title: "Comentario en documento",
      message: "Juan Pérez ha comentado en el documento 'Informe Q2'",
      time: "Hace 2 horas",
      read: true,
      type: "info",
      sender: {
        name: "Juan Pérez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juan",
      },
    },
    {
      id: "5",
      title: "Error en sincronización",
      message: "Ha ocurrido un error al sincronizar los datos con el servidor",
      time: "Hace 3 horas",
      read: true,
      type: "error",
      sender: {
        name: "Sistema",
      },
    },
  ])

  // Filtrar notificaciones no leídas
  const unreadNotifications = notifications.filter((notification) => !notification.read)
  const unreadCount = unreadNotifications.length

  // Marcar una notificación como leída
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
    toast({
      description: "Notificación marcada como leída",
    })
  }

  // Marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    )
    toast({
      description: "Todas las notificaciones marcadas como leídas",
    })
  }

  // Eliminar una notificación
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
    toast({
      description: "Notificación eliminada",
    })
  }

  // Eliminar todas las notificaciones
  const deleteAllNotifications = () => {
    setNotifications([])
    toast({
      description: "Todas las notificaciones han sido eliminadas",
    })
  }

  // Obtener el color de fondo según el tipo de notificación
  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
      case "warning":
        return "bg-amber-100 text-amber-800 border-l-4 border-amber-500"
      case "success":
        return "bg-green-100 text-green-800 border-l-4 border-green-500"
      case "error":
        return "bg-red-100 text-red-800 border-l-4 border-red-500"
      default:
        return "bg-gray-100 text-gray-800 border-l-4 border-gray-500"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
          <span className="sr-only">Ver notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[350px] p-0 mr-2 mt-1" align="end">
        <div className="flex items-center justify-between p-4 bg-primary-50">
          <DropdownMenuLabel className="text-base p-0 text-primary-900">Notificaciones</DropdownMenuLabel>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="h-8 w-8 text-primary-700 hover:bg-primary-100 hover:text-primary-900"
            >
              <Check className="h-4 w-4" />
              <span className="sr-only">Marcar todas como leídas</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={deleteAllNotifications}
              disabled={notifications.length === 0}
              className="h-8 w-8 text-primary-700 hover:bg-primary-100 hover:text-primary-900"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar todas</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-2">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="all">Todas ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">No leídas ({unreadCount})</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-2">
            <ScrollArea className="h-[350px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                  <div className="bg-primary-100 p-3 rounded-full mb-3">
                    <Bell className="h-6 w-6 text-primary-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">No tienes notificaciones</p>
                  <p className="text-sm text-muted-foreground mt-1">Las notificaciones aparecerán aquí</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      bgColor={getNotificationColor(notification.type)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="mt-2">
            <ScrollArea className="h-[350px]">
              {unreadNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                  <div className="bg-green-100 p-3 rounded-full mb-3">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">No tienes notificaciones sin leer</p>
                  <p className="text-sm text-muted-foreground mt-1">¡Estás al día!</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {unreadNotifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={markAsRead}
                      onDelete={deleteNotification}
                      bgColor={getNotificationColor(notification.type)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="p-2 bg-gray-50 border-t">
          <Button variant="ghost" className="w-full justify-center text-sm h-9 text-primary-700">
            Ver todas las notificaciones
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  bgColor: string
}

function NotificationItem({ notification, onMarkAsRead, onDelete, bgColor }: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-md transition-colors",
        notification.read ? "bg-background hover:bg-gray-50" : bgColor,
      )}
    >
      <Avatar className="h-9 w-9 mt-0.5">
        {notification.sender?.avatar ? (
          <AvatarImage src={notification.sender.avatar || "/placeholder.svg"} alt={notification.sender.name} />
        ) : null}
        <AvatarFallback className={cn(notification.read ? "bg-gray-200" : "bg-white/90")}>
          {notification.sender?.name.charAt(0) || "S"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium leading-none">{notification.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                <MoreHorizontal className="h-3.5 w-3.5" />
                <span className="sr-only">Más opciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {!notification.read && (
                <DropdownMenuItem onClick={() => onMarkAsRead(notification.id)}>
                  <Check className="mr-2 h-4 w-4" />
                  <span>Marcar como leída</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(notification.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Eliminar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs leading-relaxed">{notification.message}</p>
      </div>
    </div>
  )
}
