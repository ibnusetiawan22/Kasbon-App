import { redirect } from "next/navigation";

import { AUTH_DEFAULT_REDIRECT } from "@/lib/auth/constants";

const isSafeRedirectPath = (value: string | null | undefined) => {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//");
};

export const getRedirectTo = (value: FormDataEntryValue | string | null | undefined) => {
  if (typeof value !== "string") {
    return AUTH_DEFAULT_REDIRECT;
  }

  return isSafeRedirectPath(value) ? value : AUTH_DEFAULT_REDIRECT;
};

export const redirectWithMessage = (
  pathname: string,
  params: Record<string, string>,
) => {
  const searchParams = new URLSearchParams(params);
  redirect(`${pathname}?${searchParams.toString()}`);
};
