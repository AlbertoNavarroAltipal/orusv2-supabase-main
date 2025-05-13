import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/supabase";

export const getSupabaseServerClient = async (cookieStoreInput = cookies()) => {
  const store = await cookieStoreInput; // Resolve the promise here
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return store.get(name)?.value; // Use the resolved store
        },
        async set(name: string, value: string, options: any) {
          await store.set({ name, value, ...options }); // Use the resolved store
        },
        async remove(name: string, options: any) {
          await store.set({ name, value: "", ...options }); // Use the resolved store
        },
      },
    }
  );
};
