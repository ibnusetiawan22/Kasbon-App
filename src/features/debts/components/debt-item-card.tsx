"use client";

import { CalendarClock, CheckCircle2, CircleDollarSign, Pencil, Trash2 } from "lucide-react";

import { formatCurrency } from "@/lib/utils/currency";
import type { Debt } from "@/types/debt";
import { formatDate } from "@/lib/utils/date";
import { formatRelativeTime } from "@/lib/utils/relative-time";
import {
  getDebtStatusLabel,
  getDebtStatusVariant,
  getDebtTypeLabel,
} from "@/features/debts/presenter";

interface DebtItemCardProps {
  debt: Debt;
  isDeleting: boolean;
  isUpdating: boolean;
  onDelete: (debt: Debt) => Promise<void>;
  onEdit: (debt: Debt) => void;
  onSettle: (debt: Debt) => Promise<void>;
}

export function DebtItemCard({
  debt,
  isDeleting,
  isUpdating,
  onDelete,
  onEdit,
  onSettle,
}: DebtItemCardProps) {
  const isSettled = debt.settledAt !== null;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <h3 className="text-base font-semibold text-slate-900">{debt.counterpartName}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
              {getDebtTypeLabel(debt.type)}
            </span>
            <span
              className={`rounded-full px-2.5 py-1 font-medium ring-1 ${getDebtStatusVariant(
                debt,
              )}`}
            >
              {getDebtStatusLabel(debt)}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(debt.amount)}</p>
          <p className="mt-0.5 text-xs text-slate-500" title={new Date(debt.createdAt).toLocaleString()}>
            {formatRelativeTime(debt.createdAt)}
          </p>
        </div>
      </div>

      {debt.note ? <p className="mt-4 text-sm leading-6 text-slate-600">{debt.note}</p> : null}

      <div className="mt-5 flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={isSettled || isUpdating}
            onClick={() => void onSettle(debt)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-200"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isSettled ? "Sudah Lunas" : "Tandai Lunas"}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => onEdit(debt)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>

            <button
              type="button"
              disabled={isDeleting}
              onClick={() => void onDelete(debt)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              Hapus
            </button>
          </div>
        </div>

        <div className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-2.5 text-sm text-slate-500">
          <CalendarClock className="h-4 w-4" />
          {debt.dueDate
            ? `Jatuh tempo ${formatDate(debt.dueDate)}`
            : "Tanpa jatuh tempo"}
        </div>
      </div>
    </article>
  );
}