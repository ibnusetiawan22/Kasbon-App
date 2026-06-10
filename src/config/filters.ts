import type {
  DebtStatusFilter,
  DebtType,
  DebtTypeFilter,
  FilterOption,
} from "@/types/debt";

export const DEBT_STATUS_FILTERS: readonly FilterOption<DebtStatusFilter>[] = [
  { value: "all", label: "Semua" },
  { value: "paid", label: "Lunas" },
  { value: "unpaid", label: "Belum lunas" },
] as const;

export const DEBT_TYPE_FILTERS: readonly FilterOption<DebtTypeFilter>[] = [
  { value: "all", label: "Semua" },
  { value: "owed_to_me", label: "Dihutang ke saya" },
  { value: "i_owe", label: "Saya berhutang" },
] as const;

export const isDebtStatusFilter = (value: string): value is DebtStatusFilter => {
  return value === "all" || value === "paid" || value === "unpaid";
};

export const isDebtType = (value: string): value is DebtType => {
  return value === "owed_to_me" || value === "i_owe";
};
