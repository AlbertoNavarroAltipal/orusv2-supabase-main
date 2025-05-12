import { redirect } from "next/navigation"

export default function IAMPage() {
  // Redirigir a la página de usuarios por defecto
  redirect("/dashboard/iam/users")
}
