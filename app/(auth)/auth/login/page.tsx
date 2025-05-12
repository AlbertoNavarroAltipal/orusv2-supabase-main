import { LoginForm } from "@/components/auth/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
        <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
      </div>
      <LoginForm />
      <div className="text-center text-sm">
        <Link href="/auth/forgot-password" className="text-primary hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
      <div className="text-center text-sm">
        ¿No tienes una cuenta?{" "}
        <Link href="/auth/register" className="text-primary hover:underline">
          Regístrate
        </Link>
      </div>
    </div>
  )
}
