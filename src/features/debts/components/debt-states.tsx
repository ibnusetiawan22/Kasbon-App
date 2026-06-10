import { AlertCircle, FileText, Inbox, Plus, RefreshCcw } from "lucide-react";
import Link from "next/link";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function DebtLoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white shadow-sm"
        />
      ))}
    </div>
  );
}

export function DebtEmptyState() {
  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-12">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <FileText className="h-8 w-8 text-slate-500" />
      </div>
      <h2 className="mt-6 text-2xl font-bold text-slate-900">
        Belum ada kasbon
      </h2>
      <p className="mx-auto mt-2 max-w-xs text-sm text-slate-500">
        Mulai catat hutang dan piutang pertama kamu supaya lebih mudah
        dipantau.
      </p>
      <Link
        href="/dashboard/new"
        className="mt-8 inline-flex min-w-[220px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm text-white shadow-sm transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      >
        <Plus className="h-5 w-5 shrink-0 text-white" />
        <span className="font-semibold text-white">Tambah Kasbon</span>
      </Link>
    </div>
  );
}

export function DebtErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-red-500">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold text-red-900">Gagal memuat dashboard</h2>
      <p className="mt-2 text-sm text-red-700">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
      >
        <RefreshCcw className="h-4 w-4" />
        Coba lagi
      </button>
    </div>
  );
}