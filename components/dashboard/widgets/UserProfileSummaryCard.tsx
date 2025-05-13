import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Profile } from "@/types/user";
import { ExternalLink, Star, ClipboardCheck, ListTodo, AlertTriangle, TrendingUp } from "lucide-react"; // Añadido TrendingUp

interface UserProfileSummaryCardProps {
  profile: Profile | null;
  initials: string;
}

export function UserProfileSummaryCard({
  profile,
  initials,
}: UserProfileSummaryCardProps) {
  if (!profile) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 mb-4 border-2 border-primary">
            <AvatarFallback className="text-3xl">?</AvatarFallback>
          </Avatar>
          <p className="text-muted-foreground">No se pudo cargar el perfil.</p>
        </CardContent>
      </Card>
    );
  }

  const formatStat = (value: number | null | undefined, singular: string, plural: string) => {
    if (value === null || typeof value === 'undefined') return `0 ${plural}`;
    return `${value} ${value === 1 ? singular : plural}`;
  };


  return (
    <Card>
      <CardContent className="pt-6 flex flex-col items-center text-center">
        <Avatar className="h-20 w-20 mb-4 border-2 border-primary">
          <AvatarImage
            src={profile.avatar_url || undefined}
            alt={profile.full_name || "Usuario"}
          />
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold mb-1">
          {profile.full_name || "Nombre no disponible"}
        </h3>
        <p className="text-sm text-muted-foreground">
          {profile.email || "Email no disponible"}
        </p>
        {profile.position && (
          <p className="text-xs text-muted-foreground mb-4">
            {profile.position}
          </p>
        )}

        {/* Sección de Estadísticas */}
        <div className="my-4 w-full px-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div className="flex items-center justify-start space-x-2">
              <ClipboardCheck className="h-4 w-4 text-amber-700" />
              <span className="font-medium">Calificación:</span>
              <span>{profile.average_grade?.toFixed(1) ?? 'N/A'}</span>
            </div>
            <div className="flex items-center justify-start space-x-2">
              <Star className="h-4 w-4 text-amber-700" />
              <span className="font-medium">Puntos:</span>
              <span>{profile.points ?? 0}</span>
            </div>
            <div className="flex items-center justify-start space-x-2">
              <ListTodo className="h-4 w-4 text-amber-700" />
              <span className="font-medium">Pendientes:</span>
              <span>{formatStat(profile.pending_tasks, 'tarea', 'tareas')}</span>
            </div>
            <div className="flex items-center justify-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-medium">Por Vencer:</span>
              <span>{formatStat(profile.due_soon_tasks, 'tarea', 'tareas')}</span>
            </div>
            {/* Puesto - Asumiendo que 'position' ya existe y se muestra arriba, o si es un 'ranking' */}
            {/* Si 'puesto' se refiere a un ranking en la plataforma: */}
            {/* <div className="flex items-center justify-start space-x-2">
              <TrendingUp className="h-4 w-4 text-amber-700" />
              <span className="font-medium">Puesto:</span>
              <span>{profile.ranking_position ?? 'N/A'}</span>
            </div> */}
          </div>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/profile">
            Ver Perfil
            <ExternalLink className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
