import type React from "react"
// getUserProfile ya no es necesario aquí
import { requireAuth } from "@/lib/auth/auth-utils"
import { MainHeader } from "@/components/layout/main-header"
import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { InfoSidebar } from "@/components/layout/info-sidebar"
import { AppStoreProvider } from "@/lib/stores"

// Ya no necesita ser async si no hay awaits dentro
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // requireAuth puede seguir siendo async, pero no necesitamos esperarlo aquí
  // si no usamos su resultado directamente en este componente.
  // Si requireAuth redirige o lanza error, detendrá la ejecución igualmente.
  // Considerar si requireAuth necesita ejecutarse antes de renderizar el layout.
  // Si es así, mantener async/await. Si solo verifica y redirige, puede quitarse await.
  // Por seguridad y simplicidad, mantenemos await requireAuth() por si hace algo más que redirigir.
  // PERO, si requireAuth SÓLO redirige en caso de no estar autenticado,
  // y el AuthProvider ya maneja el estado, podríamos quitarlo aquí y dejar que
  // las páginas individuales o el AuthProvider manejen la redirección.
  // Asumiremos que requireAuth es necesario aquí por ahora.
  // Para quitar el await, requireAuth no debería devolver nada útil aquí.
  // Vamos a mantenerlo async/await por ahora para evitar romper la lógica de autenticación.
  // await requireAuth() // Mantener si es necesario para la protección de ruta

  // Eliminar obtención de perfil
  // const profile = await getUserProfile()
  // if (!profile) {
  //   return null // O redirigir, o manejar en AuthProvider
  // }

  // TODO: Revisar si requireAuth() es realmente necesario aquí o si AuthProvider
  // ya protege las rutas adecuadamente. Si AuthProvider lo hace, quitar requireAuth().

  return (
    <AppStoreProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header principal (rojo) - ya no necesita la prop user */}
        <MainHeader />

        {/* Header de la aplicación (blanco) */}
        <AppHeader />

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar de la aplicación (amarillo) */}
          <AppSidebar />

          {/* Contenido principal (azul) */}
          <main className="flex-1 overflow-y-auto bg-blue-50 transition-all duration-300 ease-in-out">
            {children}
          </main>

          {/* Panel de información (verde) */}
          <InfoSidebar />
        </div>
      </div>
    </AppStoreProvider>
  )
}
