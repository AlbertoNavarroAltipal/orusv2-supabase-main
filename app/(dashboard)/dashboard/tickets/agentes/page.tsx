import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { MoreHorizontal, Search, Filter } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Datos de ejemplo para los tickets
const sampleTickets = [
  { id: 'TKT-001', subject: 'Problema con inicio de sesión', customer: 'Ana Pérez', priority: 'Alta', status: 'Abierto', agent: 'Carlos Ruiz', createdAt: '2024-05-10' },
  { id: 'TKT-002', subject: 'Error al cargar el dashboard', customer: 'Luis Gómez', priority: 'Media', status: 'En Progreso', agent: 'Sofía Luna', createdAt: '2024-05-09' },
  { id: 'TKT-003', subject: 'Consulta sobre facturación', customer: 'Elena Torres', priority: 'Baja', status: 'Resuelto', agent: 'Marcos Díaz', createdAt: '2024-05-08' },
  { id: 'TKT-004', subject: 'No se puede acceder al módulo X', customer: 'Pedro Martín', priority: 'Alta', status: 'Abierto', agent: 'Laura Vargas', createdAt: '2024-05-11' },
  { id: 'TKT-005', subject: 'Solicitud de nueva funcionalidad', customer: 'Carmen Mora', priority: 'Media', status: 'Pendiente', agent: 'Carlos Ruiz', createdAt: '2024-05-11' },
];

export default function TicketsAgentesPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <header className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold">Gestión de Tickets de Agentes</h1>
        <Button>Crear Nuevo Ticket</Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar tickets..." className="pl-8 w-full" />
          </div>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="abierto">Abierto</SelectItem>
              <SelectItem value="en-progreso">En Progreso</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="resuelto">Resuelto</SelectItem>
              <SelectItem value="cerrado">Cerrado</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="media">Media</SelectItem>
              <SelectItem value="baja">Baja</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Agente Asignado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="carlos-ruiz">Carlos Ruiz</SelectItem>
              <SelectItem value="sofia-luna">Sofía Luna</SelectItem>
              <SelectItem value="marcos-diaz">Marcos Díaz</SelectItem>
              <SelectItem value="laura-vargas">Laura Vargas</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="sm:col-span-2 md:col-span-1 lg:col-span-1">
            <Filter className="mr-2 h-4 w-4" /> Aplicar Filtros
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Listado de Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Asunto</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Agente</TableHead>
                <TableHead>Creado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>{ticket.subject}</TableCell>
                  <TableCell>{ticket.customer}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        ticket.priority === 'Alta' ? 'bg-red-100 text-red-700' :
                        ticket.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}
                    >
                      {ticket.priority}
                    </span>
                  </TableCell>
                  <TableCell>
                  <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        ticket.status === 'Abierto' ? 'bg-blue-100 text-blue-700' :
                        ticket.status === 'En Progreso' ? 'bg-purple-100 text-purple-700' :
                        ticket.status === 'Resuelto' ? 'bg-green-100 text-green-700' :
                        ticket.status === 'Pendiente' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </TableCell>
                  <TableCell>{ticket.agent}</TableCell>
                  <TableCell>{ticket.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                        <DropdownMenuItem>Editar Ticket</DropdownMenuItem>
                        <DropdownMenuItem>Reasignar</DropdownMenuItem>
                        <DropdownMenuItem>Convertir a Base de Conocimiento</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Cerrar Ticket</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}