"use client";

import type { ReactNode } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";

import type { AuthFormState } from "@/lib/auth/form-state";

interface AuthFormProps {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  alternateHref: string;
  alternateLabel: string;
  alternateText: string;
  description: string;
  fields: ReactNode;
  submitLabel: string;
  title: string;
  redirectTo?: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Memproses..." : label}
    </button>
  );
}

export function AuthForm({
  action,
  alternateHref,
  alternateLabel,
  alternateText,
  description,
  fields,
  redirectTo,
  submitLabel,
  title,
}: AuthFormProps) {
  const [state, formAction] = useActionState(action, { error: null });

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-600">{description}</p>
      </div>

      <form action={formAction} className="space-y-4">
        {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}
        {fields}

        {state.error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}

        <SubmitButton label={submitLabel} />
      </form>

      <p className="mt-6 text-sm text-slate-600">
        {alternateText}{" "}
        <Link href={alternateHref} className="font-medium text-slate-900 hover:underline">
          {alternateLabel}
        </Link>
      </p>
    </div>
  );
}
