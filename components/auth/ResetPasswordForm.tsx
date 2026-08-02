"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { resetPasswordAction } from "@/core/auth/actions";
import { initialFormState } from "@/core/auth/form-state";
import type { AuthVariant } from "@/components/layouts/AuthScreen";
import { Alert } from "@/components/ui/Alert";
import { PasswordField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/Button";
import { PasswordRules } from "./PasswordRules";

export function ResetPasswordForm({
  variant,
  token,
}: {
  variant: AuthVariant;
  token: string;
}) {
  const [state, formAction] = useActionState(
    resetPasswordAction,
    initialFormState,
  );
  const size = variant === "mobile" ? "lg" : "md";
  const errors = state.fieldErrors ?? {};
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!token) {
    return (
      <Alert tone="error">
        Bağlantı geçersiz görünüyor.{" "}
        <Link
          href="/forgot-password"
          className="font-medium underline underline-offset-2"
        >
          Yeni bir yenileme bağlantısı isteyin.
        </Link>
      </Alert>
    );
  }

  return (
    <div className="space-y-5">
      {state.status === "error" && state.message && (
        <Alert tone="error">{state.message}</Alert>
      )}

      <form action={formAction} className="space-y-4" noValidate>
        <input type="hidden" name="token" value={token} />

        <PasswordField
          label="Yeni şifre"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          fieldSize={size}
          error={errors.password}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <PasswordRules />

        <PasswordField
          label="Yeni şifre tekrarı"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          fieldSize={size}
          error={errors.confirmPassword}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        <SubmitButton buttonSize={size} pendingLabel="Şifre güncelleniyor…">
          Şifreyi güncelle
        </SubmitButton>
      </form>
    </div>
  );
}
