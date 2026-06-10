import { DebtLoadingState } from "@/features/debts/components/debt-states";

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 h-10 w-28 animate-pulse rounded-xl bg-slate-200" />
        <div className="mb-6 h-40 animate-pulse rounded-3xl bg-slate-200" />
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
        <DebtLoadingState />
      </div>
    </main>
  );
}
