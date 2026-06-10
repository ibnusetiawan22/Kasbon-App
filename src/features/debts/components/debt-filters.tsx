"use client";

import { DEBT_STATUS_FILTERS, DEBT_TYPE_FILTERS } from "@/config/filters";
import type { DebtStatusFilter, DebtTypeFilter } from "@/types/debt";

interface DebtFiltersProps {
  status: DebtStatusFilter;
  type: DebtTypeFilter;
  onStatusChange: (value: DebtStatusFilter) => void;
  onTypeChange: (value: DebtTypeFilter) => void;
}

interface FilterSelectProps<T extends string> {
  label: string;
  options: readonly { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}

function FilterSelect<T extends string>({
  label,
  onChange,
  options,
  value,
}: FilterSelectProps<T>) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function DebtFilters({
  onStatusChange,
  onTypeChange,
  status,
  type,
}: DebtFiltersProps) {
  return (
    <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
      <FilterSelect
        label="Status"
        options={DEBT_STATUS_FILTERS}
        value={status}
        onChange={onStatusChange}
      />
      <FilterSelect
        label="Tipe"
        options={DEBT_TYPE_FILTERS}
        value={type}
        onChange={onTypeChange}
      />
    </section>
  );
}