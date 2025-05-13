import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; // Importación añadida
import { Cake, Gift } from "lucide-react";

// Datos de ejemplo para los cumpleaños
const todayBirthdays = [
  {
    id: "user1",
    name: "Laura Martínez",
    avatarUrl: "/placeholder-user.jpg", // Usa una imagen de placeholder o una real
    department: "Diseño UX",
    initials: "LM",
  },
  {
    id: "user2",
    name: "Carlos Gómez",
    avatarUrl: null, // Ejemplo sin avatar específico
    department: "Desarrollo Backend",
    initials: "CG",
  },
];

const upcomingBirthdays = [
  {
    id: "user3",
    name: "Sofía Vargas",
    date: "En 3 días",
    initials: "SV",
  },
];

export function BirthdaysWidget() {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center">
            <Cake className="h-5 w-5 mr-2 text-pink-500" />
            Cumpleaños
          </CardTitle>
          {/* <Button variant="outline" size="sm">Ver calendario</Button> */}
        </div>
        <CardDescription>¡Celebremos con nuestros compañeros!</CardDescription>
      </CardHeader>
      <CardContent>
        {todayBirthdays.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              Hoy
            </h3>
            <div className="space-y-3">
              {todayBirthdays.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center p-3 bg-muted/50 rounded-lg border"
                >
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarImage
                      src={person.avatarUrl || undefined}
                      alt={person.name}
                    />
                    <AvatarFallback>{person.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{person.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {person.department}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-pink-500 hover:bg-pink-100 dark:hover:bg-pink-900"
                  >
                    <Gift className="h-4 w-4 mr-1.5" /> Felicitar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {upcomingBirthdays.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground pt-3 border-t">
              Próximos
            </h3>
            <div className="space-y-2">
              {upcomingBirthdays.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted/50"
                >
                  <span>{person.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {person.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {todayBirthdays.length === 0 && upcomingBirthdays.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No hay cumpleaños hoy ni en los próximos días.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
