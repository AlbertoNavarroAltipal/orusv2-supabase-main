import React from "react";
import PageSubheader from "@/components/dashboard/page-subheader"; // Importar el nuevo componente
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

// Datos de ejemplo para los tickets
const sampleTickets = [
  {
    id: "TKT-001",
    subject: "Problema con el inicio de sesión",
    status: "Abierto",
    priority: "Alta",
    createdAt: "2024-05-10",
    lastUpdate: "2024-05-12",
    agent: "Ana Pérez",
  },
  {
    id: "TKT-002",
    subject: "Error al cargar el dashboard",
    status: "En progreso",
    priority: "Media",
    createdAt: "2024-05-11",
    lastUpdate: "2024-05-13",
    agent: "Carlos Ruiz",
  },
  {
    id: "TKT-003",
    subject: "Consulta sobre facturación",
    status: "Cerrado",
    priority: "Baja",
    createdAt: "2024-05-09",
    lastUpdate: "2024-05-11",
    agent: "Sofía Gómez",
  },
  {
    id: "TKT-004",
    subject: "Solicitud de nueva funcionalidad",
    status: "Abierto",
    priority: "Media",
    createdAt: "2024-05-13",
    lastUpdate: "2024-05-13",
    agent: "N/A",
  },
];

const MisTicketsPage = () => {
  return (
    <>
      <PageSubheader title="Mis Tickets">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Buscar tickets por asunto o ID..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="todos">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="abierto">Abierto</SelectItem>
              <SelectItem value="en_progreso">En Progreso</SelectItem>
              <SelectItem value="cerrado">Cerrado</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filtros Avanzados
          </Button>
        </div>
      </PageSubheader>
      <main className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          {/* La descripción "Visualiza y gestiona los tickets que has creado." se puede mover aquí si es necesario, o eliminar si el título es suficiente. */}
          {/* <p className="text-gray-600 mb-6">Visualiza y gestiona los tickets que has creado.</p> */}
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Ticket</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead>Agente Asignado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ticket.status === "Abierto"
                          ? "default"
                          : ticket.status === "En progreso"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        ticket.status === "Abierto"
                          ? "bg-blue-100 text-blue-700"
                          : ticket.status === "En progreso"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ticket.priority === "Alta" ? "destructive" : "default"
                      }
                      className={
                        ticket.priority === "Alta"
                          ? "" // destructive ya tiene estilos
                          : ticket.priority === "Media"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                          : "bg-gray-100 text-gray-700 border-gray-300" // Para 'Baja' y otros
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{ticket.createdAt}</TableCell>
                  <TableCell>{ticket.lastUpdate}</TableCell>
                  <TableCell>{ticket.agent}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {sampleTickets.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No tienes tickets creados.</p>
            <Button className="mt-4">Crear Nuevo Ticket</Button>
          </div>
        )}
      </div>
    </main>
  );
};

export default MisTicketsPage;
