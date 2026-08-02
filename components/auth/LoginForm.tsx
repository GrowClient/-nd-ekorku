"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { loginAction } from "@/core/auth/actions";
import { initialFormState } from "@/core/auth/form-state";
import type { AuthVariant } from "@/components/layouts/AuthScreen";
import { Alert } from "@/components/ui/Alert";
import { Checkbox } from "@/components/ui/Checkbox";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/Button";
import { GoogleButton } from "./GoogleButton";
import { AuthDivider } from "./AuthDivider";

export function LoginForm({
  variant,
  callbackUrl = "/dashboard",
  googleEnabled,
}: {
  variant: AuthVariant;
  callbackUrl?: string;
  googleEnabled: boolean;
}) {
  const [state, formAction] = useActionState(loginAction, initialFormState);
  const size = variant === "mobile" ? "lg" : "md";
  const errors = state.fieldErrors ?? {};

  // Alanlar kontrollü tutulur: sunucu hata döndüğünde girilen bilgiler kaybolmaz.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  return (
    <div className="space-y-5">
      {state.status === "error" && state.message && (
        <Alert tone="error">{state.message}</Alert>
      )}

      <form action={formAction} className="space-y-4" noValidate>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <TextField
          label="E-posta"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="ornek@firma.com"
          required
          fieldSize={size}
          error={errors.email}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <PasswordField
          label="Şifre"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          fieldSize={size}
          error={errors.password}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Checkbox
            name="remember"
            label="Beni hatırla"
            touchFriendly={variant === "mobile"}
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-brand-700 hover:text-brand-800 hover:underline"
          >
            Şifremi unuttum
          </Link>
        </div>

        <SubmitButton buttonSize={size} pendingLabel="Giriş yapılıyor…">
          Giriş yap
        </SubmitButton>
      </form>

      {googleEnabled && (
        <>
          <AuthDivider />
          <GoogleButton
            label="Google ile giriş yap"
            callbackUrl={callbackUrl}
            size={size}
          />
        </>
      )}
    </div>
  );
}
