"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner" // Importar toast de sonner
import { ProfileAvatar } from "./profile-avatar"
import type { Profile } from "@/types/user"

const formSchema = z.object({
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido").optional(),
  phone: z.string().optional(),
  department: z.string().optional(),
  position: z.string().optional(),
})

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  // Eliminar useToast
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile.avatar_url) // Inicializar con la URL existente

  // Limpiar la URL de previsualización si se desmonta el componente
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl !== profile.avatar_url && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl, profile.avatar_url])


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: profile.full_name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      department: profile.department || "",
      position: profile.position || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    let newAvatarUrl: string | null = profile.avatar_url // Mantener la URL actual por defecto

    try {
      // 1. Subir nueva imagen si existe
      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop()
        const fileName = `${profile.id}-${Date.now()}.${fileExt}` // Usar Date.now() para asegurar unicidad
        const filePath = `avatars/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from("orusv2") // Cambiado a "orusv2"
          .upload(filePath, selectedFile)

        if (uploadError) {
          throw new Error(`Error al subir el avatar: ${uploadError.message}`)
        }
        console.log("Avatar subido correctamente a:", filePath);

        // Generar una URL firmada de larga duración (ej. 10 años)
        const expiresIn = 60 * 60 * 24 * 365 * 10; // 10 años en segundos
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from("orusv2")
          .createSignedUrl(filePath, expiresIn);

        if (signedUrlError) {
          console.error("Error al crear la URL firmada:", signedUrlError);
          throw new Error(`Error al obtener la URL segura del avatar: ${signedUrlError.message}`);
        }

        if (!signedUrlData?.signedUrl) {
           console.error("No se recibió la URL firmada de Supabase.");
           throw new Error("No se pudo obtener la URL segura del avatar.");
        }

        newAvatarUrl = signedUrlData.signedUrl;
        console.log("URL firmada generada:", newAvatarUrl);


        // Opcional: Eliminar avatar anterior si existe y no es el placeholder
        // La lógica de eliminación usa el filePath relativo, así que no necesita cambios aquí.
        // PERO: La URL guardada ahora es firmada. Necesitamos extraer el filePath de ella.
        if (profile.avatar_url && !profile.avatar_url.includes("placeholder")) {
           try {
             // Extraer la ruta del archivo de la URL firmada anterior
             // La ruta está después del nombre del bucket y antes del '?' del token.
             try {
               const urlObject = new URL(profile.avatar_url);
               // La ruta suele ser /object/sign/bucket/folder/file.png
               // Necesitamos extraer 'folder/file.png'
               const pathSegments = urlObject.pathname.split('/');
               // Encontrar el índice del nombre del bucket
               const bucketIndex = pathSegments.indexOf('orusv2');
               if (bucketIndex !== -1 && bucketIndex < pathSegments.length - 1) {
                 const oldFileFullPath = pathSegments.slice(bucketIndex + 1).join('/');
                 console.log("Intentando eliminar archivo anterior en ruta:", oldFileFullPath);
                 if (oldFileFullPath) {
                    await supabase.storage.from('orusv2').remove([oldFileFullPath]);
                    console.log("Archivo anterior eliminado:", oldFileFullPath);
                 }
               } else {
                 console.warn("No se pudo extraer la ruta del archivo de la URL firmada anterior:", profile.avatar_url);
               }
             } catch (parseError: any) {
                console.warn("Error al parsear o eliminar la URL firmada anterior:", parseError.message, profile.avatar_url);
             }

           } catch (removeError: any) {
             console.warn("Error durante la eliminación del avatar anterior:", removeError.message);
             // No detener el proceso si falla la eliminación del archivo viejo
           }
        }
      }

      // 2. Actualizar perfil en la base de datos
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          full_name: values.full_name,
          phone: values.phone,
          department: values.department,
          position: values.position,
          avatar_url: newAvatarUrl, // Usar la nueva URL (o la original si no se cambió)
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (updateError) {
        console.error("Error al actualizar la tabla profiles:", updateError);
        throw new Error(`Error al actualizar el perfil en la tabla: ${updateError.message}`)
      }
      console.log("Tabla profiles actualizada con nueva avatar_url:", newAvatarUrl);

      // 3. Actualizar metadatos del usuario en Supabase Auth para disparar onAuthStateChange
      // Esto es importante para que otros componentes que dependen de useAuth() se actualicen.
      if (selectedFile) { // Solo actualizar si el avatar realmente cambió
        console.log("Intentando actualizar metadatos de Supabase Auth (sin await)...");
        // Quitar el await y manejar con .then() y .catch()
        supabase.auth.updateUser({
          data: { avatar_url: newAvatarUrl }, // Guardar la URL firmada aquí también
        })
        .then(({ error: authUpdateError }) => {
          if (authUpdateError) {
            console.warn("Error al actualizar metadatos del usuario en Supabase Auth (callback):", authUpdateError.message);
            toast.warning("Perfil actualizado con advertencia", {
               description: "Tu información se guardó, pero la foto de perfil podría tardar en actualizarse en todas partes.",
            });
          } else {
            console.log("Metadatos de Supabase Auth actualizados (callback).");
            toast.success("Perfil actualizado", {
               description: "Tu información personal y foto de perfil han sido actualizadas.",
            });
          }
          // Mover la finalización aquí para que se ejecute DESPUÉS de la respuesta de updateUser
          finalizeSubmit();
        })
        .catch(authUpdateError => {
            console.error("Error en la promesa de updateUser (catch):", authUpdateError);
            toast.error("Error actualizando metadatos", {
                description: "Ocurrió un error al actualizar los metadatos de autenticación."
            });
            // Asegurarse de finalizar el submit incluso si hay error en updateUser
            finalizeSubmit(true); // true indica que hubo un error en esta parte
        });
        // El flujo principal del try...catch ya no espera aquí.
        // Las acciones de finalización se movieron a la función finalizeSubmit.
      } else {
        // Si no se cambió el avatar, solo mostrar el sonner de éxito para el perfil
        console.log("Perfil actualizado (sin cambio de avatar).");
        toast.success("Perfil actualizado", {
           description: "Tu información personal ha sido actualizada.",
        });
        // Llamar a finalizeSubmit para el caso sin cambio de avatar
        finalizeSubmit();
      }
    } catch (error: any) { // Este catch ahora es para errores ANTES de la llamada a updateUser o si no hay selectedFile
      console.error("Error en onSubmit (antes de updateUser o sin cambio de avatar):", error);
      toast.error("Error al actualizar", {
         description: error.message || "Ocurrió un error inesperado.",
      });
      setIsLoading(false); // Asegurar que isLoading se desactive si hay error temprano
    }
    // El bloque finally se eliminó porque su lógica principal (setIsLoading)
    // ahora está en finalizeSubmit, que se llama en todos los flujos.
  }

  // Función auxiliar para manejar la finalización del submit
  const finalizeSubmit = (updateUserFailed = false) => {
    // Solo limpiar y refrescar si updateUser no falló explícitamente
    // o si no se intentó (es decir, no era un cambio de avatar).
    if (!updateUserFailed) {
        setSelectedFile(null);
        console.log("Estado local limpiado (finalizeSubmit).");
        console.log("Refrescando router (finalizeSubmit)...");
        router.refresh();
        console.log("Router refresh llamado (finalizeSubmit).");
    }
    console.log("Finalizando submit (finalizeSubmit), estableciendo isLoading a false.");
    setIsLoading(false);
  };

  const handleFileSelect = (file: File | null, url: string | null) => {
    setSelectedFile(file)
    setPreviewUrl(url || profile.avatar_url) // Mostrar previsualización o volver a la original
  }


  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        {/* Pasar la URL de previsualización o la original, y el handler */}
        <ProfileAvatar
           userId={profile.id}
           avatarUrl={previewUrl} // Usar la URL de previsualización o la original
           onFileSelect={handleFileSelect}
           isLoading={isLoading} // Pasar el estado de carga
         />

        <div className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="correo@ejemplo.com" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="+57 300 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ventas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input placeholder="Gerente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
