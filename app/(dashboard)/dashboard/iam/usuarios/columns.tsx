"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";

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
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { Profile } from "@/types/user"; // Asumiendo que Profile es el tipo correcto

// Datos de ejemplo para usuarios, reemplazar con datos reales
export const users: Profile[] = [
  {
    id: "usr_1",
    full_name: "Alberto Navarro",
    email: "alberto@example.com",
    role: "Admin",
    avatar_url: null,
    department: "IT",
    position: "Software Engineer",
    phone: "123-456-7890",
    last_sign_in: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "usr_2",
    full_name: "Maria Rodriguez",
    email: "maria@example.com",
    role: "Editor",
    avatar_url: null,
    department: "Marketing",
    position: "Content Creator",
    phone: "987-654-3210",
    last_sign_in: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "usr_3",
    full_name: "Carlos Lopez",
    email: "carlos@example.com",
    role: "Viewer",
    avatar_url: null,
    department: "Sales",
    position: "Sales Representative",
    phone: "555-555-5555",
    last_sign_in: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const columns: ColumnDef<Profile>[] = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      let sortIcon;
      if (sortDirection === "asc") {
        sortIcon = <ArrowUp className="ml-2 h-4 w-4" />;
      } else if (sortDirection === "desc") {
        sortIcon = <ArrowDown className="ml-2 h-4 w-4" />;
      } else {
        // Opcional: mostrar ArrowUpDown o nada si no está ordenado
        sortIcon = <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />; // Un poco opaco si no está activo
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre Completo
          {sortIcon}
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original;
      // El ContextMenu ahora se manejará a nivel de fila en DataTable
      return <div className="font-medium">{user.full_name}</div>;
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      let sortIcon;
      if (sortDirection === "asc") {
        sortIcon = <ArrowUp className="ml-2 h-4 w-4" />;
      } else if (sortDirection === "desc") {
        sortIcon = <ArrowDown className="ml-2 h-4 w-4" />;
      } else {
        sortIcon = <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          {sortIcon}
        </Button>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      let sortIcon;
      if (sortDirection === "asc") {
        sortIcon = <ArrowUp className="ml-2 h-4 w-4" />;
      } else if (sortDirection === "desc") {
        sortIcon = <ArrowDown className="ml-2 h-4 w-4" />;
      } else {
        sortIcon = <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rol
          {sortIcon}
        </Button>
      );
    },
  },
  {
    accessorKey: "department",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      let sortIcon;
      if (sortDirection === "asc") {
        sortIcon = <ArrowUp className="ml-2 h-4 w-4" />;
      } else if (sortDirection === "desc") {
        sortIcon = <ArrowDown className="ml-2 h-4 w-4" />;
      } else {
        sortIcon = <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Departamento
          {sortIcon}
        </Button>
      );
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      let sortIcon;
      if (sortDirection === "asc") {
        sortIcon = <ArrowUp className="ml-2 h-4 w-4" />;
      } else if (sortDirection === "desc") {
        sortIcon = <ArrowDown className="ml-2 h-4 w-4" />;
      } else {
        sortIcon = <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cargo
          {sortIcon}
        </Button>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      let sortIcon;
      if (sortDirection === "asc") {
        sortIcon = <ArrowUp className="ml-2 h-4 w-4" />;
      } else if (sortDirection === "desc") {
        sortIcon = <ArrowDown className="ml-2 h-4 w-4" />;
      } else {
        sortIcon = <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Teléfono
          {sortIcon}
        </Button>
      );
    },
  },
  {
    accessorKey: "avatar_url",
    header: "Avatar URL", // No la haremos ordenable por ahora
    cell: ({ row }) => {
      const avatarUrl = row.getValue("avatar_url") as string | null;
      return avatarUrl ? <a href={avatarUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Ver Avatar</a> : "N/A";
    }
  },
  {
    accessorKey: "last_sign_in",
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      let sortIcon;
      if (sortDirection === "asc") {
        sortIcon = <ArrowUp className="ml-2 h-4 w-4" />;
      } else if (sortDirection === "desc") {
        sortIcon = <ArrowDown className="ml-2 h-4 w-4" />;
      } else {
        sortIcon = <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
      }
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Último Acceso
          {sortIcon}
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("last_sign_in") as string | null;
      return date ? new Date(date).toLocaleDateString('en-CA') : "N/A";
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      // const user = row.original; // Eliminamos la declaración duplicada y la innecesaria
      // El ContextMenuTrigger se manejará a nivel de fila en DataTable.tsx
      // Esta celda ahora solo define el CONTENIDO del menú contextual para esta fila.
      // Opcionalmente, se puede dejar un indicador visual si se desea, o nada.
      // Por ahora, no renderizará nada visible por sí misma, el menú se activa en la fila.
      return null;
    },
    // Definimos una meta propiedad para pasar el contenido del menú contextual
    meta: {
      rowContextMenu: (row: import("@tanstack/react-table").Row<Profile>) => { // Añadir tipo explícito para row
        const user = row.original;
        return (
          <>
            <ContextMenuItem
              inset
              onClick={() => alert(`Viendo perfil de ${user.full_name}`)}
            >
              Ver Perfil
            </ContextMenuItem>
            <ContextMenuItem
              inset
              onClick={() => alert(`Editando ${user.full_name}`)}
            >
              Editar Usuario
            </ContextMenuItem>
            <ContextMenuSub>
              <ContextMenuSubTrigger inset>Más Acciones</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem
                  onClick={() => alert(`Cambiando rol de ${user.full_name}`)}
                >
                  Cambiar Rol
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => alert(`Desactivando ${user.full_name}`)}
                >
                  Desactivar Usuario
                </ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem
              inset
              className="text-red-600 hover:!text-red-600 hover:!bg-red-100"
              onClick={() => alert(`Eliminando ${user.full_name}`)}
            >
              Eliminar Usuario
            </ContextMenuItem>
          </>
        );
      },
    },
  },
];
