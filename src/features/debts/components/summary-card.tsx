import type { ReactNode } from "react";

interface SummaryCardProps {
  accentClassName?: string;
  icon: ReactNode;
  label: string;
  value: string;
}

export function SummaryCard({
  accentClassName = "text-slate-900",
  icon,
  label,
  value,
}: SummaryCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-slate-500">{label}</div>
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">{icon}</div>
      </div>
      <p className={`text-xl font-semibold sm:text-2xl ${accentClassName}`}>{value}</p>
    </article>
  );
}
