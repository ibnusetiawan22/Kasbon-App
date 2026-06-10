import Link from "next/link";

import { ROUTES } from "@/config/routes";
import { registerAction } from "@/lib/auth/actions";
import { AuthForm } from "@/lib/auth/auth-form";

interface RegisterPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const error = resolvedSearchParams?.error ?? null;

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <AuthForm
        action={registerAction}
        alternateHref={ROUTES.login}
        alternateLabel="Login"
        alternateText="Sudah punya akun?"
        description="Buat akun baru untuk mulai mencatat hutang piutang pribadi."
        submitLabel="Daftar"
        title="Register"
        fields={
          <>
            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Email</span>
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-0 transition focus:border-slate-500"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">Kata sandi</span>
              <input
                required
                minLength={8}
                type="password"
                name="password"
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-0 transition focus:border-slate-500"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-sm font-medium text-slate-700">
                Konfirmasi kata sandi
              </span>
              <input
                required
                minLength={8}
                type="password"
                name="confirmPassword"
                autoComplete="new-password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-0 transition focus:border-slate-500"
              />
            </label>
          </>
        }
      />

      <p className="text-center text-xs text-slate-500">
        Sudah punya akun? <Link href={ROUTES.login} className="underline">Masuk di sini</Link>
      </p>
    </div>
  );
}
