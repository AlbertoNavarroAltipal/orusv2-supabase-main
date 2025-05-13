"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; // Importar Link
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Globe, Folder, Clock, MessageSquare, PlusCircle, Filter as FilterIcon } from "lucide-react";

// Definición del tipo para un Ticket
interface Ticket {
  id: string;
  subject: string;
  status: string;
  statusInitials: string;
  category: string;
  channel: string;
  age: string;
  responses: number;
  lastUpdate: string;
  userType: string; // Ejemplo: "Empleado Ventas", "Gerente Regional"
  priority?: "Alta" | "Media" | "Baja"; // Añadir prioridad opcional
  assignedTo?: string; // Quién está asignado
  createdBy?: string; // Quién lo creó (para "Mis Tickets")
}

// Datos de ejemplo para los tickets - Contenido corporativo Altipal SAS
const allSampleTickets: Ticket[] = [
  {
    id: "ALT-001",
    subject: "Problema de acceso a la plataforma ORUS",
    status: "Abierto",
    statusInitials: "PA",
    category: "Soporte Técnico",
    channel: "Portal Web",
    age: "Hace 2 horas",
    responses: 0,
    lastUpdate: "13 May 2025 10:00 AM",
    userType: "Empleado Ventas",
    priority: "Alta",
    createdBy: "currentUser", // Asumimos un ID para el usuario actual
  },
  {
    id: "ALT-002",
    subject: "Error al generar reporte de ventas mensual",
    status: "En Progreso",
    statusInitials: "EP",
    category: "Aplicaciones Internas",
    channel: "Email",
    age: "Hace 1 día",
    responses: 2,
    lastUpdate: "12 May 2025 03:30 PM",
    userType: "Gerente Regional",
    priority: "Media",
    assignedTo: "currentUser",
  },
  {
    id: "ALT-003",
    subject: "Consulta sobre nueva política de vacaciones",
    status: "Cerrado",
    statusInitials: "RH",
    category: "Recursos Humanos",
    channel: "Llamada Telefónica",
    age: "Hace 3 días",
    responses: 1,
    lastUpdate: "10 May 2025 11:00 AM",
    userType: "Empleado Logística",
    priority: "Baja",
  },
  {
    id: "ALT-004",
    subject: "Solicitud de equipo: Nuevo portátil para desarrollador",
    status: "Abierto",
    statusInitials: "TI",
    category: "Infraestructura TI",
    channel: "Portal Web",
    age: "Hace 5 horas",
    responses: 0,
    lastUpdate: "13 May 2025 08:15 AM",
    userType: "Líder Técnico",
    priority: "Alta",
    createdBy: "otherUser",
  },
  {
    id: "ALT-005",
    subject: "Problema con la impresora de la oficina B",
    status: "Cerrado",
    statusInitials: "SG",
    category: "Soporte General",
    channel: "Presencial",
    age: "Hace 1 semana",
    responses: 1,
    lastUpdate: "06 May 2025 09:00 AM",
    userType: "Asistente Administrativa",
    priority: "Media",
  },
  {
    id: "ALT-006",
    subject: "Capacitación requerida para nuevo software CRM",
    status: "Abierto",
    statusInitials: "CR",
    category: "Capacitación",
    channel: "Email",
    age: "Hace 2 días",
    responses: 0,
    lastUpdate: "11 May 2025 02:00 PM",
    userType: "Empleado Ventas",
    priority: "Media",
    assignedTo: "otherUser",
  },
  {
    id: "ALT-007",
    subject: "Falla en el sistema de aire acondicionado - Sede Norte",
    status: "En Progreso",
    statusInitials: "MN",
    category: "Mantenimiento",
    channel: "Llamada Telefónica",
    age: "Hace 4 horas",
    responses: 1,
    lastUpdate: "13 May 2025 09:30 AM",
    userType: "Gerente Sede",
    priority: "Alta",
    assignedTo: "currentUser",
  }
];

// Helper para clases de badge de estado
const getStatusBadgeClasses = (status: string) => {
  switch (status.toLowerCase()) {
    case "abierto": return "bg-red-100 text-red-700 border-red-300";
    case "en progreso": return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "cerrado": return "bg-primary-100 text-primary-600 border-primary-300";
    default: return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const channelOptions = [
  { value: "todos", label: "Todos los canales" }, { value: "portal_web", label: "Portal Web" },
  { value: "email", label: "Email" }, { value: "llamada", label: "Llamada Telefónica" },
  { value: "presencial", label: "Presencial" }, { value: "chat", label: "Chat Interno" },
];

const categoryOptions = [
  { value: "todas", label: "Todas las categorías" }, { value: "soporte_tecnico", label: "Soporte Técnico" },
  { value: "aplicaciones_internas", label: "Aplicaciones Internas" }, { value: "recursos_humanos", label: "Recursos Humanos" },
  { value: "infraestructura_ti", label: "Infraestructura TI" }, { value: "soporte_general", label: "Soporte General" },
  { value: "facturacion", label: "Facturación y Cobranza" }, { value: "capacitacion", label: "Capacitación" },
  { value: "mantenimiento", label: "Mantenimiento"},
];

// Definición de Vistas Guardadas
const savedViews = [
  { id: "all", label: "Todos los Tickets" },
  { id: "my_tickets", label: "Mis Tickets (Creados por mí)" },
  { id: "open_all", label: "Todos los Tickets Abiertos" },
  { id: "assigned_to_me", label: "Tickets Asignados a mí" },
  { id: "high_priority", label: "Tickets de Alta Prioridad" },
  // { id: "unassigned", label: "Tickets sin Asignar" }, // Necesitaría campo 'assignedTo' ser null/undefined
];

const TicketsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("todas");
  const [selectedChannel, setSelectedChannel] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState("all"); // Estado para la vista activa
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(allSampleTickets);

  // Simulación de ID de usuario actual
  const currentUserId = "currentUser";

  useEffect(() => {
    let tickets = [...allSampleTickets];

    // Filtrar por Vista Guardada
    switch (currentView) {
      case "my_tickets":
        tickets = tickets.filter(ticket => ticket.createdBy === currentUserId);
        break;
      case "open_all":
        tickets = tickets.filter(ticket => ticket.status.toLowerCase() === "abierto");
        break;
      case "assigned_to_me":
        tickets = tickets.filter(ticket => ticket.assignedTo === currentUserId);
        break;
      case "high_priority":
        tickets = tickets.filter(ticket => ticket.priority === "Alta");
        break;
      // case "unassigned":
      //   tickets = tickets.filter(ticket => !ticket.assignedTo);
      //   break;
      case "all":
      default:
        // No se aplica filtro adicional de vista, se usan todos.
        break;
    }

    // Filtrar por Categoría
    if (selectedCategory !== "todas") {
      tickets = tickets.filter(ticket => ticket.category.toLowerCase().replace(/\s+/g, '_') === selectedCategory);
    }

    // Filtrar por Canal
    if (selectedChannel !== "todos") {
      tickets = tickets.filter(ticket => ticket.channel.toLowerCase().replace(/\s+/g, '_') === selectedChannel);
    }

    // Filtrar por Término de Búsqueda
    if (searchTerm !== "") {
      tickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredTickets(tickets);
  }, [currentView, selectedCategory, selectedChannel, searchTerm]);

  const handleViewChange = (viewId: string) => {
    setCurrentView(viewId);
    // Opcional: resetear otros filtros al cambiar de vista principal
    // setSelectedCategory("todas");
    // setSelectedChannel("todos");
    // setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div><h1 className="text-2xl font-semibold text-primary-600">Gestión de Tickets Altipal</h1></div>
          <div className="relative w-full max-w-md">
            <Input type="search" placeholder="Buscar Tickets por ID, asunto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pr-10 h-10 border-gray-300 focus:border-primary-500 focus:ring-primary-500" />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-auto sm:flex-1 min-w-[200px] text-primary-600 border-gray-300 hover:border-primary-400 focus:ring-primary-500">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>{categoryOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                  <SelectTrigger className="w-full sm:w-auto sm:flex-1 min-w-[200px] text-primary-600 border-gray-300 hover:border-primary-400 focus:ring-primary-500">
                    <SelectValue placeholder="Canal" />
                  </SelectTrigger>
                  <SelectContent>{channelOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
                {/* Podríamos añadir un botón de "Más filtros" aquí */}
              </div>

              {filteredTickets.length > 0 ? (
                <ul className="space-y-5">
                  {filteredTickets.map((ticket) => (
                    <li key={ticket.id} className="border border-gray-200 rounded-md hover:shadow-md transition-shadow duration-200">
                      <Link href={`/dashboard/tickets/${ticket.id}`} legacyBehavior>
                        <a className="block cursor-pointer"> {/* No necesita p-4 aquí, se aplica al div interno */}
                          <div className="p-4"> {/* p-4 movido aquí */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div className="flex-grow">
                                <h2 className="text-lg font-semibold text-primary-600 hover:text-primary-500 mb-1">
                                  {ticket.subject} <span className="text-gray-500 font-medium">#{ticket.id}</span>
                                </h2>
                                <div className="flex flex-wrap items-center text-xs text-gray-600 gap-x-3 gap-y-1">
                                  <span className="flex items-center"><Folder className="w-3.5 h-3.5 mr-1 text-gray-400" /> {ticket.category}</span>
                                  <span className="flex items-center"><Globe className="w-3.5 h-3.5 mr-1 text-gray-400" /> {ticket.channel}</span>
                              {ticket.priority && <Badge variant={ticket.priority === 'Alta' ? 'destructive' : ticket.priority === 'Media' ? 'secondary' : 'default'} className="text-xs">{ticket.priority}</Badge>}
                              <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-gray-400" /> {ticket.age}</span>
                              <span className="flex items-center text-primary-500 font-medium"><MessageSquare className="w-3.5 h-3.5 mr-1" /> {ticket.responses} respuesta{ticket.responses !== 1 ? 's' : ''}</span>
                              <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-gray-400" /> {ticket.lastUpdate}</span>
                            </div>
                          </div>
                          <div className="ml-0 sm:ml-4 text-center flex-shrink-0 mt-2 sm:mt-0">
                            <div className={`w-10 h-10 rounded-full ${getStatusBadgeClasses(ticket.status)} flex items-center justify-center text-sm font-bold mb-1 border`}>{ticket.statusInitials}</div>
                            <span className="text-xs text-gray-500">{ticket.status}</span>
                          </div>
                        </div>
                          </div>
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12"><Search className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-xl text-gray-500">No se encontraron tickets.</p><p className="text-sm text-gray-400 mt-1">Intenta ajustar tus filtros o crea un nuevo ticket.</p></div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Button size="lg" className="w-full bg-primary-500 hover:bg-primary-600 text-white text-base py-3 shadow-md hover:shadow-lg transition-shadow"><PlusCircle className="w-5 h-5 mr-2" />Agregar Ticket</Button>
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-600 mb-4 flex items-center border-b pb-2"><FilterIcon className="w-5 h-5 mr-2 text-primary-400" /> Vistas Guardadas</h3>
              <ul className="space-y-1">
                {savedViews.map(view => (
                  <li key={view.id}>
                    <button
                      onClick={() => handleViewChange(view.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm hover:bg-primary-50 transition-colors ${currentView === view.id ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-700 hover:text-primary-600'}`}
                    >
                      {view.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketsPage;