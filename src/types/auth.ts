import type { Timestamp } from "@/types/common";

export interface AppUserProfile {
  avatarUrl: string | null;
  createdAt: Timestamp;
  email: string | null;
  fullName: string | null;
  id: string;
  updatedAt: Timestamp;
}

export interface AuthSessionUser {
  avatarUrl: string | null;
  email: string | null;
  fullName: string | null;
  id: string;
}

export interface RegisterFormValues {
  email: string;
  password: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}
