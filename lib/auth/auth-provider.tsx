"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/lib/supabase/provider"
import type { Session, User } from "@supabase/supabase-js"
import type { Profile } from "@/types/user"
import { SessionLostModal } from "@/components/auth/session-lost-modal" // Nueva importación

type AuthContextType = {
  user: User | null
  profile: Profile | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, userData: Partial<Profile>) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
  updatePassword: (password: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSessionLostModal, setShowSessionLostModal] = useState(false) // Nuevo estado para el modal
  const [initialAuthCheckCompleted, setInitialAuthCheckCompleted] = useState(false) // Nuevo estado para la comprobación inicial

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()
      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (currentSession?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentSession.user.id)
          .single()
        setProfile(data)
      }
      setIsLoading(false)
      setInitialAuthCheckCompleted(true) // Marcar la comprobación inicial como completada
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[AuthProvider] onAuthStateChange event:", event, "session:", newSession)
      const wasUserLoggedIn = user !== null

      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", newSession.user.id)
          .single()
        setProfile(data)
      } else {
        setProfile(null)
        // Si el usuario estaba logueado y ahora no hay sesión (y la comprobación inicial ha pasado), mostrar modal
        if (wasUserLoggedIn && initialAuthCheckCompleted) {
          console.log("[AuthProvider] Session lost or user signed out, showing modal.")
          setShowSessionLostModal(true)
        }
      }

      // Si el evento es SIGNED_OUT y la comprobación inicial ha pasado, mostrar modal
      if (event === "SIGNED_OUT" && initialAuthCheckCompleted) {
        console.log("[AuthProvider] SIGNED_OUT event received, showing modal.")
        setShowSessionLostModal(true)
      }


      setIsLoading(false) // Asegurarse de que isLoading se actualice
      // No refrescar la ruta aquí si vamos a mostrar un modal y redirigir desde allí
      // router.refresh() // Comentado para evitar conflictos con la redirección del modal
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { error }
  }

  const signUp = async (email: string, password: string, userData: Partial<Profile>) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    })

    return { error }
  }

  const signOut = async () => {
    console.log("[AuthProvider] signOut called")
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("[AuthProvider] Error during supabase.auth.signOut():", error)
      } else {
        console.log("[AuthProvider] supabase.auth.signOut() successful")
      }
    } catch (e) {
      console.error("[AuthProvider] Exception during supabase.auth.signOut():", e)
    }
    console.log("[AuthProvider] Attempting to redirect to /auth/login")
    router.push("/auth/login")
    // router.refresh() // Consider if refresh is needed here or if onAuthStateChange handles it
    console.log("[AuthProvider] Redirect to /auth/login initiated")
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })

    return { error }
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    })

    return { error }
  }

  const value = {
    user,
    profile,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionLostModal
        isOpen={showSessionLostModal}
        onClose={() => setShowSessionLostModal(false)}
      />
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
