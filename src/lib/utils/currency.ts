import { DEFAULT_CURRENCY_CODE, DEFAULT_CURRENCY_LOCALE } from "@/config/app";

export const formatCurrency = (
  value: number,
  options?: {
    currency?: string;
    locale?: string;
  },
): string => {
  return new Intl.NumberFormat(options?.locale ?? DEFAULT_CURRENCY_LOCALE, {
    currency: options?.currency ?? DEFAULT_CURRENCY_CODE,
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
    style: "currency",
  }).format(value);
};

export const parseCurrencyInput = (value: string): number => {
  const normalized = value.replace(/[^0-9,-]/g, "").replace(/,/g, ".");
  const parsed = Number.parseFloat(normalized);

  return Number.isFinite(parsed) ? parsed : 0;
};
