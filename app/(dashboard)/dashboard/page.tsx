import { getUserProfile } from "@/lib/auth/auth-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/dashboard/PostCard"; // <-- Nueva importación
import { Textarea } from "@/components/ui/textarea"; // <-- Nueva importación
import { Button } from "@/components/ui/button"; // <-- Nueva importación
import { Image as ImageIcon, Send, Film, Smile } from "lucide-react"; // <-- Nuevas importaciones de iconos
import { CalendarWidget } from "@/components/dashboard/widgets/CalendarWidget";
import { EventsWidget } from "@/components/dashboard/widgets/EventsWidget";
import { TasksWidget } from "@/components/dashboard/widgets/TasksWidget";
import { DailySupportWidget } from "@/components/dashboard/widgets/DailySupportWidget";
import { BirthdaysWidget } from "@/components/dashboard/widgets/BirthdaysWidget";
import { UserProfileSummaryCard } from "@/components/dashboard/widgets/UserProfileSummaryCard";
import { Settings2 } from "lucide-react"; // Icono para el botón Gestionar

export default async function DashboardPage() {
  const profile = await getUserProfile();

  if (!profile) {
    return null;
  }

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="flex flex-col h-screen p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a ORUS, tu plataforma integral de aplicaciones
        </p>
      </div>

      {/* Contenedor principal para las dos columnas */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Columna Izquierda */}
        <div className="w-2/3 flex flex-col gap-6 overflow-y-auto p-1">
          {/* Sección: Formulario para crear post */}
          <Card className="p-0"> {/* Eliminamos padding por defecto para controlar el espaciado interno */}
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={profile.avatar_url || undefined} alt={`@${profile.full_name}`} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="¿Qué está pasando?"
                    className="w-full min-h-[80px] border-none focus-visible:ring-0 resize-none p-2 shadow-none"
                  />
                  <div className="flex items-center justify-between mt-2 pt-2 border-t">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900">
                        <Film className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900">
                        <Smile className="h-5 w-5" />
                      </Button>
                      {/* Otros botones de acción como encuestas, etc. */}
                    </div>
                    <Button className="rounded-full bg-sky-500 hover:bg-sky-600 text-white">
                      Postear
                      <Send className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sección: Tipos de post para empresa (muro) - El Card contenedor ha sido eliminado */}
          {/* Posts utilizando el nuevo componente PostCard */}
          <div className="flex flex-col space-y-4"> {/* Contenedor para los posts con espaciado */}
            <PostCard
              authorName={profile.full_name || "Usuario de Orus"}
                authorInitials={initials}
                authorAvatarUrl={profile.avatar_url || undefined}
                postTime="Hace 10 minutos"
                postContent="¡Hola equipo! Solo quería compartir una actualización rápida sobre el proyecto Alpha. ¡Estamos progresando muy bien y esperamos alcanzar nuestros próximos hitos esta semana! 🔥 #Progreso #EquipoAlpha"
                commentsCount={12}
                repostsCount={3}
                likesCount={45}
              />
              <PostCard
                authorName="Ana López"
                authorInitials="AL"
                // authorAvatarUrl="https://ruta.a.imagen/ana.jpg" // Ejemplo de URL de avatar
                postTime="Hace 1 hora"
                postContent="Acabo de leer un artículo fascinante sobre las últimas tendencias en IA. Definitivamente vale la pena echarle un vistazo. ¿Alguien más lo ha visto? 🤔 #IA #Tecnología"
                commentsCount={5}
                repostsCount={1}
                likesCount={22}
              />
              <PostCard
                authorName="Carlos Ruiz"
                authorInitials="CR"
                postTime="Hace 3 horas"
                postContent="Recordatorio amistoso: la reunión de planificación del sprint es mañana a las 10 AM. ¡Preparen sus ideas! 🚀"
                commentsCount={8}
                repostsCount={0}
                likesCount={15}
              />
            </div> {/* Fin del contenedor para los posts */}
        </div>

        {/* Columna Derecha */}
        <div className="w-1/3 flex flex-col gap-6 overflow-y-auto p-1">
          {/* Título de Widgets y Botón Gestionar */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-xl font-semibold tracking-tight">Widgets</h2>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Gestionar
            </Button>
          </div>

          {/* Resumen de Perfil de Usuario */}
          <UserProfileSummaryCard profile={profile} initials={initials} />

          {/* Nuevos Widgets */}
          <CalendarWidget />
          <EventsWidget />
          <TasksWidget />
          <DailySupportWidget />
          <BirthdaysWidget />
          {/* Puedes añadir más widgets aquí o reorganizarlos según sea necesario */}
        </div>
      </div>
    </div>
  );
}
