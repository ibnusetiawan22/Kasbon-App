import type { Id, Nullable, Timestamp, WithTimestamps } from "@/types/common";

export type DebtType = "owed_to_me" | "i_owe";
export type DebtStatusFilter = "all" | "paid" | "unpaid";

export interface FilterOption<T extends string> {
  label: string;
  value: T;
}

export interface Debt extends WithTimestamps {
  amount: number;
  counterpartName: string;
  dueDate: Nullable<string>;
  id: Id;
  note: Nullable<string>;
  settledAt: Nullable<Timestamp>;
  type: DebtType;
  userId: Id;
}

export interface DebtInsert {
  amount: number;
  counterpartName: string;
  dueDate?: Nullable<string>;
  id?: Id;
  note?: Nullable<string>;
  settledAt?: Nullable<Timestamp>;
  type: DebtType;
  userId: Id;
}

export interface DebtUpdate {
  amount?: number;
  counterpartName?: string;
  dueDate?: Nullable<string>;
  note?: Nullable<string>;
  settledAt?: Nullable<Timestamp>;
  type?: DebtType;
}

export type DebtTypeFilter = "all" | DebtType;

export type DebtSortOption =
  | "newest"
  | "oldest"
  | "amount-desc"
  | "amount-asc";