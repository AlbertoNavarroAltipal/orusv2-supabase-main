import { getUserProfile } from "@/lib/auth/auth-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// Avatar ya no es necesario aquí directamente para el formulario de post
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostCard } from "@/components/dashboard/PostCard";
// Textarea ya no es necesario aquí directamente para el formulario de post, se usa en CreatePostForm
// import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"; // <-- Restauramos la importación de Button
// Iconos de acción de post se mueven a CreatePostForm
// import { Image as ImageIcon, Send, Film, Smile } from "lucide-react";
import { CreatePostForm } from "@/components/dashboard/CreatePostForm"; // <-- Importamos el nuevo componente
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
      {/* <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a ORUS, tu plataforma integral de aplicaciones
        </p>
      </div> */}

      {/* Contenedor principal para las dos columnas */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Columna Izquierda */}
        <div className="w-2/3 flex flex-col gap-6 overflow-y-auto p-1">
          {/* Sección: Formulario para crear post usando el nuevo componente */}
          <CreatePostForm profile={profile} initials={initials} />
          {/* Sección: Tipos de post para empresa (muro) - El Card contenedor ha sido eliminado */}
          {/* Posts utilizando el nuevo componente PostCard */}
          <div className="flex flex-col space-y-4">
            {" "}
            {/* Contenedor para los posts con espaciado */}
            <PostCard
              authorName={profile.full_name || "Usuario de Orus"}
              authorInitials={initials}
              authorAvatarUrl={profile.avatar_url || undefined}
              postTime="Hace 10 minutos"
              postContent="¡Hola equipo! Solo quería compartir una actualización rápida sobre el proyecto Alpha. ¡Estamos progresando muy bien y esperamos alcanzar nuestros próximos hitos esta semana! 🔥 #Progreso #EquipoAlpha"
              commentsCount={2}
              repostsCount={3}
              likesCount={45} // Este es el 'Heart' original, podría reevaluarse
              comments={[
                {
                  id: "comment1",
                  authorName: "Elena Max",
                  authorInitials: "EM",
                  commentText: "¡Excelente noticia! Sigan así.",
                  commentTime: "Hace 5 min",
                },
                {
                  id: "comment2",
                  authorName: "Juan Pérez",
                  authorInitials: "JP",
                  commentText: "Gracias por la actualización.",
                  commentTime: "Hace 2 min",
                },
              ]}
              reactions={{ thumbsUp: 25, celebrate: 10, laugh: 5 }}
            />
            <PostCard
              authorName="Ana López"
              authorInitials="AL"
              authorAvatarUrl="/placeholder-user.jpg" // Ejemplo de URL de avatar
              postTime="Hace 1 hora"
              postContent="Acabo de leer un artículo fascinante sobre las últimas tendencias en IA. Definitivamente vale la pena echarle un vistazo. ¿Alguien más lo ha visto? 🤔 #IA #Tecnología"
              commentsCount={1}
              repostsCount={1}
              likesCount={22}
              comments={[
                {
                  id: "comment3",
                  authorName: "Carlos Ruiz",
                  authorInitials: "CR",
                  commentText:
                    "Muy interesante, Ana. ¿Puedes compartir el enlace?",
                  commentTime: "Hace 30 min",
                },
              ]}
              reactions={{ thumbsUp: 15, celebrate: 5, laugh: 2 }}
            />
            <PostCard
              authorName="Carlos Ruiz"
              authorInitials="CR"
              // authorAvatarUrl="" // Sin avatar, usará fallback
              postTime="Hace 3 horas"
              postContent="Recordatorio amistoso: la reunión de planificación del sprint es mañana a las 10 AM. ¡Preparen sus ideas! 🚀"
              commentsCount={0}
              repostsCount={0}
              likesCount={15}
              comments={[]}
              reactions={{ thumbsUp: 10, celebrate: 3, laugh: 1 }}
            />
          </div>{" "}
          {/* Fin del contenedor para los posts */}
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
