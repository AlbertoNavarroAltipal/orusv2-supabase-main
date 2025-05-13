import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Asumiendo que tienes un componente Checkbox
import { PlusCircle } from "lucide-react";

// Datos de ejemplo para las tareas
const exampleTasks = [
  { id: "task1", text: "Revisar el feedback del cliente sobre el diseño", completed: false, priority: "alta" },
  { id: "task2", text: "Preparar la presentación para la reunión del viernes", completed: false, priority: "media" },
  { id: "task3", text: "Actualizar la documentación de la API", completed: true, priority: "baja" },
  { id: "task4", text: "Investigar nueva librería de gráficos", completed: false, priority: "media" },
];

// Helper para determinar el color de la prioridad
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "alta":
      return "bg-red-500";
    case "media":
      return "bg-yellow-500";
    case "baja":
      return "bg-green-500";
    default:
      return "bg-gray-300";
  }
};

export function TasksWidget() {
  // Aquí deberías manejar el estado de las tareas, por ejemplo, con useState
  // const [tasks, setTasks] = useState(exampleTasks);

  // const handleToggleComplete = (taskId: string) => {
  //   setTasks(prevTasks =>
  //     prevTasks.map(task =>
  //       task.id === taskId ? { ...task, completed: !task.completed } : task
  //     )
  //   );
  // };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Mis Tareas</CardTitle>
          <Button variant="ghost" size="sm" className="text-sky-500 hover:text-sky-600">
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Nueva Tarea
          </Button>
        </div>
        <CardDescription>Organiza y completa tus pendientes.</CardDescription>
      </CardHeader>
      <CardContent>
        {exampleTasks.length > 0 ? (
          <ul className="space-y-3">
            {exampleTasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center">
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    // onCheckedChange={() => handleToggleComplete(task.id)} // Descomentar para funcionalidad
                    className="mr-3"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.text}
                  </label>
                </div>
                <div className={`h-2.5 w-2.5 rounded-full ${getPriorityColor(task.priority)}`} title={`Prioridad: ${task.priority}`} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            ¡Todo al día! No tienes tareas pendientes.
          </p>
        )}
        {exampleTasks.length > 0 && (
           <Button variant="outline" size="sm" className="w-full mt-4">Ver todas las tareas</Button>
        )}
      </CardContent>
    </Card>
  );
}