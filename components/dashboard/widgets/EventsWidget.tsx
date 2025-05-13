import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin } from "lucide-react";

// Datos de ejemplo para los eventos
const exampleEvents = [
  {
    id: "evt1",
    title: "Reunión de equipo semanal",
    date: "Mañana, 10:00 AM",
    location: "Sala de conferencias B",
    description: "Discusión sobre el progreso del sprint y próximos pasos.",
  },
  {
    id: "evt2",
    title: "Presentación Cliente X",
    date: "Viernes, 2:00 PM",
    location: "Online - Enlace en el calendario",
    description: "Demostración de la nueva funcionalidad al cliente.",
  },
  {
    id: "evt3",
    title: "Almuerzo de integración",
    date: "Próximo Lunes, 1:00 PM",
    location: "Restaurante 'El Buen Sabor'",
    description: "Actividad para fomentar la cohesión del equipo.",
  },
];

export function EventsWidget() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Próximos Eventos</CardTitle>
          <Button variant="outline" size="sm">Ver todos</Button>
        </div>
        <CardDescription>Un vistazo a tus próximos compromisos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {exampleEvents.length > 0 ? (
          exampleEvents.map((event) => (
            <div key={event.id} className="p-3 bg-muted/50 rounded-lg border">
              <h4 className="font-semibold text-sm mb-1">{event.title}</h4>
              <div className="flex items-center text-xs text-muted-foreground mb-1">
                <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                {event.date}
              </div>
              {event.location && (
                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3.5 w-3.5 mr-1.5" />
                  {event.location}
                </div>
              )}
              <p className="text-xs text-muted-foreground">{event.description}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No tienes eventos próximos.
          </p>
        )}
      </CardContent>
    </Card>
  );
}