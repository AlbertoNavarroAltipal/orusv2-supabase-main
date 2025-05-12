import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/auth-utils"

export default async function Home() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  } else {
    redirect("/auth/login")
  }

  return null
}
