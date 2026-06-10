"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import type { Debt, DebtType } from "@/types/debt";

interface DebtEditDialogProps {
  debt: Debt | null;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    amount: number;
    counterpartName: string;
    dueDate: string | null;
    note: string | null;
    settledAt: string | null;
    type: DebtType;
  }) => Promise<void>;
}

interface FormValues {
  amount: string;
  counterpartName: string;
  dueDate: string;
  note: string;
  settled: boolean;
  type: DebtType;
}

const createFormValues = (debt: Debt): FormValues => {
  return {
    amount: String(debt.amount),
    counterpartName: debt.counterpartName,
    dueDate: debt.dueDate ?? "",
    note: debt.note ?? "",
    settled: debt.settledAt !== null,
    type: debt.type,
  };
};

export function DebtEditDialog({
  debt,
  isSaving,
  onClose,
  onSubmit,
}: DebtEditDialogProps) {
  const [formValues, setFormValues] = useState<FormValues | null>(
    debt ? createFormValues(debt) : null,
  );

  useEffect(() => {
    setFormValues(debt ? createFormValues(debt) : null);
  }, [debt]);

  if (!debt || !formValues) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-slate-950/45 p-4 sm:items-center sm:justify-center">
      <div className="w-full rounded-3xl bg-white p-5 shadow-2xl sm:max-w-lg">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Edit Kasbon</h2>
            <p className="text-sm text-slate-500">Perbarui detail kasbon sesuai kebutuhan.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();

            await onSubmit({
              amount: Number(formValues.amount),
              counterpartName: formValues.counterpartName,
              dueDate: formValues.dueDate || null,
              note: formValues.note.trim() ? formValues.note : null,
              settledAt: formValues.settled ? new Date().toISOString() : null,
              type: formValues.type,
            });
          }}
        >
          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Nama orang</span>
            <input
              required
              value={formValues.counterpartName}
              onChange={(event) =>
                setFormValues((current) =>
                  current
                    ? { ...current, counterpartName: event.target.value }
                    : current,
                )
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Tipe</span>
              <select
                value={formValues.type}
                onChange={(event) =>
                  setFormValues((current) =>
                    current
                      ? { ...current, type: event.target.value as DebtType }
                      : current,
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              >
                <option value="owed_to_me">Dihutang ke Saya</option>
                <option value="i_owe">Saya Hutang</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-700">Jumlah</span>
              <input
                required
                min={1}
                step={1}
                type="number"
                value={formValues.amount}
                onChange={(event) =>
                  setFormValues((current) =>
                    current ? { ...current, amount: event.target.value } : current,
                  )
                }
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Jatuh tempo</span>
            <input
              type="date"
              value={formValues.dueDate}
              onChange={(event) =>
                setFormValues((current) =>
                  current ? { ...current, dueDate: event.target.value } : current,
                )
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-slate-700">Catatan</span>
            <textarea
              rows={4}
              value={formValues.note}
              onChange={(event) =>
                setFormValues((current) =>
                  current ? { ...current, note: event.target.value } : current,
                )
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
            <input
              type="checkbox"
              checked={formValues.settled}
              onChange={(event) =>
                setFormValues((current) =>
                  current ? { ...current, settled: event.target.checked } : current,
                )
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            <span className="text-sm text-slate-700">Tandai sebagai lunas</span>
          </label>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}