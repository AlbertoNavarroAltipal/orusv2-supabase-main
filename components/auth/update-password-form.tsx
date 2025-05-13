"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "@/lib/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast as sonnerToast } from "sonner" // Usar sonner para toasts
import { Eye, EyeOff, Loader2 } from "lucide-react" // Importar iconos y loader
import { Progress } from "@/components/ui/progress" // Importar Progress

const formSchema = z
  .object({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export function UpdatePasswordForm() {
  const { updatePassword, signOut } = useAuth() // Añadir signOut
  const router = useRouter()
  // const { toast } = useToast() // Remover useToast
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0) // 0: nada, 1: débil, ..., 4: muy fuerte
  const [strengthColor, setStrengthColor] = useState("bg-gray-200") // Color para la barra de progreso

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // Función para verificar la fortaleza de la contraseña
  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++ // Longitud mínima
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++ // Mayúsculas y minúsculas
    if (password.match(/[0-9]/)) strength++ // Números
    if (password.match(/[^a-zA-Z0-9]/)) strength++ // Caracteres especiales

    setPasswordStrength(strength) // Valor numérico 0-4

    // Actualizar color basado en la fuerza
    if (strength <= 1) setStrengthColor("bg-red-500")
    else if (strength === 2) setStrengthColor("bg-yellow-500")
    else if (strength >= 3) setStrengthColor("bg-green-500")
    else setStrengthColor("bg-gray-200")
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const { error } = await updatePassword(values.password)

      if (error) {
        sonnerToast.error("Error al actualizar la contraseña", { // Usar sonner
          description: error.message,
        })
        return
      }

      sonnerToast.success("Contraseña actualizada", { // Usar sonner
        description: "Tu contraseña ha sido actualizada correctamente. Redirigiendo...",
      })

      // Forzar cierre de sesión después de actualizar contraseña en flujo de recuperación
      await signOut()
      // No es necesario redirigir manualmente, signOut ya lo hace (o debería activar onAuthStateChange)

    } catch (error: any) {
      sonnerToast.error("Error inesperado", { // Usar sonner
        description: error.message || "Ocurrió un error inesperado al actualizar la contraseña.",
      })
    } finally {
      // Asegurarse de restablecer el estado de carga SIEMPRE
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="******"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e) // Asegura que react-hook-form reciba el cambio
                      checkPasswordStrength(e.target.value) // Verifica la fortaleza
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Ocultar" : "Mostrar"}</span>
                  </Button>
                </div>
              </FormControl>
              {/* Indicador de fortaleza */}
              {field.value && (
                 <div className="mt-2">
                   <Progress value={passwordStrength * 25} className={strengthColor + " h-2"} />
                   <p className="text-xs mt-1 text-muted-foreground">
                     Fortaleza: {["Muy débil", "Débil", "Media", "Fuerte", "Muy Fuerte"][passwordStrength] || "Inválida"}
                   </p>
                 </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="******"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showConfirmPassword ? "Ocultar" : "Mostrar"}</span>
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Actualizando...
            </>
          ) : (
            "Actualizar contraseña"
          )}
        </Button>
      </form>
    </Form>
  )
}
