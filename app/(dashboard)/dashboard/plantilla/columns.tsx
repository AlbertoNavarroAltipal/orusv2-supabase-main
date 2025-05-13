"use client";

import React, { useState, useEffect } from "react"; // Importar useState y useEffect
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge"; // Para el estado
import plantillaData from "./data-plantilla.json"; // Importar los datos de configuración

// Definición del tipo para los datos de una plantilla (ajustar según sea necesario)
export interface Plantilla {
  id: string;
  name: string;
  category: string;
  status: "active" | "inactive" | "draft";
  createdBy: string;
  createdAt: string; // Debería ser Date, pero para simplicidad inicial usamos string
  updatedAt: string; // Debería ser Date
  // Añadir más campos según la definición en data-plantilla.json o la API real
}

// Componente auxiliar para formatear fechas en el cliente y evitar mismatch de hidratación
const ClientFormattedDate: React.FC<{ dateString: string }> = ({ dateString }) => {
  const [formattedDate, setFormattedDate] = useState(dateString); // Mostrar la cadena original o un placeholder inicialmente

  useEffect(() => {
    // Formatear solo en el cliente después del montaje
    try {
      setFormattedDate(new Date(dateString).toLocaleDateString());
    } catch (error) {
      console.error("Error formatting date:", error);
      // Mantener la cadena original si hay un error
      setFormattedDate(dateString);
    }
  }, [dateString]);

  return <>{formattedDate}</>;
};

// Generar dinámicamente las columnas basadas en tableHeaders de data-plantilla.json
export const columns: ColumnDef<Plantilla>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Mapear las cabeceras definidas en data-plantilla.json a ColumnDef
  ...plantillaData.tableHeaders.map((headerConfig) => {
    const columnDef: ColumnDef<Plantilla> = {
      accessorKey: headerConfig.accessorKey,
      header: ({ column }) => {
        // Permitir ordenación para todas las columnas por defecto, excepto acciones
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {headerConfig.header}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue(headerConfig.accessorKey as keyof Plantilla);
        
        // Formato especial para la columna 'status'
        if (headerConfig.accessorKey === "status") {
          const status = value as Plantilla["status"];
          let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
          if (status === "active") variant = "default"; // Podría ser success si tienes ese estilo
          if (status === "inactive") variant = "outline";
          if (status === "draft") variant = "secondary";
          return <Badge variant={variant} className="capitalize">{status}</Badge>;
        }

        // Formato para fechas usando el componente ClientFormattedDate
        if (headerConfig.accessorKey === "createdAt" || headerConfig.accessorKey === "updatedAt") {
          return <div className="text-sm text-muted-foreground"><ClientFormattedDate dateString={value as string} /></div>;
        }
        
        return <div className="font-medium">{String(value)}</div>;
      },
    };
    // Deshabilitar ordenación para 'id' si se prefiere
    if (headerConfig.accessorKey === "id") {
        columnDef.enableSorting = false;
    }
    return columnDef;
  }),
  {
    id: "actions",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => {
      const plantilla = row.original;
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(plantilla.id)}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Ver detalles</DropdownMenuItem>
              <DropdownMenuItem>Editar {plantillaData.entityName.toLowerCase()}</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                Eliminar {plantillaData.entityName.toLowerCase()}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
  },
];

// Datos de ejemplo (mock) para la tabla de plantillas
// Deberías reemplazar esto con una llamada a tu API real
export const mockPlantillas: Plantilla[] = [
  {
    id: "PLT001",
    name: "Plantilla de Bienvenida Email",
    category: "Email Marketing",
    status: "active",
    createdBy: "admin@example.com",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-01-20T14:30:00Z",
  },
  {
    id: "PLT002",
    name: "Informe Mensual de Ventas",
    category: "Reportes",
    status: "draft",
    createdBy: "user1@example.com",
    createdAt: "2023-02-01T09:00:00Z",
    updatedAt: "2023-02-05T11:15:00Z",
  },
  {
    id: "PLT003",
    name: "Presentación de Producto Nuevo",
    category: "Presentaciones",
    status: "inactive",
    createdBy: "admin@example.com",
    createdAt: "2022-12-10T16:20:00Z",
    updatedAt: "2023-01-10T08:45:00Z",
  },
  {
    id: "PLT004",
    name: "Contrato de Servicios Estándar",
    category: "Legal",
    status: "active",
    createdBy: "legal@example.com",
    createdAt: "2023-03-01T11:00:00Z",
    updatedAt: "2023-03-10T17:00:00Z",
  },
  {
    id: "PLT005",
    name: "Guía de Incorporación de Empleados",
    category: "RRHH",
    status: "active",
    createdBy: "hr@example.com",
    createdAt: "2023-02-20T10:30:00Z",
    updatedAt: "2023-02-25T15:00:00Z",
  },
];