"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, FilePlus2, LoaderCircle } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <div className="flex items-center gap-5">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              <FilePlus2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Catat Kasbon Baru</h1>
              <p className="mt-1 text-base text-slate-600">
                Tambahkan catatan hutang atau piutang baru untuk memantau pembayaran dengan lebih
                mudah.
              </p>
            </div>
          </div>

          <form
            className="space-y-4"
            onSubmit={async (event) => {
              event.preventDefault();
              await handleSubmit(new FormData(event.currentTarget));
            }}
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="space-y-8">
                {/* Section 1: Info Dasar */}
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-slate-700">Tipe</span>
                      <select
                        name="type"
                        defaultValue="owed_to_me"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                      >
                        <option value="owed_to_me">Dihutang ke saya</option>
                        <option value="i_owe">Saya hutang</option>
                      </select>
                      {fieldErrors.type ? (
                        <p className="text-xs text-red-600">{fieldErrors.type}</p>
                      ) : null}
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-slate-700">Nama orang</span>
                      <input
                        name="counterpartName"
                        required
                        placeholder="Contoh: Budi"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                      />
                      <p className="text-xs text-slate-500">
                        Siapa yang berhutang atau memberi pinjaman?
                      </p>
                      {fieldErrors.counterpartName ? (
                        <p className="text-xs text-red-600">{fieldErrors.counterpartName}</p>
                      ) : null}
                    </label>
                  </div>
                </div>

                {/* Section 2: Nominal & Tanggal */}
                <div className="space-y-5 border-t border-slate-200 pt-8">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Nominal Kasbon</span>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-lg font-semibold text-slate-500">
                        Rp
                      </span>
                      <input
                        name="amount"
                        required
                        min={1}
                        step={1}
                        type="number"
                        placeholder="100.000"
                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-12 text-lg font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Masukkan jumlah kasbon dalam Rupiah.
                    </p>
                    {fieldErrors.amount ? (
                      <p className="text-xs text-red-600">{fieldErrors.amount}</p>
                    ) : null}
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Jatuh Tempo</span>
                    <input
                      name="dueDate"
                      type="date"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    />
                  </label>
                </div>

                {/* Section 3: Catatan */}
                <div className="space-y-5 border-t border-slate-200 pt-8">
                  <label className="block space-y-1.5">
                    <span className="text-sm font-medium text-slate-700">Catatan</span>
                    <textarea
                      name="note"
                      rows={4}
                      placeholder="Tulis catatan tambahan di sini..."
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                    />
                    <p className="text-xs text-slate-500">Opsional</p>
                    {fieldErrors.note ? (
                      <p className="text-xs text-red-600">{fieldErrors.note}</p>
                    ) : null}
                  </label>
                </div>
              </div>

              {formError ? (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href={ROUTES.dashboard}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:flex-initial sm:px-8"
              >
                Kembali
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-initial"
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
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}