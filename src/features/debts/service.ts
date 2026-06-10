import { ZodError } from "zod";

import {
  createDebtInputSchema,
  debtListQuerySchema,
  debtRowSchema,
  updateDebtSchema,
} from "@/schemas/debt.schema";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DebtRepository } from "@/features/debts/repository";
import {
  mapCreateDebtToInsert,
  mapDebtRowToDebt,
  mapUpdateDebtToUpdate,
} from "@/features/debts/mapper";

export class DebtServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "DebtServiceError";
  }
}

const getFirstZodError = (error: ZodError) => {
  const flattened = error.flatten();

  for (const messages of Object.values(flattened.fieldErrors)) {
    const firstMessage = messages?.[0];
    if (firstMessage) {
      return firstMessage;
    }
  }

  return flattened.formErrors[0] ?? "Data tidak valid.";
};

const ensureAuthenticatedUserId = (userId: string | null | undefined) => {
  if (!userId) {
    throw new DebtServiceError("Anda harus login terlebih dahulu.", 401);
  }

  return userId;
};

const createRepository = async () => {
  const supabase = await createSupabaseServerClient();
  return new DebtRepository(supabase);
};

export const listDebts = async (
  userId: string | null | undefined,
  rawQuery: Record<string, string | undefined>,
) => {
  const authenticatedUserId = ensureAuthenticatedUserId(userId);
  const parsedQuery = debtListQuerySchema.safeParse(rawQuery);

  if (!parsedQuery.success) {
    throw new DebtServiceError(getFirstZodError(parsedQuery.error), 400);
  }

  const repository = await createRepository();
  const { data, error } = await repository.listByUser(
    authenticatedUserId,
    parsedQuery.data,
  );

  if (error) {
    throw new DebtServiceError("Gagal mengambil data kasbon.", 500);
  }

  return data.map((row) => mapDebtRowToDebt(debtRowSchema.parse(row)));
};

export const createDebt = async (
  userId: string | null | undefined,
  rawInput: unknown,
) => {
  const authenticatedUserId = ensureAuthenticatedUserId(userId);
  const parsedInput = createDebtInputSchema.safeParse(rawInput);

  if (!parsedInput.success) {
    throw new DebtServiceError(getFirstZodError(parsedInput.error), 400);
  }

  const repository = await createRepository();
  const { data, error } = await repository.create(
    mapCreateDebtToInsert(parsedInput.data, authenticatedUserId),
  );

  if (error) {
    throw new DebtServiceError("Gagal menyimpan data kasbon.", 500);
  }

  return mapDebtRowToDebt(debtRowSchema.parse(data));
};

export const updateDebt = async (
  userId: string | null | undefined,
  debtId: string,
  rawInput: unknown,
) => {
  const authenticatedUserId = ensureAuthenticatedUserId(userId);
  const parsedInput = updateDebtSchema.safeParse(rawInput);

  if (!parsedInput.success) {
    throw new DebtServiceError(getFirstZodError(parsedInput.error), 400);
  }

  const repository = await createRepository();
  const { data, error } = await repository.updateById(
    debtId,
    authenticatedUserId,
    mapUpdateDebtToUpdate(parsedInput.data),
  );

  if (error) {
    throw new DebtServiceError("Gagal memperbarui data kasbon.", 500);
  }

  if (!data) {
    throw new DebtServiceError("Data kasbon tidak ditemukan.", 404);
  }

  return mapDebtRowToDebt(debtRowSchema.parse(data));
};

export const deleteDebt = async (
  userId: string | null | undefined,
  debtId: string,
) => {
  const authenticatedUserId = ensureAuthenticatedUserId(userId);
  const repository = await createRepository();
  const { error, count } = await repository.deleteById(debtId, authenticatedUserId);

  if (error) {
    throw new DebtServiceError("Gagal menghapus data kasbon.", 500);
  }

  if (count === 0) {
    throw new DebtServiceError("Data kasbon tidak ditemukan.", 404);
  }
};
