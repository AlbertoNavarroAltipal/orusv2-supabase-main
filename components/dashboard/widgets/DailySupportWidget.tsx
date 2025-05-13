import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LifeBuoy, AlertCircle, CheckCircle2 } from "lucide-react";

// Datos de ejemplo para el soporte del día
const exampleSupportItems = [
  {
    id: "sup1",
    title: "Ticket #7890: Problema con inicio de sesión",
    status: "abierto",
    priority: "alta",
    assignedTo: "Usuario Actual",
    lastUpdate: "Hace 15 mins",
  },
  {
    id: "sup2",
    title: "Ticket #7885: Consulta sobre facturación",
    status: "en-progreso",
    priority: "media",
    assignedTo: "Usuario Actual",
    lastUpdate: "Hace 1 hora",
  },
  {
    id: "sup3",
    title: "Revisar documentación de nueva API de pagos",
    status: "pendiente",
    priority: "baja",
    assignedTo: "Usuario Actual",
    lastUpdate: "Ayer",
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "abierto":
      return <AlertCircle className="h-4 w-4 mr-2 text-red-500" />;
    case "en-progreso":
      return <LifeBuoy className="h-4 w-4 mr-2 text-yellow-500" />;
    case "pendiente":
      return <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />; // O algún otro ícono para pendiente
    case "resuelto":
      return <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />;
    default:
      return <LifeBuoy className="h-4 w-4 mr-2 text-gray-500" />;
  }
};

const getPriorityClass = (priority: string) => {
  if (priority === "alta") return "border-l-4 border-red-500";
  if (priority === "media") return "border-l-4 border-yellow-500";
  return "border-l-4 border-gray-300"; // Baja o sin prioridad
};


export function DailySupportWidget() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Soporte del Día</CardTitle>
          <Button variant="outline" size="sm">Ver Todos los Tickets</Button>
        </div>
        <CardDescription>Tickets y tareas de soporte asignados para hoy.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {exampleSupportItems.length > 0 ? (
          exampleSupportItems.map((item) => (
            <div key={item.id} className={`p-3 bg-muted/50 rounded-lg border ${getPriorityClass(item.priority)}`}>
              <div className="flex items-center mb-1">
                {getStatusIcon(item.status)}
                <h4 className="font-semibold text-sm flex-1">{item.title}</h4>
              </div>
              <p className="text-xs text-muted-foreground ml-6">
                Última actualización: {item.lastUpdate}
              </p>
              {/* Podrías añadir más detalles como a quién está asignado si no es siempre el usuario actual */}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay items de soporte urgentes para hoy.
          </p>
        )}
      </CardContent>
    </Card>
  );
}