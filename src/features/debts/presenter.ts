import { isDebtSettled } from "@/lib/debt/summary";
import type { Debt, DebtStatusFilter, DebtType } from "@/types/debt";

export const getDebtTypeLabel = (type: DebtType) => {
  return type === "owed_to_me" ? "Dihutang ke Saya" : "Saya Hutang";
};

export const getDebtStatusLabel = (debt: Pick<Debt, "settledAt">) => {
  return isDebtSettled(debt.settledAt) ? "Lunas" : "Belum Lunas";
};

export const getDebtStatusVariant = (debt: Pick<Debt, "settledAt">) => {
  return isDebtSettled(debt.settledAt)
    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
    : "bg-amber-50 text-amber-700 ring-amber-200";
};


export const matchesDebtStatusFilter = (
  debt: Pick<Debt, "settledAt">,
  filter: DebtStatusFilter,
) => {
  if (filter === "all") {
    return true;
  }

  if (filter === "paid") {
    return isDebtSettled(debt.settledAt);
  }

  return !isDebtSettled(debt.settledAt);
};