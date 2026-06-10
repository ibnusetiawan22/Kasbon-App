import type {
  CreateDebtInputSchema,
  CreateDebtSchema,
  DebtRowSchema,
  UpdateDebtSchema,
} from "@/schemas/debt.schema";
import type { Database } from "@/types/database";
import type { Debt } from "@/types/debt";

type DebtRow = Database["public"]["Tables"]["debts"]["Row"];
type DebtInsert = Database["public"]["Tables"]["debts"]["Insert"];
type DebtUpdate = Database["public"]["Tables"]["debts"]["Update"];

const normalizeNullableText = (value: string | null | undefined) => {
  if (value === undefined || value === null) {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
};

export const mapDebtRowToDebt = (row: DebtRow | DebtRowSchema): Debt => {
  return {
    amount: row.amount,
    counterpartName: row.counterpart_name,
    createdAt: row.created_at,
    dueDate: row.due_date,
    id: row.id,
    note: row.note,
    settledAt: row.settled_at,
    type: row.type,
    updatedAt: row.updated_at,
    userId: row.user_id,
  };
};

export const mapCreateDebtToInsert = (
  input: CreateDebtInputSchema,
  userId: string,
): DebtInsert => {
  const payload: CreateDebtSchema = {
    ...input,
    userId,
  };

  return {
    amount: payload.amount,
    counterpart_name: payload.counterpartName,
    due_date: payload.dueDate ?? null,
    note: normalizeNullableText(payload.note),
    settled_at: payload.settledAt ?? null,
    type: payload.type,
    user_id: payload.userId,
  };
};

export const mapUpdateDebtToUpdate = (input: UpdateDebtSchema): DebtUpdate => {
  const payload: DebtUpdate = {};

  if (input.amount !== undefined) {
    payload.amount = input.amount;
  }

  if (input.counterpartName !== undefined) {
    payload.counterpart_name = input.counterpartName;
  }

  if (input.dueDate !== undefined) {
    payload.due_date = input.dueDate;
  }

  if (input.note !== undefined) {
    payload.note = normalizeNullableText(input.note);
  }

  if (input.settledAt !== undefined) {
    payload.settled_at = input.settledAt;
  }

  if (input.type !== undefined) {
    payload.type = input.type;
  }

  return payload;
};
