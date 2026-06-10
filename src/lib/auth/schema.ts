import { z } from "zod";

import { AUTH_ERROR_MESSAGES } from "@/lib/auth/constants";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, AUTH_ERROR_MESSAGES.emailRequired)
    .email(AUTH_ERROR_MESSAGES.invalidEmail),
  password: z
    .string()
    .min(1, AUTH_ERROR_MESSAGES.passwordRequired)
    .min(8, AUTH_ERROR_MESSAGES.passwordMin),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z
      .string()
      .min(1, AUTH_ERROR_MESSAGES.confirmPasswordRequired),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: AUTH_ERROR_MESSAGES.passwordMismatch,
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
