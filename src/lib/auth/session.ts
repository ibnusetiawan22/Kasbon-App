import { cache } from "react";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AuthSessionUser } from "@/types/auth";

export const mapSessionUser = (
  user:
    | {
        email?: string | null;
        id: string;
        user_metadata?: Record<string, unknown>;
      }
    | null
    | undefined,
): AuthSessionUser | null => {
  if (!user) {
    return null;
  }

  const metadata = user.user_metadata ?? {};

  return {
    avatarUrl: typeof metadata.avatar_url === "string" ? metadata.avatar_url : null,
    email: user.email ?? null,
    fullName: typeof metadata.full_name === "string" ? metadata.full_name : null,
    id: user.id,
  };
};

export const getCurrentUser = cache(async (): Promise<AuthSessionUser | null> => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return mapSessionUser(user);
});

export const requireUser = cache(async (): Promise<AuthSessionUser> => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  return user;
});
