import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageCircle, Repeat, Heart, Share, MoreHorizontal, ThumbsUp, PartyPopper, Laugh, Send, Bookmark, Edit3, Trash2 } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface Comment {
  id: string;
  authorName: string;
  authorAvatarUrl?: string;
  authorInitials: string;
  commentText: string;
  commentTime: string;
}

interface Reactions {
  thumbsUp: number;
  celebrate: number;
  laugh: number;
}

interface PostCardProps {
  authorName: string;
  authorAvatarUrl?: string;
  authorInitials: string;
  postTime: string;
  postContent: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  commentsCount: number;
  repostsCount: number;
  likesCount: number;
  comments: Comment[];
  reactions: Reactions;
}

export function PostCard({
  authorName,
  authorAvatarUrl,
  authorInitials,
  postTime,
  postContent,
  mediaUrl,
  mediaType,
  commentsCount,
  repostsCount,
  likesCount,
  comments,
  reactions,
}: PostCardProps) {
  return (
    <Card className="w-full shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start p-4">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarImage src={authorAvatarUrl} alt={`@${authorName}`} />
          <AvatarFallback>{authorInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-base text-gray-800">{authorName}</h4>
              <p className="text-xs text-muted-foreground">{postTime}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-gray-500 hover:bg-gray-100">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="shadow-lg">
                <DropdownMenuItem className="hover:bg-gray-50">Ver detalles</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-50">Copiar enlace</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-50"><Bookmark className="mr-2 h-4 w-4" />Guardar post</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-50"><Edit3 className="mr-2 h-4 w-4" />Editar post</DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-gray-50">Silenciar a {authorName}</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 hover:bg-red-50"><Trash2 className="mr-2 h-4 w-4" />Eliminar post</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600 hover:bg-red-50">Reportar post</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <p className="text-sm text-gray-700 mb-3">{postContent}</p>
        {mediaUrl && (
          <div className="my-3 rounded-lg overflow-hidden border border-gray-200">
            {mediaType === 'image' ? (
              <img src={mediaUrl} alt="Post media" className="w-full h-auto object-cover" />
            ) : mediaType === 'video' ? (
              <video src={mediaUrl} controls className="w-full h-auto" />
            ) : null}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4 pt-0 border-t border-gray-100">
        <div className="flex justify-around w-full py-1">
          <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md">
            <MessageCircle className="h-5 w-5 mr-2" />
            {commentsCount} <span className="sr-only">Comentarios</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-md">
            <Repeat className="h-5 w-5 mr-2" />
            {repostsCount} <span className="sr-only">Reposts</span>
          </Button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md">
                <Heart className="h-5 w-5 mr-2" />
                {likesCount} <span className="sr-only">Me gusta</span>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-auto p-2 shadow-md border-gray-200 rounded-full">
              <div className="flex space-x-1">
                <Button variant="ghost" size="icon" className="hover:bg-blue-100 rounded-full p-1.5 group">
                  <ThumbsUp className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-yellow-100 rounded-full p-1.5 group">
                  <PartyPopper className="h-5 w-5 text-gray-500 group-hover:text-yellow-500 transition-colors" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-pink-100 rounded-full p-1.5 group">
                  <Laugh className="h-5 w-5 text-gray-500 group-hover:text-pink-500 transition-colors" />
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>
          <Button variant="ghost" size="sm" className="flex-1 text-gray-600 hover:bg-sky-50 hover:text-sky-600 rounded-md">
            <Share className="h-5 w-5" /> <span className="sr-only">Compartir</span>
          </Button>
        </div>
        {(reactions.thumbsUp > 0 || reactions.celebrate > 0 || reactions.laugh > 0) && (
          <div className="flex items-center text-xs text-muted-foreground pt-2 space-x-3 w-full border-t border-gray-100 mt-2">
            {reactions.thumbsUp > 0 && <span className="flex items-center">👍 {reactions.thumbsUp}</span>}
            {reactions.celebrate > 0 && <span className="flex items-center">🎉 {reactions.celebrate}</span>}
            {reactions.laugh > 0 && <span className="flex items-center">😄 {reactions.laugh}</span>}
          </div>
        )}
      </CardFooter>

      <div className="p-4 border-t border-gray-100">
        <h5 className="text-sm font-semibold mb-3 text-gray-700">Comentarios</h5>
        <div className="flex items-start space-x-3 mb-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={authorAvatarUrl} alt="Usuario actual" /> {/* Idealmente avatar del usuario logueado */}
            <AvatarFallback>{authorInitials.substring(0,1)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              placeholder="Escribe un comentario..."
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={2}
            />
            <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={comment.authorAvatarUrl} alt={comment.authorName} />
                  <AvatarFallback>{comment.authorInitials}</AvatarFallback>
                </Avatar>
                <div className="bg-gray-50 p-2.5 rounded-lg flex-1 border border-gray-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-semibold text-gray-800">{comment.authorName}</p>
                    <p className="text-xs text-muted-foreground">{comment.commentTime}</p>
                  </div>
                  <p className="text-sm text-gray-700">{comment.commentText}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground text-center py-2">No hay comentarios aún. ¡Sé el primero!</p>
          )}
        </div>
      </div>
    </Card>
  );
}