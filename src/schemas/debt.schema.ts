import { z } from "zod";

const debtTypeValues = ["owed_to_me", "i_owe"] as const;
const debtStatusValues = ["all", "paid", "unpaid"] as const;

export const debtTypeSchema = z.enum(debtTypeValues);
export const debtStatusSchema = z.enum(debtStatusValues);

export const debtRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  type: debtTypeSchema,
  counterpart_name: z.string().trim().min(1),
  amount: z.number().int().positive().safe(),
  note: z.string().max(5_000).nullable(),
  due_date: z.string().date().nullable(),
  settled_at: z.string().datetime({ offset: true }).nullable(),
  created_at: z.string().datetime({ offset: true }),
  updated_at: z.string().datetime({ offset: true }),
});

export const createDebtSchema = z.object({
  userId: z.string().uuid(),
  type: debtTypeSchema,
  counterpartName: z.string().trim().min(1).max(255),
  amount: z.number().int().positive().safe(),
  note: z.string().max(5_000).nullable().optional(),
  dueDate: z.string().date().nullable().optional(),
  settledAt: z.string().datetime({ offset: true }).nullable().optional(),
});

export const createDebtInputSchema = createDebtSchema.omit({
  userId: true,
});

export const updateDebtSchema = z
  .object({
    type: debtTypeSchema.optional(),
    counterpartName: z.string().trim().min(1).max(255).optional(),
    amount: z.number().int().positive().safe().optional(),
    note: z.string().max(5_000).nullable().optional(),
    dueDate: z.string().date().nullable().optional(),
    settledAt: z.string().datetime({ offset: true }).nullable().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "Minimal satu field harus diisi.",
  });

export const debtListQuerySchema = z.object({
  status: debtStatusSchema.optional().default("all"),
  type: debtTypeSchema.optional(),
});

export type DebtRowSchema = z.infer<typeof debtRowSchema>;
export type CreateDebtSchema = z.infer<typeof createDebtSchema>;
export type CreateDebtInputSchema = z.infer<typeof createDebtInputSchema>;
export type UpdateDebtSchema = z.infer<typeof updateDebtSchema>;
export type DebtListQuerySchema = z.infer<typeof debtListQuerySchema>;
