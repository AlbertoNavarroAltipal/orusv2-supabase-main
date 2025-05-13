import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster as SonnerToaster } from "sonner" // Import Sonner's Toaster
import { Toaster as ShadcnToaster } from "@/components/ui/toaster" // Keep shadcn toaster if used elsewhere
import { SupabaseProvider } from "@/lib/supabase/provider"
import { AuthProvider } from "@/lib/auth/auth-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ORUS - Super App",
  description: "Plataforma integral de aplicaciones para Altipal",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <SupabaseProvider>
          <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
              {children}
              <ShadcnToaster /> {/* Keep if needed */}
              <SonnerToaster richColors closeButton /> {/* Add Sonner's Toaster */}
            </ThemeProvider>
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
