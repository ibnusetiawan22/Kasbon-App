import Link from "next/link";

import { ROUTES } from "@/config/routes";
import { loginAction } from "@/lib/auth/actions";
import { AuthForm } from "@/lib/auth/auth-form";

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const message = resolvedSearchParams?.message ?? null;
  const error = resolvedSearchParams?.error ?? null;
  const redirectTo = resolvedSearchParams?.next ?? ROUTES.dashboard;

  return (
    <div className="space-y-4">
      {message ? (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}

      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      ) : null}

      <AuthForm
        action={loginAction}
        alternateHref={ROUTES.register}
        alternateLabel="Daftar"
        alternateText="Belum punya akun?"
        description="Masuk untuk melanjutkan ke aplikasi Kasbon."
        redirectTo={redirectTo}
        submitLabel="Masuk"
        title="Login"
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
                type="password"
                name="password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-0 transition focus:border-slate-500"
              />
            </label>
          </>
        }
      />

      <p className="text-center text-xs text-slate-500">
        Dengan masuk, Anda menyetujui alur autentikasi berbasis Supabase SSR.
      </p>
      <p className="text-center text-xs text-slate-500">
        Butuh akun baru? <Link href={ROUTES.register} className="underline">Daftar di sini</Link>
      </p>
    </div>
  );
}
