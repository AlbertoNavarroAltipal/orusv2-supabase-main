import type React from "react"
import { requireAuth, getUserProfile } from "@/lib/auth/auth-utils"
import { MainHeader } from "@/components/layout/main-header"
import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { InfoSidebar } from "@/components/layout/info-sidebar"
import { AppStoreProvider } from "@/lib/stores"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()
  const profile = await getUserProfile()

  if (!profile) {
    return null
  }

  return (
    <AppStoreProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header principal (rojo) */}
        <MainHeader user={profile} />

        {/* Header de la aplicación (blanco) */}
        <AppHeader />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar de la aplicación (amarillo) */}
          <AppSidebar />

          {/* Contenido principal (azul) */}
          <main className="flex-1 overflow-y-auto bg-blue-50">{children}</main>

          {/* Panel de información (verde) */}
          <InfoSidebar />
        </div>
      </div>
    </AppStoreProvider>
  )
}
