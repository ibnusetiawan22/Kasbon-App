import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { publicEnv } from "@/config/env";
import {
  AUTH_ERROR_MESSAGES,
} from "@/lib/auth/constants";
import {
  DEFAULT_AUTH_REDIRECT,
  DEFAULT_UNAUTH_REDIRECT,
  isProtectedRoute,
  isPublicRoute,
} from "@/config/routes";
import type { Database } from "@/types/database";

type MiddlewareCookie = {
  name: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
  value: string;
};

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: MiddlewareCookie[]) {
          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const publicRoute = isPublicRoute(pathname);
  const protectedRoute = isProtectedRoute(pathname);

  if (protectedRoute && !user) {
    const redirectUrl = new URL(DEFAULT_UNAUTH_REDIRECT, request.url);
    redirectUrl.searchParams.set("error", AUTH_ERROR_MESSAGES.unauthenticated);
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (publicRoute && user) {
    return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, request.url));
  }

  if (!user && pathname === "/") {
    const redirectUrl = new URL(DEFAULT_UNAUTH_REDIRECT, request.url);
    redirectUrl.searchParams.set("next", DEFAULT_AUTH_REDIRECT);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && pathname === "/") {
    return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT, request.url));
  }

  return response;
}
