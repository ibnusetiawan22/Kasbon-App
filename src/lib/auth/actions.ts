"use server";

import { redirect } from "next/navigation";
import type { ZodError } from "zod";

import {
  AUTH_ERROR_MESSAGES,
  AUTH_SUCCESS_MESSAGES,
} from "@/lib/auth/constants";
import type { AuthFormState } from "@/lib/auth/form-state";
import { initialAuthFormState } from "@/lib/auth/form-state";
import { loginSchema, registerSchema } from "@/lib/auth/schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRedirectTo, redirectWithMessage } from "@/lib/auth/utils";
import { ROUTES } from "@/config/routes";

const getFirstError = (error: ZodError) => {
  const fieldErrors = error.flatten().fieldErrors;

  for (const messages of Object.values(fieldErrors)) {
    const firstMessage = messages?.[0];

    if (firstMessage) {
      return firstMessage;
    }
  }

  return null;
};

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: getFirstError(parsed.error) ?? AUTH_ERROR_MESSAGES.loginFailed };
  }

  const redirectTo = getRedirectTo(formData.get("redirectTo"));
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      error:
        error.message.toLowerCase().includes("invalid login credentials")
          ? AUTH_ERROR_MESSAGES.invalidCredentials
          : AUTH_ERROR_MESSAGES.loginFailed,
    };
  }

  redirect(redirectTo);

  return initialAuthFormState;
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    confirmPassword: formData.get("confirmPassword"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: getFirstError(parsed.error) ?? AUTH_ERROR_MESSAGES.registerFailed,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { confirmPassword: _confirmPassword, ...credentials } = parsed.data;
const { data, error } = await supabase.auth.signUp({
  email: credentials.email,
  password: credentials.password,
});

console.log("SIGNUP DATA:", data);
console.error("SIGNUP ERROR:", error);

if (error) {
  return { error: error.message };
}

  redirectWithMessage(ROUTES.login, {
    message: AUTH_SUCCESS_MESSAGES.register,
  });

  return initialAuthFormState;
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirectWithMessage(ROUTES.login, {
      error: AUTH_ERROR_MESSAGES.logoutFailed,
    });
  }

  redirectWithMessage(ROUTES.login, {
    message: "Anda berhasil logout.",
  });
}
