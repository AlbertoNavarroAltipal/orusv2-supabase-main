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
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
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

export function CreatePostForm({ profile, initials }: CreatePostFormProps) {
  const [postContent, setPostContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [pollQuestion, setPollQuestion] = useState(""); // Podría usarse postContent para esto

  const [showEventCreator, setShowEventCreator] = useState(false);
  const [eventDetails, setEventDetails] = useState({ title: "", date: "", time: "", description: "" });

  const [showAnnouncementCreator, setShowAnnouncementCreator] = useState(false);
  const [announcementDetails, setAnnouncementDetails] = useState({ title: "", content: "", expiryDate: "" });

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const currentFilesCount = selectedFiles.length;
      const allowedNewFiles = newFiles.slice(0, 5 - currentFilesCount); // Limitar a 5 archivos

      setSelectedFiles((prevFiles) => [...prevFiles, ...allowedNewFiles]);
      const newPreviewUrls = allowedNewFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls]);

      // Desactivar otros creadores si se suben archivos
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

  const togglePollCreator = () => {
    const newShow = !showPollCreator;
    setShowPollCreator(newShow);
    if (!newShow) {
      setPollOptions(["", ""]);
      setPollQuestion("");
    } else {
      setShowEventCreator(false);
      setShowAnnouncementCreator(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  };

  const toggleEventCreator = () => {
    const newShow = !showEventCreator;
    setShowEventCreator(newShow);
    if (!newShow) {
      setEventDetails({ title: "", date: "", time: "", description: "" });
    } else {
      setShowPollCreator(false);
      setShowAnnouncementCreator(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  };

  const toggleAnnouncementCreator = () => {
    const newShow = !showAnnouncementCreator;
    setShowAnnouncementCreator(newShow);
    if (!newShow) {
      setAnnouncementDetails({ title: "", content: "", expiryDate: "" });
    } else {
      setShowPollCreator(false);
      setShowEventCreator(false);
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  };

  const handleEventDetailChange = (field: keyof typeof eventDetails, value: string) => {
    setEventDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleAnnouncementDetailChange = (field: keyof typeof announcementDetails, value: string) => {
    setAnnouncementDetails(prev => ({ ...prev, [field]: value }));
  };

  // --- Efectos ---
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // --- Renderizado condicional del perfil ---
  if (!profile) {
    return (
      <Card className="p-0">
        <CardContent className="p-4">
          <div className="flex items-center justify-center h-[150px]">
            Información de perfil no disponible.
          </div>
        </CardContent>
      </Card>
    );
  }

  const isAnyCreatorActive = showPollCreator || showEventCreator || showAnnouncementCreator;
  const canAttachFiles = !isAnyCreatorActive;
  const canCreatePoll = !showEventCreator && !showAnnouncementCreator && selectedFiles.length === 0;
  const canCreateEvent = !showPollCreator && !showAnnouncementCreator && selectedFiles.length === 0;
  const canCreateAnnouncement = !showPollCreator && !showEventCreator && selectedFiles.length === 0;


  // --- Renderizado principal del componente ---
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
                placeholder={
                  showPollCreator ? "Escribe la pregunta de tu encuesta..." :
                  showEventCreator ? "Título del evento (la descripción va en el post)..." :
                  showAnnouncementCreator ? "Título del anuncio (el contenido va en el post)..." :
                  "¿Qué está pasando?"
                }
                value={postContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPostContent(e.target.value)}
                minRows={3}
                className="w-full border-none focus-visible:ring-0 resize-none p-2 shadow-none text-base bg-transparent"
              />

              {/* Sección para crear Encuesta */}
              {showPollCreator && (
                <div className="mt-3 p-3 border rounded-md bg-slate-50 dark:bg-slate-800">
                  <h3 className="text-sm font-medium mb-2">Crear Encuesta</h3>
                  <div className="space-y-2">
                    {pollOptions.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          type="text"
                          placeholder={`Opción ${index + 1}`}
                          value={option}
                          onChange={(e) => handlePollOptionChange(index, e.target.value)}
                          className="flex-grow"
                        />
                        {pollOptions.length > 2 && (
                          <Button variant="ghost" size="icon" onClick={() => removePollOption(index)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {pollOptions.length < 5 && (
                    <Button onClick={addPollOption} variant="outline" size="sm" className="mt-2">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Añadir opción
                    </Button>
                  )}
                </div>
              )}

              {/* Sección para crear Evento */}
              {showEventCreator && (
                <div className="mt-3 p-3 border rounded-md bg-slate-50 dark:bg-slate-800 space-y-3">
                  <h3 className="text-sm font-medium">Detalles del Evento</h3>
                  {/* El título del evento ahora se toma del TextareaAutosize principal */}
                  {/* <Input placeholder="Título del evento" value={eventDetails.title} onChange={(e) => handleEventDetailChange("title", e.target.value)} /> */}
                  <div className="flex space-x-2">
                    <Input type="date" placeholder="Fecha" value={eventDetails.date} onChange={(e) => handleEventDetailChange("date", e.target.value)} className="flex-1" />
                    <Input type="time" placeholder="Hora" value={eventDetails.time} onChange={(e) => handleEventDetailChange("time", e.target.value)} className="flex-1" />
                  </div>
                  {/* La descripción del evento ahora se toma del TextareaAutosize principal */}
                </div>
              )}

              {/* Sección para crear Anuncio */}
              {showAnnouncementCreator && (
                <div className="mt-3 p-3 border rounded-md bg-slate-50 dark:bg-slate-800 space-y-3">
                  <h3 className="text-sm font-medium">Detalles del Anuncio</h3>
                  {/* El título del anuncio ahora se toma del TextareaAutosize principal */}
                  {/* <Input placeholder="Título del anuncio" value={announcementDetails.title} onChange={(e) => handleAnnouncementDetailChange("title", e.target.value)} /> */}
                  {/* El contenido del anuncio ahora se toma del TextareaAutosize principal */}
                  <Input placeholder="Fecha de expiración (opcional)" type="date" value={announcementDetails.expiryDate} onChange={(e) => handleAnnouncementDetailChange("expiryDate", e.target.value)} />
                </div>
              )}

              {/* Previsualización de archivos */}
              {previewUrls.length > 0 && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      {selectedFiles[index].type.startsWith("image/") ? (
                        <img src={url} alt={`preview ${index}`} className="rounded-md object-cover w-full h-32" />
                      ) : selectedFiles[index].type.startsWith("video/") ? (
                        <video src={url} controls className="rounded-md object-cover w-full h-32" />
                      ) : selectedFiles[index].type === "application/pdf" ? (
                        <embed src={url} type="application/pdf" className="rounded-md w-full h-32" />
                      ) : (
                        <div className="rounded-md bg-gray-100 dark:bg-gray-800 w-full h-32 flex flex-col items-center justify-center text-center p-2">
                          <Paperclip className="h-8 w-8 text-gray-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 truncate w-full">
                            {selectedFiles[index].name}
                          </span>
                        </div>
                      )}
                      <button onClick={() => handleRemoveFile(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Eliminar archivo">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input type="file" multiple ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,text/plain" />

              <div className="relative flex items-center justify-between mt-2 pt-2 border-t">
                <div className="flex space-x-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-full" onClick={() => openFileDialog("image/*")} disabled={!canAttachFiles}>
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Añadir imagen</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-full" onClick={() => openFileDialog("video/*")} disabled={!canAttachFiles}>
                        <Film className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Añadir video</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-full" onClick={() => openFileDialog("*/*")} disabled={!canAttachFiles}>
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Añadir archivo</p></TooltipContent>
                  </Tooltip>
                  <Popover>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900 rounded-full">
                            <Smile className="h-5 w-5" />
                          </Button>
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent><p>Añadir emoji</p></TooltipContent>
                    </Tooltip>
                    <PopoverContent className="p-0 w-auto border-0" side="top" align="start">
                      <Picker onEmojiClick={onEmojiClick} autoFocusSearch={false} theme={Theme.AUTO} emojiVersion="5.0" />
                    </PopoverContent>
                  </Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className={`rounded-full ${showPollCreator ? "bg-sky-100 dark:bg-sky-900 text-sky-600" : "text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900"}`} onClick={togglePollCreator} disabled={!canCreatePoll}>
                        <ListChecks className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{showPollCreator ? "Cancelar encuesta" : "Crear encuesta"}</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className={`rounded-full ${showEventCreator ? "bg-sky-100 dark:bg-sky-900 text-sky-600" : "text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900"}`} onClick={toggleEventCreator} disabled={!canCreateEvent}>
                        <CalendarPlus className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{showEventCreator ? "Cancelar evento" : "Crear evento"}</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className={`rounded-full ${showAnnouncementCreator ? "bg-sky-100 dark:bg-sky-900 text-sky-600" : "text-sky-500 hover:bg-sky-100 dark:hover:bg-sky-900"}`} onClick={toggleAnnouncementCreator} disabled={!canCreateAnnouncement}>
                        <Megaphone className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>{showAnnouncementCreator ? "Cancelar anuncio" : "Crear anuncio"}</p></TooltipContent>
                  </Tooltip>
                </div>
                <Button className="rounded-full bg-sky-500 hover:bg-sky-600 text-white px-6">
                  Postear
                  <Send className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
