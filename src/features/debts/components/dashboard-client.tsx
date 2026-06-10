"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Plus,
  Landmark,
  LoaderCircle,
  Search,
} from "lucide-react";

import { DebtFilters } from "@/features/debts/components/debt-filters";
import { DebtItemCard } from "@/features/debts/components/debt-item-card";
import { DebtEditDialog } from "@/features/debts/components/debt-edit-dialog";
import {
  DebtEmptyState,
  DebtErrorState,
  DebtLoadingState,
} from "@/features/debts/components/debt-states";
import { SummaryCard } from "@/features/debts/components/summary-card";
import { calculateDebtSummary } from "@/lib/debt/summary";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDisplayName } from "@/lib/utils/user";
import type {
  Debt,
  DebtStatusFilter,
  DebtTypeFilter,
  DebtSortOption,
} from "@/types/debt";

interface DashboardClientProps {
  userDisplayName: string;
  userEmail: string;
}

interface ApiResponse {
  data?: Debt[];
  error?: string;
}

const getQueryString = (status: DebtStatusFilter, type: DebtTypeFilter) => {
  const searchParams = new URLSearchParams();

  if (status !== "all") {
    searchParams.set("status", status);
  }

  if (type !== "all") {
    searchParams.set("type", type);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export function DashboardClient({
  userDisplayName,
  userEmail,
}: DashboardClientProps) {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [statusFilter, setStatusFilter] = useState<DebtStatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<DebtTypeFilter>("all");
  const [sortOption, setSortOption] = useState<DebtSortOption>("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeDebt, setActiveDebt] = useState<Debt | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [pendingSettleId, setPendingSettleId] = useState<string | null>(null);

  const fetchDebts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/debts${getQueryString(statusFilter, typeFilter)}`,
        {
          credentials: "include",
          method: "GET",
        },
      );
      const payload = (await response.json()) as ApiResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Gagal memuat data kasbon.");
      }

      setDebts(payload.data ?? []);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Gagal memuat data kasbon.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    void fetchDebts();
  }, [fetchDebts]);

  const processedDebts = useMemo(() => {
    const filtered = debts.filter((debt) => {
      const query = searchQuery.toLowerCase();
      const nameMatch = debt.counterpartName.toLowerCase().includes(query);
      const noteMatch = debt.note?.toLowerCase().includes(query) ?? false;
      return nameMatch || noteMatch;
    });

    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [debts, searchQuery, sortOption]);

  const summary = useMemo(() => calculateDebtSummary(debts), [debts]);

  const netBalanceClassName =
    summary.netBalance > 0
      ? "text-emerald-600"
      : summary.netBalance < 0
      ? "text-red-600"
      : "text-slate-900";

  const handleDelete = useCallback(
    async (debt: Debt) => {
      const confirmed = window.confirm(
        `Hapus kasbon dengan ${debt.counterpartName}? Tindakan ini tidak bisa dibatalkan.`,
      );

      if (!confirmed) {
        return;
      }

      setPendingDeleteId(debt.id);

      try {
        const response = await fetch(`/api/debts/${debt.id}`, {
          credentials: "include",
          method: "DELETE",
        });

        if (!response.ok) {
          const payload = (await response.json()) as ApiResponse;
          throw new Error(payload.error ?? "Gagal menghapus data kasbon.");
        }

        await fetchDebts();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal menghapus data kasbon.",
        );
      } finally {
        setPendingDeleteId(null);
      }
    },
    [fetchDebts],
  );

  const handleSettle = useCallback(
    async (debt: Debt) => {
      setPendingSettleId(debt.id);

      try {
        const response = await fetch(`/api/debts/${debt.id}`, {
          body: JSON.stringify({ settledAt: new Date().toISOString() }),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
        });
        const payload = (await response.json()) as ApiResponse;

        if (!response.ok) {
          throw new Error(
            payload.error ?? "Gagal menandai kasbon sebagai lunas.",
          );
        }

        await fetchDebts();
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Gagal menandai kasbon sebagai lunas.",
        );
      } finally {
        setPendingSettleId(null);
      }
    },
    [fetchDebts],
  );

  const handleEditSubmit = useCallback(
    async (payload: {
      amount: number;
      counterpartName: string;
      dueDate: string | null;
      note: string | null;
      settledAt: string | null;
      type: Debt["type"];
    }) => {
      if (!activeDebt) {
        return;
      }

      setIsSavingEdit(true);

      try {
        const response = await fetch(`/api/debts/${activeDebt.id}`, {
          body: JSON.stringify(payload),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          method: "PATCH",
        });
        const responsePayload = (await response.json()) as ApiResponse;

        if (!response.ok) {
          throw new Error(
            responsePayload.error ?? "Gagal memperbarui kasbon.",
          );
        }

        setActiveDebt(null);
        await fetchDebts();
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Gagal memperbarui kasbon.",
        );
      } finally {
        setIsSavingEdit(false);
      }
    },
    [activeDebt, fetchDebts],
  );

  return (
    <>
      <section className="space-y-8">
        <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-slate-900 p-6 text-white shadow-sm sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold">Halo 👋</h1>
            <p className="mt-1.5 text-lg text-slate-200">
              Selamat Datang{" "}
              <span className="font-semibold text-white">
                {formatDisplayName(userDisplayName)}
              </span>
            </p>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              Kelola hutang piutang pribadi, pantau status pembayaran, dan lihat
              ringkasan keuangan dalam satu dashboard.
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 sm:w-auto"
          >
            <Plus className="h-4 w-4 text-slate-900" />
            <span className="text-slate-900">Tambah Kasbon</span>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SummaryCard
            icon={<ArrowUpCircle className="h-5 w-5" />}
            label="Total dihutang ke saya"
            value={formatCurrency(summary.totalOwedToMe)}
            accentClassName="text-emerald-600"
          />
          <SummaryCard
            icon={<ArrowDownCircle className="h-5 w-5" />}
            label="Total saya hutang"
            value={formatCurrency(summary.totalIowe)}
            accentClassName="text-red-600"
          />
          <SummaryCard
            icon={<Landmark className="h-5 w-5" />}
            label="Net balance"
            value={formatCurrency(summary.netBalance)}
            accentClassName={netBalanceClassName}
          />
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau catatan..."
              className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-1 focus:ring-slate-400"
            />
          </div>

          <DebtFilters
            status={statusFilter}
            type={typeFilter}
            sort={sortOption}
            onStatusChange={setStatusFilter}
            onTypeChange={setTypeFilter}
            onSortChange={setSortOption}
          />
        </div>

        {errorMessage ? (
          <DebtErrorState
            message={errorMessage}
            onRetry={() => void fetchDebts()}
          />
        ) : isLoading ? (
          <DebtLoadingState />
        ) : processedDebts.length === 0 ? (
          <DebtEmptyState />
        ) : (
          <div className="space-y-3">
            {processedDebts.map((debt) => (
              <DebtItemCard
                key={debt.id}
                debt={debt}
                isDeleting={pendingDeleteId === debt.id}
                isUpdating={pendingSettleId === debt.id}
                onDelete={handleDelete}
                onEdit={setActiveDebt}
                onSettle={handleSettle}
              />
            ))}
          </div>
        )}
      </section>

      {activeDebt ? (
        <DebtEditDialog
          debt={activeDebt}
          isSaving={isSavingEdit}
          onClose={() => setActiveDebt(null)}
          onSubmit={handleEditSubmit}
        />
      ) : null}

      {(pendingDeleteId || pendingSettleId || isSavingEdit) && !isLoading ? (
        <div className="fixed bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white shadow-lg">
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Memperbarui data...
        </div>
      ) : null}
    </>
  );
}