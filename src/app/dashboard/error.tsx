"use client";

import { DebtErrorState } from "@/features/debts/components/debt-states";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <DebtErrorState
          message={error.message || "Terjadi kesalahan saat membuka dashboard."}
          onRetry={reset}
        />
      </div>
    </main>
  );
}
