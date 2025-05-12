import { UpdatePasswordForm } from "@/components/auth/update-password-form"
import Link from "next/link"

export default function UpdatePasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Actualizar contraseña</h1>
        <p className="text-sm text-muted-foreground">Ingresa tu nueva contraseña</p>
      </div>
      <UpdatePasswordForm />
      <div className="text-center text-sm">
        <Link href="/auth/login" className="text-primary hover:underline">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}
