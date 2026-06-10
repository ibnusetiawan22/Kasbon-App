"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";
import { z } from "zod";

import { ROUTES } from "@/config/routes";

const debtCreateFormSchema = z.object({
  type: z.enum(["owed_to_me", "i_owe"]),
  counterpartName: z.string().trim().min(1, "Nama orang wajib diisi").max(255),
  amount: z.coerce.number().int().positive("Nominal harus lebih dari 0"),
  dueDate: z.string().date().optional().or(z.literal("")),
  note: z.string().max(5000).optional().or(z.literal("")),
});

type DebtCreateFormValues = z.infer<typeof debtCreateFormSchema>;

type FormErrors = Partial<Record<keyof DebtCreateFormValues, string>>;

export function DebtCreateForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  const handleSubmit = async (formData: FormData) => {
    setFormError(null);
    setFieldErrors({});

    const parsed = debtCreateFormSchema.safeParse({
      type: formData.get("type"),
      counterpartName: formData.get("counterpartName"),
      amount: formData.get("amount"),
      dueDate: formData.get("dueDate"),
      note: formData.get("note"),
    });

    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      setFieldErrors({
        amount: flattened.fieldErrors.amount?.[0],
        counterpartName: flattened.fieldErrors.counterpartName?.[0],
        dueDate: flattened.fieldErrors.dueDate?.[0],
        note: flattened.fieldErrors.note?.[0],
        type: flattened.fieldErrors.type?.[0],
      });
      setFormError(flattened.formErrors[0] ?? "Data belum valid.");
      return;
    }

    setIsSubmitting(true);

    try {
      const values = parsed.data;

      const response = await fetch("/api/debts", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: values.type,
          counterpartName: values.counterpartName,
          amount: values.amount,
          dueDate: values.dueDate ? values.dueDate : null,
          note: values.note?.trim() ? values.note.trim() : null,
        }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Gagal menyimpan data kasbon.");
      }

      router.replace(ROUTES.dashboard);
      router.refresh();
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Gagal menyimpan data kasbon.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Catat Kasbon Baru</h1>
          <p className="mt-1 text-sm text-slate-600">
            Isi data kasbon untuk menambahkan catatan baru ke dashboard.
          </p>
        </div>
        <Link
          href={ROUTES.dashboard}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
      </div>

      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          await handleSubmit(new FormData(event.currentTarget));
        }}
      >
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Tipe</span>
          <select
            name="type"
            defaultValue="owed_to_me"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          >
            <option value="owed_to_me">Dihutang ke saya</option>
            <option value="i_owe">Saya hutang</option>
          </select>
          {fieldErrors.type ? (
            <p className="text-xs text-red-600">{fieldErrors.type}</p>
          ) : null}
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Nama orang</span>
          <input
            name="counterpartName"
            required
            placeholder="Contoh: Andi"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          />
          {fieldErrors.counterpartName ? (
            <p className="text-xs text-red-600">{fieldErrors.counterpartName}</p>
          ) : null}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Nominal</span>
            <input
              name="amount"
              required
              min={1}
              step={1}
              type="number"
              placeholder="50000"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            />
            {fieldErrors.amount ? (
              <p className="text-xs text-red-600">{fieldErrors.amount}</p>
            ) : null}
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Jatuh tempo</span>
            <input
              name="dueDate"
              type="date"
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500"
            />
            {fieldErrors.dueDate ? (
              <p className="text-xs text-red-600">{fieldErrors.dueDate}</p>
            ) : null}
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Catatan</span>
          <textarea
            name="note"
            rows={4}
            placeholder="Opsional"
            className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500"
          />
          {fieldErrors.note ? (
            <p className="text-xs text-red-600">{fieldErrors.note}</p>
          ) : null}
        </label>

        {formError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            "Simpan Kasbon"
          )}
        </button>
      </form>
    </section>
  );
}