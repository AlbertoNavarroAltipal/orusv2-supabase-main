"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useMediaQuery } from "@/hooks/use-media-query"; // Mantendré la importación original por ahora, aunque sabemos que falla

interface AppStoreContextType {
  mainSidebarOpen: boolean;
  appSidebarOpen: boolean;
  infoSidebarOpen: boolean;
  toggleMainSidebar: () => void;
  toggleAppSidebar: () => void;
  toggleInfoSidebar: () => void;
  closeMainSidebar: () => void;
  closeAppSidebar: () => void;
  closeInfoSidebar: () => void;
}

const AppStoreContext = createContext<AppStoreContextType | undefined>(
  undefined
);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [mainSidebarOpen, setMainSidebarOpen] = useState(false);
  const [appSidebarOpen, setAppSidebarOpen] = useState(false);
  const [infoSidebarOpen, setInfoSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)"); // Lógica original

  // En escritorio, mostrar la barra lateral principal por defecto
  useEffect(() => {
    if (typeof isDesktop === "boolean") {
      // Añadir chequeo por si acaso
      if (isDesktop) {
        setMainSidebarOpen(true);
        setAppSidebarOpen(true);
      } else {
        setMainSidebarOpen(false);
        setAppSidebarOpen(false);
        setInfoSidebarOpen(false);
      }
    }
  }, [isDesktop]);

  const toggleMainSidebar = () => setMainSidebarOpen((prev) => !prev);
  const toggleAppSidebar = () => setAppSidebarOpen((prev) => !prev);
  const toggleInfoSidebar = () => setInfoSidebarOpen((prev) => !prev);
  const closeMainSidebar = () => setMainSidebarOpen(false);
  const closeAppSidebar = () => setAppSidebarOpen(false);
  const closeInfoSidebar = () => setInfoSidebarOpen(false);

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
  );
}

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (context === undefined) {
    throw new Error("useAppStore must be used within an AppStoreProvider");
  }
  return context;
};
