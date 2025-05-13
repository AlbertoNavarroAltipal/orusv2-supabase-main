// app/(auth)/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Crear un cliente de Supabase directamente en lugar de usar el helper de cookies
    // Esto evita los errores con cookies().get()
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: "pkce",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });

    // Procesar el código para la autenticación
    await supabase.auth.exchangeCodeForSession(code);

    // Redirigir al usuario a la página principal o dashboard
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Error en la ruta de callback:", error);
    return NextResponse.redirect(
      new URL("/auth/login?error=callback-failed", request.url)
    );
  }
}
