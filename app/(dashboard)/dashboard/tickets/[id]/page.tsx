"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PageSubheader from "@/components/dashboard/page-subheader"; // Importar el nuevo componente
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit3,
  MessageSquare,
  CheckCircle,
  Clock,
  User,
  Tag,
  Layers,
  Phone,
  Mail,
  Paperclip,
  Send,
  Settings2,
  ListChecks,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast"; 

interface TicketHistoryEntry {
  type:
    | "comment"
    | "status_change"
    | "priority_change"
    | "assignment"
    | "resolution";
  content: string;
  user: string;
  date: string;
  oldValue?: string;
  newValue?: string;
}
interface TicketAttachment {
  name: string;
  url: string;
  size: string;
}
interface CustomField {
  label: string;
  value: string | number | boolean;
}
interface Ticket {
  id: string;
  subject: string;
  description?: string;
  status: "Abierto" | "En Progreso" | "En Espera" | "Resuelto" | "Cerrado";
  statusInitials: string;
  category: string;
  channel: string;
  age?: string; 
  responses: number;
  lastUpdate: string;
  userType: string;
  userName?: string;
  userEmail?: string;
  priority: "Alta" | "Media" | "Baja" | "Urgente";
  assignedTo?: string;
  createdBy?: string;
  createdAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  resolutionSummary?: string;
  productAffected?: string;
  history: TicketHistoryEntry[];
  attachments?: TicketAttachment[];
  customFields?: CustomField[];
  relatedTasks?: Array<{ id: string; title: string; completed: boolean }>;
}

let allSampleTickets: Ticket[] = [
  {
    id: "ALT-001",
    subject: "Problema de acceso a la plataforma ORUS",
    description:
      "Desde esta mañana no puedo acceder a la plataforma ORUS. Ingreso mis credenciales y me aparece un error 'Usuario o contraseña incorrectos', pero estoy seguro de que son los correctos. Necesito acceder urgentemente para revisar mis pedidos. Adjunto captura de pantalla del error.",
    status: "Abierto",
    statusInitials: "PA",
    category: "Soporte Técnico",
    channel: "Portal Web",
    responses: 0,
    lastUpdate: "13 May 2025 10:00 AM",
    userType: "Empleado Ventas",
    userName: "Carlos Vargas",
    userEmail: "cvargas@altipal.com.co",
    priority: "Urgente",
    createdBy: "currentUser",
    createdAt: "13 May 2025 10:00 AM",
    productAffected: "Plataforma ORUS v2.3",
    history: [
      {
        type: "comment",
        content: "Ticket creado por el usuario.",
        user: "Carlos Vargas",
        date: "13 May 2025 10:00 AM",
      },
    ],
    attachments: [{ name: "error_login.png", url: "#", size: "128KB" }],
    customFields: [
      { label: "ID de Empleado", value: "EMP-7890" },
      { label: "Sede", value: "Bogotá - Principal" },
    ],
    relatedTasks: [
      {
        id: "task1",
        title: "Verificar logs de autenticación",
        completed: false,
      },
      {
        id: "task2",
        title: "Contactar a Carlos para prueba remota",
        completed: false,
      },
    ],
  },
  {
    id: "ALT-002",
    subject: "Error al generar reporte de ventas mensual",
    description:
      "Al intentar generar el reporte de ventas consolidado del mes de Abril desde el módulo de Business Intelligence, el sistema arroja un error 'TimeoutException' después de unos minutos. Este reporte es crucial para la reunión de gerencia de mañana.",
    status: "En Progreso",
    statusInitials: "EP",
    category: "Aplicaciones Internas",
    channel: "Email",
    responses: 2,
    lastUpdate: "13 May 2025 03:30 PM",
    userType: "Gerente Regional",
    userName: "Lucía Méndez",
    userEmail: "lmendez@altipal.com.co",
    priority: "Alta",
    assignedTo: "Soporte N2",
    createdAt: "12 May 2025 09:15 AM",
    productAffected: "Módulo BI - Reporte Ventas Consolidadas",
    history: [
      {
        type: "comment",
        content: "Ticket creado vía email.",
        user: "Sistema",
        date: "12 May 2025 09:15 AM",
      },
      {
        type: "assignment",
        content: "Ticket asignado a Soporte N2.",
        user: "Sistema Dispatcher",
        date: "12 May 2025 09:30 AM",
      },
      {
        type: "comment",
        content:
          "Estamos revisando los logs del servidor de BI. Parece un problema de rendimiento con la consulta.",
        user: "Soporte N2",
        date: "12 May 2025 03:30 PM",
      },
    ],
    customFields: [
      { label: "Tipo de Reporte", value: "Ventas Consolidadas Mes Anterior" },
    ],
  },
  {
    id: "ALT-003",
    subject: "Consulta sobre nueva política de vacaciones",
    description:
      "Me gustaría aclarar algunos puntos sobre la nueva política de vacaciones comunicada ayer, específicamente sobre los días acumulables.",
    status: "Cerrado",
    statusInitials: "RH",
    category: "Recursos Humanos",
    channel: "Llamada Telefónica",
    responses: 1,
    lastUpdate: "10 May 2025 11:00 AM",
    userType: "Empleado Logística",
    userName: "Ana Molina",
    userEmail: "amolina@altipal.com.co",
    priority: "Baja",
    assignedTo: "Gestión Humana",
    createdAt: "10 May 2025 10:30 AM",
    closedAt: "10 May 2025 11:00 AM",
    resolutionSummary:
      "Se aclararon las dudas de la colaboradora Ana Molina sobre la política de vacaciones. Se confirmó que puede acumular hasta X días y se le envió el documento oficial actualizado.",
    history: [
      {
        type: "comment",
        content: "Llamada recibida y consulta registrada.",
        user: "Gestión Humana",
        date: "10 May 2025 10:30 AM",
      },
      {
        type: "resolution",
        content: "Dudas aclaradas y caso cerrado.",
        user: "Gestión Humana",
        date: "10 May 2025 11:00 AM",
      },
    ],
  },
];

const getStatusBadgeClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case "abierto": return "bg-red-100 text-red-700 border-red-300";
    case "en progreso": return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "cerrado": return "bg-primary-100 text-primary-600 border-primary-300";
    default: return "bg-gray-100 text-gray-700 border-gray-300";
  }
};
const getPriorityBadgeClasses = (
  priority?: "Alta" | "Media" | "Baja" | "Urgente"
) => {
  switch (priority) {
    case "Urgente": return "bg-red-600 text-white";
    case "Alta": return "bg-red-500 text-white";
    case "Media": return "bg-yellow-500 text-black";
    case "Baja": return "bg-green-500 text-white";
    default: return "bg-gray-500 text-white";
  }
};

const statusOptions: Ticket["status"][] = [
  "Abierto",
  "En Progreso",
  "En Espera",
  "Resuelto",
  "Cerrado",
];
const priorityOptions: Ticket["priority"][] = [
  "Baja",
  "Media",
  "Alta",
  "Urgente",
];

const TicketDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | undefined>(() =>
    allSampleTickets.find((t) => t.id === ticketId)
  );
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const currentTicket = allSampleTickets.find((t) => t.id === ticketId);
    setTicket(currentTicket);
  }, [ticketId]);

  const handleStatusChange = (newStatus: Ticket["status"]) => {
    if (ticket) {
      const oldStatus = ticket.status;
      const historyEntry: TicketHistoryEntry = {
        type: "status_change" as TicketHistoryEntry['type'],
        content: `Estado cambiado de ${oldStatus} a ${newStatus}.`,
        user: "Usuario Actual (Simulado)",
        date: new Date().toLocaleString("es-CO"),
        oldValue: oldStatus,
        newValue: newStatus,
      };
      const updatedTicket: Ticket = {
        ...ticket,
        status: newStatus,
        lastUpdate: new Date().toLocaleString("es-CO"),
        history: [...ticket.history, historyEntry],
        closedAt: (newStatus === "Cerrado" || newStatus === "Resuelto") ? new Date().toLocaleString("es-CO") : ticket.closedAt,
        resolutionSummary: (newStatus === "Resuelto" && !ticket.resolutionSummary) ? "Ticket resuelto por el agente." : ticket.resolutionSummary,
      };
      setTicket(updatedTicket);
      const ticketIndex = allSampleTickets.findIndex((t) => t.id === ticket.id);
      if (ticketIndex !== -1) allSampleTickets[ticketIndex] = updatedTicket;
      toast({
        title: "Estado Actualizado",
        description: `El ticket ahora está ${newStatus}.`,
      });
    }
  };

  const handlePriorityChange = (newPriority: Ticket["priority"]) => {
    if (ticket) {
      const oldPriority = ticket.priority;
      const historyEntry: TicketHistoryEntry = {
        type: "priority_change" as TicketHistoryEntry['type'],
        content: `Prioridad cambiada de ${oldPriority} a ${newPriority}.`,
        user: "Usuario Actual (Simulado)",
        date: new Date().toLocaleString("es-CO"),
        oldValue: oldPriority,
        newValue: newPriority,
      };
      const updatedTicket: Ticket = {
        ...ticket,
        priority: newPriority,
        lastUpdate: new Date().toLocaleString("es-CO"),
        history: [...ticket.history, historyEntry],
      };
      setTicket(updatedTicket);
      const ticketIndex = allSampleTickets.findIndex((t) => t.id === ticket.id);
      if (ticketIndex !== -1) allSampleTickets[ticketIndex] = updatedTicket;
      toast({
        title: "Prioridad Actualizada",
        description: `La prioridad del ticket es ahora ${newPriority}.`,
      });
    }
  };

  const handleAddComment = () => {
    if (ticket && newComment.trim() !== "") {
      const historyEntry: TicketHistoryEntry = {
        type: "comment" as TicketHistoryEntry['type'],
        content: newComment,
        user: "Usuario Actual (Simulado)",
        date: new Date().toLocaleString("es-CO"),
      };
      const updatedTicket: Ticket = {
        ...ticket,
        responses: ticket.responses + 1,
        lastUpdate: new Date().toLocaleString("es-CO"),
        history: [...ticket.history, historyEntry],
      };
      setTicket(updatedTicket);
      const ticketIndex = allSampleTickets.findIndex((t) => t.id === ticket.id);
      if (ticketIndex !== -1) allSampleTickets[ticketIndex] = updatedTicket;
      setNewComment("");
      toast({ title: "Comentario Añadido" });
    }
  };

  if (!ticket) {
    return (
      <div className="container mx-auto p-8 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700">
          Ticket no encontrado
        </h1>
        <p className="text-gray-500 mt-2">
          El ticket con ID '{ticketId}' no existe o no se pudo cargar.
        </p>
        <Button
          onClick={() => router.back()}
          className="mt-6 bg-primary-500 hover:bg-primary-600 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
      </div>
    );
  }

  return (
    <>
      <PageSubheader title={`Detalle del Ticket: ${ticket.id}`}>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/tickets")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a la lista
        </Button>
      </PageSubheader>
      <main className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
        <Card className="mb-6 shadow-lg">
          <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-primary-600">
                {ticket.subject}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 mt-1">
                ID: {ticket.id}{" "}
                {ticket.productAffected &&
                  `| Producto: ${ticket.productAffected}`}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <Select
                value={ticket.priority}
                onValueChange={handlePriorityChange}
              >
                <SelectTrigger
                  className={`w-[120px] text-xs h-8 ${getPriorityBadgeClasses(
                    ticket.priority
                  )} border-0 font-semibold`}
                >
                  <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((p) => (
                    <SelectItem key={p} value={p} className="text-xs">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={ticket.status} onValueChange={handleStatusChange}>
                <SelectTrigger
                  className={`w-[130px] text-xs h-8 ${getStatusBadgeClasses(
                    ticket.status
                  )} border-0 font-semibold`}
                >
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Edit3 className="mr-2 h-4 w-4" /> Editar Ticket
            </Button>
            {ticket.status.toLowerCase() !== "cerrado" &&
              ticket.status.toLowerCase() !== "resuelto" && (
                <Button
                  onClick={() => handleStatusChange("Cerrado")}
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-500 hover:bg-green-50"
                >
                  <CheckCircle className="mr-2 h-4 w-4" /> Marcar como Cerrado
                </Button>
              )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg text-primary-700">
                Descripción Detallada
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 whitespace-pre-wrap prose prose-sm max-w-none">
              {ticket.description ||
                "No se proporcionó una descripción detallada."}
            </CardContent>
          </Card>

          {(ticket.status === "Cerrado" || ticket.status === "Resuelto") && ticket.resolutionSummary && (
              <Card className="shadow-md bg-green-50 border-green-200">
                <CardHeader><CardTitle className="text-lg text-green-700">Resumen de Resolución</CardTitle></CardHeader>
                <CardContent className="text-green-800 whitespace-pre-wrap prose prose-sm max-w-none">
                  {ticket.resolutionSummary}
                  {ticket.closedAt && <p className="text-xs mt-2">Cerrado el: {ticket.closedAt}</p>}
                </CardContent>
              </Card>
            )}

          <Card className="shadow-md">
            <CardHeader><CardTitle className="text-lg text-primary-700">Historial y Comentarios ({ticket.responses})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {ticket.history && ticket.history.slice().reverse().map((entry, index) => (
                  <div key={index} className={`p-3 rounded-md border ${entry.type === 'comment' && entry.user.includes('Actual') ? 'bg-primary-50 border-primary-200' : 'bg-gray-50 border-gray-200'}`}>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{entry.content}</p>
                    <div className="text-xs text-gray-500 mt-1"> {/* Cambiado de <p> a <div> */}
                      Por: <strong>{entry.user}</strong> - {entry.date}
                      {entry.type === 'status_change' && <Badge variant="outline" className="ml-2 text-xs">Estado: {entry.oldValue} → {entry.newValue}</Badge>}
                      {entry.type === 'priority_change' && <Badge variant="outline" className="ml-2 text-xs">Prioridad: {entry.oldValue} → {entry.newValue}</Badge>}
                      {entry.type === 'assignment' && <Badge variant="outline" className="ml-2 text-xs">Asignación</Badge>}
                      {entry.type === 'resolution' && <Badge variant="default" className="ml-2 text-xs bg-green-100 text-green-700">Resolución</Badge>}
                    </div>
                  </div>
                ))}
                {(!ticket.history || ticket.history.length === 0) && <p className="text-sm text-gray-500">No hay historial para este ticket.</p>}
              </div>
              <Separator className="my-6" />
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Añadir Comentario/Respuesta</h4>
                <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escribe tu comentario o respuesta aquí..." className="mb-2 min-h-[100px]" />
                <div className="flex justify-end">
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}><Send className="mr-2 h-4 w-4" /> Enviar</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-md">
            <CardHeader><CardTitle className="text-lg text-primary-700">Detalles del Ticket</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center"><User className="mr-2 h-4 w-4 text-primary-500" /><strong>Asignado a:</strong> <span className="ml-auto font-medium">{ticket.assignedTo || 'Sin asignar'}</span></div>
              <div className="flex items-center"><Tag className="mr-2 h-4 w-4 text-primary-500" /><strong>Categoría:</strong> <span className="ml-auto">{ticket.category}</span></div>
              <div className="flex items-center"><Layers className="mr-2 h-4 w-4 text-primary-500" /><strong>Canal:</strong> <span className="ml-auto">{ticket.channel}</span></div>
              <div className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary-500" /><strong>Creado:</strong> <span className="ml-auto">{ticket.createdAt || 'N/A'}</span></div>
              <div className="flex items-center"><Clock className="mr-2 h-4 w-4 text-primary-500" /><strong>Última Act.:</strong> <span className="ml-auto">{ticket.lastUpdate}</span></div>
              {ticket.productAffected && <div className="flex items-center"><Settings2 className="mr-2 h-4 w-4 text-primary-500" /><strong>Producto:</strong> <span className="ml-auto">{ticket.productAffected}</span></div>}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader><CardTitle className="text-lg text-primary-700">Información del Solicitante</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3"><AvatarImage src={`https://ui-avatars.com/api/?name=${ticket.userName?.replace(/\s+/g, '+')}&background=002551&color=fff`} /><AvatarFallback>{ticket.userName?.split(' ').map(n=>n[0]).join('') || 'U'}</AvatarFallback></Avatar>
                <div><p className="font-semibold">{ticket.userName || 'N/A'}</p><p className="text-gray-500">{ticket.userType}</p></div>
              </div>
              {ticket.userEmail && <div className="flex items-center pt-1"><Mail className="mr-2 h-4 w-4 text-primary-500" /><a href={`mailto:${ticket.userEmail}`} className="text-primary-600 hover:underline">{ticket.userEmail}</a></div>}
            </CardContent>
          </Card>
          
          {ticket.customFields && ticket.customFields.length > 0 && (
            <Card className="shadow-md">
              <CardHeader><CardTitle className="text-lg text-primary-700">Información Adicional</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {ticket.customFields.map(field => (
                  <div key={field.label} className="flex justify-between"><strong>{field.label}:</strong> <span>{String(field.value)}</span></div>
                ))}
              </CardContent>
            </Card>
          )}

          {ticket.attachments && ticket.attachments.length > 0 && (
             <Card className="shadow-md">
               <CardHeader><CardTitle className="text-lg text-primary-700">Archivos Adjuntos</CardTitle></CardHeader>
               <CardContent>
                 <ul className="space-y-2">
                   {ticket.attachments.map((file, index) => (
                     <li key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded hover:bg-gray-100">
                       <a href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary-600 hover:underline">
                         <Paperclip className="mr-2 h-4 w-4" /> {file.name}
                       </a>
                       <span className="text-xs text-gray-500">{file.size}</span>
                     </li>
                   ))}
                 </ul>
               </CardContent>
             </Card>
           )}
          
          <Card className="shadow-md">
            <CardHeader><CardTitle className="text-lg text-primary-700">Tareas Relacionadas</CardTitle></CardHeader>
            <CardContent>
              {ticket.relatedTasks && ticket.relatedTasks.length > 0 ? (
                <ul className="space-y-2">
                  {ticket.relatedTasks.map(task => (
                    <li key={task.id} className={`text-sm flex items-center ${task.completed ? 'line-through text-gray-500' : ''}`}>
                      <input type="checkbox" checked={task.completed} readOnly className="mr-2 accent-primary-500" /> {task.title}
                    </li>
                  ))}
                </ul>
              ) : <p className="text-sm text-gray-500">No hay tareas relacionadas.</p>}
               <Button variant="outline" size="sm" className="mt-3 w-full">Añadir Tarea</Button>
            </CardContent>
          </Card>

        </div>
      </main>
    </>
  );
};

export default TicketDetailPage;
