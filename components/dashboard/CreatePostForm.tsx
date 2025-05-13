"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TextareaAutosize from "react-textarea-autosize";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Para Nivel de Importancia
import { Checkbox } from "@/components/ui/checkbox"; // Para Permitir Comentarios
import { Label } from "@/components/ui/label"; // Para Checkbox
import {
  Film,
  Image as ImageIcon,
  Send,
  Smile,
  Paperclip,
  XCircle,
  ListChecks,
  PlusCircle,
  Trash2,
  CalendarPlus,
  Megaphone,
  MapPin, // Icono para Ubicación
  Link2, // Icono para Enlace
} from "lucide-react";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import Picker, { EmojiClickData, Theme } from "emoji-picker-react";
import { Input } from "@/components/ui/input";

type UserProfile = {
  full_name?: string | null;
  avatar_url?: string | null;
};

interface CreatePostFormProps {
  profile: UserProfile | null;
  initials: string;
}

type EventDetails = {
  title: string; // Se tomará de postContent
  date: string;
  time: string;
  location: string;
  link: string;
  description: string; // Se tomará de postContent
};

type AnnouncementDetails = {
  title: string; // Se tomará de postContent
  content: string; // Se tomará de postContent
  expiryDate: string;
  importance: "normal" | "importante" | "urgente";
  allowComments: boolean;
};


export function CreatePostForm({ profile, initials }: CreatePostFormProps) {
  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);

  const [showEventCreator, setShowEventCreator] = useState(false);
  const [eventDetails, setEventDetails] = useState<EventDetails>({ title: "", date: "", time: "", location: "", link: "", description: "" });

  const [showAnnouncementCreator, setShowAnnouncementCreator] = useState(false);
  const [announcementDetails, setAnnouncementDetails] = useState<AnnouncementDetails>({ title: "", content: "", expiryDate: "", importance: "normal", allowComments: true });

  // --- Funciones Auxiliares ---
  function onEmojiClick(emojiData: EmojiClickData) {
    setPostContent((prevContent) => prevContent + emojiData.emoji);
  }

  const openFileDialog = (acceptType: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = acceptType;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const currentFilesCount = selectedFiles.length;
      const allowedNewFiles = newFiles.slice(0, 5 - currentFilesCount);

      setSelectedFiles((prevFiles) => [...prevFiles, ...allowedNewFiles]);
      const newPreviewUrls = allowedNewFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);

      setShowPollCreator(false);
      setShowEventCreator(false);
      setShowAnnouncementCreator(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    URL.revokeObjectURL(previewUrls[indexToRemove]);
    setSelectedFiles((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
    setPreviewUrls((prevUrls) => prevUrls.filter((_, index) => index !== indexToRemove));
  };

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      const newOptions = pollOptions.filter((_, i) => i !== index);
      setPollOptions(newOptions);
    }
  };

  const resetSpecialCreators = () => {
    setShowPollCreator(false);
    setPollOptions(["", ""]);
    setShowEventCreator(false);
    setEventDetails({ title: "", date: "", time: "", location: "", link: "", description: "" });
    setShowAnnouncementCreator(false);
    setAnnouncementDetails({ title: "", content: "", expiryDate: "", importance: "normal", allowComments: true });
  };
  
  const clearFiles = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url)); // Limpiar URLs existentes
    setSelectedFiles([]);
    setPreviewUrls([]);
  }

  const togglePollCreator = () => {
    const newShow = !showPollCreator;
    if (newShow) {
      resetSpecialCreators();
      clearFiles();
      setShowPollCreator(true);
    } else {
      resetSpecialCreators();
    }
  };

  const toggleEventCreator = () => {
    const newShow = !showEventCreator;
    if (newShow) {
      resetSpecialCreators();
      clearFiles();
      setShowEventCreator(true);
    } else {
      resetSpecialCreators();
    }
  };

  const toggleAnnouncementCreator = () => {
    const newShow = !showAnnouncementCreator;
    if (newShow) {
      resetSpecialCreators();
      clearFiles();
      setShowAnnouncementCreator(true);
    } else {
      resetSpecialCreators();
    }
  };

  const handleEventDetailChange = (field: keyof EventDetails, value: string | boolean) => {
    setEventDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAnnouncementDetailChange = (field: keyof AnnouncementDetails, value: string | boolean) => {
    setAnnouncementDetails(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  if (!profile) {
    return (
      <Card className="p-0"><CardContent className="p-4"><div className="flex items-center justify-center h-[150px]">Información de perfil no disponible.</div></CardContent></Card>
    );
  }

  const isAnySpecialCreatorActive = showPollCreator || showEventCreator || showAnnouncementCreator;
  const canAttachFiles = !isAnySpecialCreatorActive;
  const canCreatePoll = !showEventCreator && !showAnnouncementCreator && selectedFiles.length === 0;
  const canCreateEvent = !showPollCreator && !showAnnouncementCreator && selectedFiles.length === 0;
  const canCreateAnnouncement = !showPollCreator && !showEventCreator && selectedFiles.length === 0;

  let mainPlaceholder = "¿Qué está pasando?";
  if (showPollCreator) mainPlaceholder = "Escribe la pregunta de tu encuesta...";
  else if (showEventCreator) mainPlaceholder = "Título y descripción de tu evento...";
  else if (showAnnouncementCreator) mainPlaceholder = "Título y contenido de tu anuncio...";

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="p-0">
        <CardContent className="p-4">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={profile.avatar_url || undefined} alt={`@${profile.full_name || "Usuario"}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <TextareaAutosize
                placeholder={mainPlaceholder}
                value={postContent}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setPostContent(e.target.value)}
                minRows={3}
                className="w-full border-none focus-visible:ring-0 resize-none p-2 shadow-none text-base bg-transparent"
              />

              {showPollCreator && (
                <div className="mt-3 p-3 border rounded-md bg-slate-50 dark:bg-slate-800">
                  <h3 className="text-sm font-medium mb-2">Crear Encuesta</h3>
                  <div className="space-y-2">
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input type="text" placeholder={`Opción ${index + 1}`} value={option} onChange={(e) => handlePollOptionChange(index, e.target.value)} className="flex-grow" />
                        {pollOptions.length > 2 && (
                          <Button variant="ghost" size="icon" onClick={() => removePollOption(index)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {pollOptions.length < 5 && ( <Button onClick={addPollOption} variant="outline" size="sm" className="mt-2"> <PlusCircle className="h-4 w-4 mr-2" /> Añadir opción </Button> )}
                </div>
              )}

              {showEventCreator && (
                <div className="mt-3 p-3 border rounded-md bg-slate-50 dark:bg-slate-800 space-y-3">
                  <h3 className="text-sm font-medium">Detalles del Evento</h3>
                  <div className="flex space-x-2">
                    <Input type="date" value={eventDetails.date} onChange={(e) => handleEventDetailChange("date", e.target.value)} className="flex-1" title="Fecha del evento" />
                    <Input type="time" value={eventDetails.time} onChange={(e) => handleEventDetailChange("time", e.target.value)} className="flex-1" title="Hora del evento" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <Input placeholder="Ubicación (ej. Sala de conferencias, Online)" value={eventDetails.location} onChange={(e) => handleEventDetailChange("location", e.target.value)} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link2 className="h-5 w-5 text-gray-500" />
                    <Input type="url" placeholder="Enlace del evento (opcional)" value={eventDetails.link} onChange={(e) => handleEventDetailChange("link", e.target.value)} />
                  </div>
                </div>
              )}

              {showAnnouncementCreator && (
                <div className="mt-3 p-3 border rounded-md bg-slate-50 dark:bg-slate-800 space-y-3">
                  <h3 className="text-sm font-medium">Detalles del Anuncio</h3>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="importance-select" className="text-sm">Importancia:</Label>
                    <Select value={announcementDetails.importance} onValueChange={(value) => handleAnnouncementDetailChange("importance", value as AnnouncementDetails["importance"])}>
                      <SelectTrigger id="importance-select" className="w-[180px]"> <SelectValue placeholder="Nivel" /> </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="importante">Importante</SelectItem>
                        <SelectItem value="urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input placeholder="Fecha de expiración (opcional)" type="date" value={announcementDetails.expiryDate} onChange={(e) => handleAnnouncementDetailChange("expiryDate", e.target.value)} />
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allowComments" checked={announcementDetails.allowComments} onCheckedChange={(checked) => handleAnnouncementDetailChange("allowComments", !!checked)} />
                    <Label htmlFor="allowComments" className="text-sm font-normal">Permitir comentarios</Label>
                  </div>
                </div>
              )}

              {previewUrls.length > 0 && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      {selectedFiles[index].type.startsWith("image/") ? ( <img src={url} alt={`preview ${index}`} className="rounded-md object-cover w-full h-32" /> )
                      : selectedFiles[index].type.startsWith("video/") ? ( <video src={url} controls className="rounded-md object-cover w-full h-32" /> )
                      : selectedFiles[index].type === "application/pdf" ? ( <embed src={url} type="application/pdf" className="rounded-md w-full h-32" /> )
                      : ( <div className="rounded-md bg-gray-100 dark:bg-gray-800 w-full h-32 flex flex-col items-center justify-center text-center p-2"> <Paperclip className="h-8 w-8 text-gray-500" /> <span className="text-xs text-gray-600 dark:text-gray-400 truncate w-full"> {selectedFiles[index].name} </span> </div> )}
                      <button onClick={() => handleRemoveFile(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Eliminar archivo"> <XCircle className="h-4 w-4" /> </button>
                    </div>
                  ))}
                </div>
              )}

              <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,text/plain" />

              <div className="relative flex items-center justify-between mt-2 pt-2 border-t">
                <div className="flex space-x-1">
                  <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-full" onClick={() => openFileDialog("image/*")} disabled={!canAttachFiles}><ImageIcon className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent><p>Añadir imagen</p></TooltipContent></Tooltip>
                  <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-full" onClick={() => openFileDialog("video/*")} disabled={!canAttachFiles}><Film className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent><p>Añadir video</p></TooltipContent></Tooltip>
                  <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-full" onClick={() => openFileDialog("*/*")} disabled={!canAttachFiles}><Paperclip className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent><p>Añadir archivo</p></TooltipContent></Tooltip>
                  <Popover><Tooltip><TooltipTrigger asChild><PopoverTrigger asChild><Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-full"><Smile className="h-5 w-5" /></Button></PopoverTrigger></TooltipTrigger><TooltipContent><p>Añadir emoji</p></TooltipContent></Tooltip><PopoverContent className="p-0 w-auto border-0" side="top" align="start"><Picker onEmojiClick={onEmojiClick} autoFocusSearch={false} theme={Theme.AUTO} emojiVersion="5.0" /></PopoverContent></Popover>
                  <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className={`rounded-full ${showPollCreator ? "bg-sky-100 dark:bg-sky-900 text-sky-600" : "text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900"}`} onClick={togglePollCreator} disabled={!canCreatePoll}><ListChecks className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent><p>{showPollCreator ? "Cancelar encuesta" : "Crear encuesta"}</p></TooltipContent></Tooltip>
                  <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className={`rounded-full ${showEventCreator ? "bg-sky-100 dark:bg-sky-900 text-sky-600" : "text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900"}`} onClick={toggleEventCreator} disabled={!canCreateEvent}><CalendarPlus className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent><p>{showEventCreator ? "Cancelar evento" : "Crear evento"}</p></TooltipContent></Tooltip>
                  <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className={`rounded-full ${showAnnouncementCreator ? "bg-sky-100 dark:bg-sky-900 text-sky-600" : "text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900"}`} onClick={toggleAnnouncementCreator} disabled={!canCreateAnnouncement}><Megaphone className="h-5 w-5" /></Button></TooltipTrigger><TooltipContent><p>{showAnnouncementCreator ? "Cancelar anuncio" : "Crear anuncio"}</p></TooltipContent></Tooltip>
                </div>
                <Button className="rounded-full bg-sky-500 hover:bg-sky-600 text-white px-6"> Postear <Send className="h-4 w-4 ml-2" /> </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
