"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Hook personalizado para detectar si estamos en móvil
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const media = window.matchMedia(query)
      setMatches(media.matches)

      const listener = (event: MediaQueryListEvent) => {
        setMatches(event.matches)
      }

      media.addEventListener("change", listener)
      return () => {
        media.removeEventListener("change", listener)
      }
    }
    return undefined
  }, [query])

  return matches
}

interface AppStoreContextType {
  mainSidebarOpen: boolean
  appSidebarOpen: boolean
  infoSidebarOpen: boolean
  toggleMainSidebar: () => void
  toggleAppSidebar: () => void
  toggleInfoSidebar: () => void
  closeMainSidebar: () => void
  closeAppSidebar: () => void
  closeInfoSidebar: () => void
}

const AppStoreContext = createContext<AppStoreContextType | undefined>(undefined)

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [mainSidebarOpen, setMainSidebarOpen] = useState(false)
  const [appSidebarOpen, setAppSidebarOpen] = useState(false)
  const [infoSidebarOpen, setInfoSidebarOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  // En escritorio, mostrar la barra lateral principal por defecto
  useEffect(() => {
    if (isDesktop) {
      setMainSidebarOpen(true)
      setAppSidebarOpen(true)
    } else {
      setMainSidebarOpen(false)
      setAppSidebarOpen(false)
      setInfoSidebarOpen(false)
    }
  }, [isDesktop])

  const toggleMainSidebar = () => setMainSidebarOpen((prev) => !prev)
  const toggleAppSidebar = () => setAppSidebarOpen((prev) => !prev)
  const toggleInfoSidebar = () => setInfoSidebarOpen((prev) => !prev)
  const closeMainSidebar = () => setMainSidebarOpen(false)
  const closeAppSidebar = () => setAppSidebarOpen(false)
  const closeInfoSidebar = () => setInfoSidebarOpen(false)

  return (
    <AppStoreContext.Provider
      value={{
        mainSidebarOpen,
        appSidebarOpen,
        infoSidebarOpen,
        toggleMainSidebar,
        toggleAppSidebar,
        toggleInfoSidebar,
        closeMainSidebar,
        closeAppSidebar,
        closeInfoSidebar,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  )
}

export const useAppStore = () => {
  const context = useContext(AppStoreContext)
  if (context === undefined) {
    throw new Error("useAppStore must be used within an AppStoreProvider")
  }
  return context
}
