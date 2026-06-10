import { DEFAULT_AUTH_REDIRECT } from "@/config/routes";

export const AUTH_ERROR_MESSAGES = {
  invalidCredentials: "Email atau kata sandi salah.",
  invalidEmail: "Format email tidak valid.",
  passwordMin: "Kata sandi minimal 8 karakter.",
  emailRequired: "Email wajib diisi.",
  passwordRequired: "Kata sandi wajib diisi.",
  confirmPasswordRequired: "Konfirmasi kata sandi wajib diisi.",
  passwordMismatch: "Konfirmasi kata sandi tidak cocok.",
  registerFailed: "Pendaftaran gagal. Silakan coba lagi.",
  loginFailed: "Login gagal. Silakan coba lagi.",
  logoutFailed: "Logout gagal. Silakan coba lagi.",
  alreadyLoggedIn: "Anda sudah login.",
  unauthenticated: "Silakan login untuk melanjutkan.",
} as const;

export const AUTH_SUCCESS_MESSAGES = {
  register: "Registrasi berhasil. Silakan cek email Anda untuk verifikasi.",
} as const;

export const AUTH_DEFAULT_REDIRECT = DEFAULT_AUTH_REDIRECT;
