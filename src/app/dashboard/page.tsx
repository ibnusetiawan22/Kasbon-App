import { redirect } from "next/navigation";

import { DashboardClient } from "@/features/debts/components/dashboard-client";
import { LogoutButton } from "@/lib/auth/logout-button";
import { getCurrentUser } from "@/lib/auth/session";
import { ROUTES } from "@/config/routes";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(ROUTES.login);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-end">
          <LogoutButton label="Keluar" />
        </div>

        <DashboardClient
          userDisplayName={user.fullName ?? user.email ?? "Pengguna Kasbon"}
          userEmail={user.email ?? ""}
        />
      </div>
    </main>
  );
}