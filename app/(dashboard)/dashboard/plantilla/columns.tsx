"use client";

import React from "react"; // useEffect y useState ya no son necesarios aquí directamente
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
// Badge ya no es necesario a menos que se quiera para postId o id.
import commentDataConfig from "./data-plantilla.json"; // Renombrado para claridad

// Definición del tipo para una entrada de comentario, basada en la API de jsonplaceholder
export interface CommentEntry {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// Ya no se necesita ClientFormattedDate aquí

export const columns: ColumnDef<CommentEntry>[] = [
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
  ...commentDataConfig.tableHeaders.map((headerConfig) => {
    const columnDef: ColumnDef<CommentEntry> = {
      accessorKey: headerConfig.accessorKey,
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {headerConfig.header}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const value = row.getValue(headerConfig.accessorKey as keyof CommentEntry);
        
        // Formato especial para la columna 'body' para truncar texto largo
        if (headerConfig.accessorKey === "body") {
          const bodyText = String(value);
          return <div className="font-medium max-w-xl truncate" title={bodyText}>{bodyText}</div>;
        }
        
        // Formato especial para email para hacerlo clickeable
        if (headerConfig.accessorKey === "email") {
          return <a href={`mailto:${value}`} className="font-medium text-blue-600 hover:underline">{String(value)}</a>;
        }

        return <div className="font-medium whitespace-nowrap">{String(value)}</div>;
      },
    };
    // ID y PostID son numéricos, la ordenación por defecto debería funcionar bien.
    return columnDef;
  }),
  {
    id: "actions",
    header: () => <div className="text-right">Acciones</div>,
    cell: ({ row }) => {
      const comment = row.original;
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
                onClick={() => navigator.clipboard.writeText(String(comment.id))}
              >
                Copiar ID Comentario
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert(JSON.stringify(comment, null, 2))}>
                Ver detalles (JSON)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    enableSorting: false,
  },
];