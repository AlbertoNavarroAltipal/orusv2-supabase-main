import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export const columns = [
  {
    id: "name",
    header: "Nombre",
    cell: (row: any) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "description",
    header: "Descripción",
  },
  {
    id: "resource",
    header: "Recurso",
    cell: (row: any) => (
      <Badge variant="outline" className="capitalize">
        {row.resource}
      </Badge>
    ),
  },
  {
    id: "action",
    header: "Acción",
    cell: (row: any) => {
      const actionColors: Record<string, string> = {
        create: "bg-green-100 text-green-800",
        read: "bg-blue-100 text-blue-800",
        update: "bg-yellow-100 text-yellow-800",
        delete: "bg-red-100 text-red-800",
      }

      return (
        <Badge variant="outline" className={`capitalize ${actionColors[row.action] || ""}`}>
          {row.action}
        </Badge>
      )
    },
  },
  {
    id: "createdAt",
    header: "Fecha de creación",
    cell: (row: any) => format(new Date(row.createdAt), "dd/MM/yyyy"),
  },
]
