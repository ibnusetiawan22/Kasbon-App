export const DEBT_SORT_OPTIONS = [
  { label: "Terbaru", value: "newest" },
  { label: "Terlama", value: "oldest" },
  { label: "Nominal Terbesar", value: "amount-desc" },
  { label: "Nominal Terkecil", value: "amount-asc" },
] as const;

export type DebtSortOption = (typeof DEBT_SORT_OPTIONS)[number]["value"];