import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Profile } from "@/types/user"; // Corregido: UserProfile a Profile
import { ExternalLink } from "lucide-react";

interface UserProfileSummaryCardProps {
  profile: Profile | null; // Corregido: UserProfile a Profile
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
        <p className="text-sm text-muted-foreground mb-4">
          {profile.email || "Email no disponible"}
        </p>
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
