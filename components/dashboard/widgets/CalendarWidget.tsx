import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar"; // Asumiendo que tienes un componente de calendario en ui

export function CalendarWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Calendario</CardTitle>
        {/* Puedes añadir un botón de ajustes si es necesario */}
        {/* <button className="text-muted-foreground hover:text-primary text-sm">
          [Ajustes]
        </button> */}
      </CardHeader>
      <CardContent className="p-0"> {/* Eliminamos el padding para que el calendario se ajuste al card */}
        <Calendar
          mode="single"
          // selected={date} // Necesitarás manejar el estado de la fecha seleccionada
          // onSelect={setDate} // Y la función para actualizarla
          className="rounded-md w-full" // Eliminamos borde y añadimos w-full
        />
        {/* Aquí puedes añadir más lógica o visualización relacionada con el calendario */}
      </CardContent>
    </Card>
  );
}