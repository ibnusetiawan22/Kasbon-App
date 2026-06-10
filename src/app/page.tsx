import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/session";
import { ROUTES } from "@/config/routes";

export default async function RootPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(ROUTES.dashboard);
  } else {
    redirect(ROUTES.login);
  }
}