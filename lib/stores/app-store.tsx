"use client";

// Este archivo re-exporta desde lib/stores.tsx para mantener compatibilidad
// con los componentes que importan desde @/lib/stores/app-store
export { AppStoreProvider, useAppStore } from "../../lib/stores";
