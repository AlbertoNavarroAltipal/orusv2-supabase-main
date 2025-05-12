"use client"

import { useState } from "react"
import { MessageSquare, MoreHorizontal, Search, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Tipo para las conversaciones
interface Conversation {
  id: string
  user: {
    id: string
    name: string
    avatar?: string
    status: "online" | "offline" | "away" | "busy"
  }
  lastMessage: {
    text: string
    time: string
    read: boolean
    sender: "me" | "them"
  }
  unreadCount: number
}

export function ChatDropdown() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeChat, setActiveChat] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  // Estado para las conversaciones (simulado)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      user: {
        id: "u1",
        name: "María López",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
        status: "online",
      },
      lastMessage: {
        text: "¿Podemos revisar el informe mañana?",
        time: "10:30",
        read: false,
        sender: "them",
      },
      unreadCount: 2,
    },
    {
      id: "2",
      user: {
        id: "u2",
        name: "Carlos Rodríguez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carlos",
        status: "away",
      },
      lastMessage: {
        text: "Te envié los documentos por correo",
        time: "Ayer",
        read: true,
        sender: "me",
      },
      unreadCount: 0,
    },
    {
      id: "3",
      user: {
        id: "u3",
        name: "Ana Martínez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ana",
        status: "busy",
      },
      lastMessage: {
        text: "Necesito tu ayuda con el proyecto",
        time: "Ayer",
        read: false,
        sender: "them",
      },
      unreadCount: 1,
    },
    {
      id: "4",
      user: {
        id: "u4",
        name: "Juan Pérez",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=juan",
        status: "offline",
      },
      lastMessage: {
        text: "Gracias por la información",
        time: "Lun",
        read: true,
        sender: "them",
      },
      unreadCount: 0,
    },
    {
      id: "5",
      user: {
        id: "u5",
        name: "Laura Sánchez",
        status: "online",
      },
      lastMessage: {
        text: "¿Cuándo es la próxima reunión?",
        time: "Dom",
        read: true,
        sender: "me",
      },
      unreadCount: 0,
    },
  ])

  // Filtrar conversaciones por búsqueda
  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Obtener el total de mensajes no leídos
  const totalUnread = conversations.reduce((total, conversation) => total + conversation.unreadCount, 0)

  // Marcar una conversación como leída
  const markAsRead = (id: string) => {
    setConversations(
      conversations.map((conversation) =>
        conversation.id === id
          ? {
              ...conversation,
              lastMessage: { ...conversation.lastMessage, read: true },
              unreadCount: 0,
            }
          : conversation,
      ),
    )
  }

  // Enviar un nuevo mensaje
  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return

    setConversations(
      conversations.map((conversation) =>
        conversation.id === activeChat
          ? {
              ...conversation,
              lastMessage: {
                text: newMessage,
                time: "Ahora",
                read: true,
                sender: "me",
              },
            }
          : conversation,
      ),
    )

    setNewMessage("")
    toast({
      description: "Mensaje enviado",
    })
  }

  // Obtener el color del estado
  const getStatusColor = (status: Conversation["user"]["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-amber-500"
      case "busy":
        return "bg-red-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  // Obtener el texto del estado
  const getStatusText = (status: Conversation["user"]["status"]) => {
    switch (status) {
      case "online":
        return "En línea"
      case "away":
        return "Ausente"
      case "busy":
        return "Ocupado"
      case "offline":
        return "Desconectado"
      default:
        return "Desconectado"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/10 rounded-full">
          <MessageSquare className="h-5 w-5" />
          {totalUnread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {totalUnread}
            </Badge>
          )}
          <span className="sr-only">Ver mensajes</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[350px] p-0 mr-2 mt-1" align="end">
        <Tabs defaultValue={activeChat ? "chat" : "conversations"} className="w-full">
          <div className="flex items-center justify-between p-4 bg-primary-50">
            <DropdownMenuLabel className="text-base p-0 text-primary-900">Mensajes</DropdownMenuLabel>
            <TabsList className="grid w-auto grid-cols-2 h-8">
              <TabsTrigger value="conversations" onClick={() => setActiveChat(null)}>
                Chats
              </TabsTrigger>
              <TabsTrigger value="chat" disabled={!activeChat}>
                Mensaje
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="conversations" className="m-0">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar conversaciones..."
                  className="pl-9 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="h-[350px]">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[200px] text-center p-4">
                  <div className="bg-primary-100 p-3 rounded-full mb-3">
                    <MessageSquare className="h-6 w-6 text-primary-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">No se encontraron conversaciones</p>
                  <p className="text-sm text-muted-foreground mt-1">Intenta con otra búsqueda</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredConversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      onSelect={() => {
                        setActiveChat(conversation.id)
                        markAsRead(conversation.id)
                      }}
                      statusColor={getStatusColor(conversation.user.status)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="chat" className="m-0">
            {activeChat && (
              <div className="flex flex-col h-[400px]">
                <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      {conversations.find((c) => c.id === activeChat)?.user.avatar ? (
                        <AvatarImage
                          src={conversations.find((c) => c.id === activeChat)?.user.avatar || "/placeholder.svg"}
                          alt={conversations.find((c) => c.id === activeChat)?.user.name}
                        />
                      ) : null}
                      <AvatarFallback>
                        {conversations.find((c) => c.id === activeChat)?.user.name.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{conversations.find((c) => c.id === activeChat)?.user.name}</p>
                      <div className="flex items-center">
                        <span
                          className={`h-2 w-2 rounded-full mr-1.5 ${getStatusColor(
                            conversations.find((c) => c.id === activeChat)?.user.status || "offline",
                          )}`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {getStatusText(conversations.find((c) => c.id === activeChat)?.user.status || "offline")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setActiveChat(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <ScrollArea className="flex-1 p-3">
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="bg-primary-100 p-4 rounded-full mb-4">
                      <MessageSquare className="h-8 w-8 text-primary-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      Conversación con {conversations.find((c) => c.id === activeChat)?.user.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
                      Aquí aparecerán los mensajes de la conversación. Esta es una versión simplificada para la
                      demostración.
                    </p>
                  </div>
                </ScrollArea>

                <div className="p-3 border-t bg-gray-50">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Escribe un mensaje..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          sendMessage()
                        }
                      }}
                      className="h-9"
                    />
                    <Button size="sm" onClick={sendMessage} disabled={!newMessage.trim()} className="h-9 px-3">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="p-2 bg-gray-50 border-t">
          <Button variant="ghost" className="w-full justify-center text-sm h-9 text-primary-700">
            Ver todos los mensajes
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface ConversationItemProps {
  conversation: Conversation
  onSelect: () => void
  statusColor: string
}

function ConversationItem({ conversation, onSelect, statusColor }: ConversationItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-colors",
        conversation.unreadCount > 0 ? "bg-primary-50 hover:bg-primary-100" : "hover:bg-gray-100",
      )}
      onClick={onSelect}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          {conversation.user.avatar ? (
            <AvatarImage src={conversation.user.avatar || "/placeholder.svg"} alt={conversation.user.name} />
          ) : null}
          <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${statusColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <p className={cn("text-sm truncate", conversation.unreadCount > 0 ? "font-medium" : "")}>
            {conversation.user.name}
          </p>
          <p className="text-xs text-muted-foreground whitespace-nowrap">{conversation.lastMessage.time}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground truncate">
            {conversation.lastMessage.sender === "me" ? "Tú: " : ""}
            {conversation.lastMessage.text}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
