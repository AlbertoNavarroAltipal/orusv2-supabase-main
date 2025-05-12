"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface NotificationSettingsProps {
  userId: string
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Estados para las diferentes notificaciones
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [productUpdates, setProductUpdates] = useState(true)

  const saveNotificationSettings = async () => {
    setIsLoading(true)

    try {
      // Aquí iría la lógica para guardar las preferencias de notificaciones
      // Por ejemplo, una llamada a Supabase para actualizar las preferencias

      toast({
        title: "Preferencias actualizadas",
        description: "Tus preferencias de notificaciones han sido actualizadas correctamente.",
      })
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al actualizar preferencias",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Funcionalidad en desarrollo</AlertTitle>
        <AlertDescription>
          La configuración de notificaciones está actualmente en desarrollo y los cambios no se guardarán.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Notificaciones por correo electrónico</CardTitle>
          <CardDescription>Configura qué notificaciones recibes por correo electrónico</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col gap-1">
              <span>Notificaciones por correo</span>
              <span className="font-normal text-sm text-muted-foreground">
                Recibe notificaciones por correo electrónico
              </span>
            </Label>
            <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="security-alerts" className="flex flex-col gap-1">
              <span>Alertas de seguridad</span>
              <span className="font-normal text-sm text-muted-foreground">
                Recibe alertas sobre actividad sospechosa
              </span>
            </Label>
            <Switch id="security-alerts" checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="marketing-emails" className="flex flex-col gap-1">
              <span>Correos de marketing</span>
              <span className="font-normal text-sm text-muted-foreground">
                Recibe información sobre promociones y ofertas
              </span>
            </Label>
            <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={setMarketingEmails} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="product-updates" className="flex flex-col gap-1">
              <span>Actualizaciones del producto</span>
              <span className="font-normal text-sm text-muted-foreground">
                Recibe información sobre nuevas funcionalidades
              </span>
            </Label>
            <Switch id="product-updates" checked={productUpdates} onCheckedChange={setProductUpdates} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificaciones push</CardTitle>
          <CardDescription>Configura qué notificaciones recibes en tu dispositivo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="flex flex-col gap-1">
              <span>Notificaciones push</span>
              <span className="font-normal text-sm text-muted-foreground">Recibe notificaciones en tu dispositivo</span>
            </Label>
            <Switch id="push-notifications" checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={saveNotificationSettings} className="w-full" disabled={isLoading}>
        {isLoading ? "Guardando..." : "Guardar preferencias"}
      </Button>
    </div>
  )
}
