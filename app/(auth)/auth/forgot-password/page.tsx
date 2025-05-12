import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Recuperar contraseña</h1>
        <p className="text-sm text-muted-foreground">
          Ingresa tu correo electrónico para recibir un enlace de recuperación
        </p>
      </div>
      <ForgotPasswordForm />
      <div className="text-center text-sm">
        <Link href="/auth/login" className="text-primary hover:underline">
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}
