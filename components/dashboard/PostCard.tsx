import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageCircle, Repeat, Heart, Share, MoreHorizontal } from "lucide-react"; // Asumiendo que usas lucide-react para iconos

interface PostCardProps {
  authorName: string;
  authorAvatarUrl?: string;
  authorInitials: string;
  postTime: string;
  postContent: string;
  commentsCount: number;
  repostsCount: number;
  likesCount: number;
}

export function PostCard({
  authorName,
  authorAvatarUrl,
  authorInitials,
  postTime,
  postContent,
  commentsCount,
  repostsCount,
  likesCount,
}: PostCardProps) {
  return (
    <Card className="w-full"> {/* Se eliminó max-w-xl y mx-auto */}
      <CardHeader className="flex flex-row items-start p-4">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={authorAvatarUrl} alt={`@${authorName}`} />
          <AvatarFallback>{authorInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm">{authorName}</h4>
              <p className="text-xs text-muted-foreground">{postTime}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                <DropdownMenuItem>Copiar enlace</DropdownMenuItem>
                <DropdownMenuItem>Silenciar a {authorName}</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  Reportar post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p className="text-sm">{postContent}</p>
        {/* Aquí podrías agregar imágenes o videos del post */}
      </CardContent>
      <CardFooter className="flex justify-between p-4 border-t">
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
          <MessageCircle className="h-5 w-5 mr-2" />
          {commentsCount}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-500">
          <Repeat className="h-5 w-5 mr-2" />
          {repostsCount}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
          <Heart className="h-5 w-5 mr-2" />
          {likesCount}
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-sky-500">
          <Share className="h-5 w-5" />
        </Button>
      </CardFooter>
      {/* Sección de comentarios (placeholder) */}
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground">
          [Sección de comentarios aquí - Próximamente]
        </p>
      </div>
    </Card>
  );
}