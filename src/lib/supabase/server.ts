import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { publicEnv } from "@/config/env";
import type { Database } from "@/types/database";

type CookieStore = Awaited<ReturnType<typeof cookies>>;
type SupabaseCookieToSet = {
  name: string;
  options?: Parameters<CookieStore["set"]>[2];
  value: string;
};

export const createSupabaseServerClient = async () => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: SupabaseCookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }: SupabaseCookieToSet) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            return;
          }
        },
      },
    },
  );
};

export type AppSupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;