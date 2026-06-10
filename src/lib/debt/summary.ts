import type { DebtType } from "@/types/debt";

export interface DebtSummaryTotals {
  netBalance: number;
  settledCount: number;
  totalIowe: number;
  totalOwedToMe: number;
  openCount: number;
}

export interface DebtRecordForSummary {
  amount: number;
  settledAt: string | null;
  type: DebtType;
}

export const calculateDebtSummary = (
  debts: readonly DebtRecordForSummary[],
): DebtSummaryTotals => {
  return debts.reduce<DebtSummaryTotals>(
    (totals, debt) => {
      if (debt.type === "owed_to_me") {
        totals.totalOwedToMe += debt.amount;
      }

      if (debt.type === "i_owe") {
        totals.totalIowe += debt.amount;
      }

      if (debt.settledAt === null) {
        totals.openCount += 1;
      } else {
        totals.settledCount += 1;
      }

      totals.netBalance = totals.totalOwedToMe - totals.totalIowe;

      return totals;
    },
    {
      netBalance: 0,
      settledCount: 0,
      totalIowe: 0,
      totalOwedToMe: 0,
      openCount: 0,
    },
  );
};

export const isDebtSettled = (settledAt: string | null): boolean => {
  return settledAt !== null;
};
