"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { registerAction } from "@/core/auth/actions";
import { initialFormState } from "@/core/auth/form-state";
import type { AuthVariant } from "@/components/layouts/AuthScreen";
import { Alert } from "@/components/ui/Alert";
import { Checkbox } from "@/components/ui/Checkbox";
import { PasswordField, TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/Button";
import { GoogleButton } from "./GoogleButton";
import { AuthDivider } from "./AuthDivider";
import { PasswordRules } from "./PasswordRules";

const EMPTY = {
  firstName: "",
  lastName: "",
  organizationName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function RegisterForm({
  variant,
  googleEnabled,
}: {
  variant: AuthVariant;
  googleEnabled: boolean;
}) {
  const [state, formAction] = useActionState(registerAction, initialFormState);
  const size = variant === "mobile" ? "lg" : "md";
  const errors = state.fieldErrors ?? {};

  // Alanlar kontrollü tutulur: sunucu hata döndüğünde girilen bilgiler kaybolmaz.
  const [values, setValues] = useState(EMPTY);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const update =
    (field: keyof typeof EMPTY) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setValues((current) => ({ ...current, [field]: event.target.value }));

  return (
    <div className="space-y-5">
      {state.status === "error" && state.message && (
        <Alert tone="error">{state.message}</Alert>
      )}

      <form action={formAction} className="space-y-4" noValidate>
        <div
          className={
            variant === "desktop" ? "grid grid-cols-2 gap-4" : "space-y-4"
          }
        >
          <TextField
            label="Ad"
            name="firstName"
            autoComplete="given-name"
            placeholder="Ayşe"
            required
            fieldSize={size}
            error={errors.firstName}
            value={values.firstName}
            onChange={update("firstName")}
          />
          <TextField
            label="Soyad"
            name="lastName"
            autoComplete="family-name"
            placeholder="Yılmaz"
            required
            fieldSize={size}
            error={errors.lastName}
            value={values.lastName}
            onChange={update("lastName")}
          />
        </div>

        <TextField
          label="Firma / işletme adı"
          name="organizationName"
          autoComplete="organization"
          placeholder="Yılmaz Tekstil"
          required
          fieldSize={size}
          hint="Hesabınız bu firmaya sahip (OWNER) olarak bağlanır."
          error={errors.organizationName}
          value={values.organizationName}
          onChange={update("organizationName")}
        />

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
          value={values.email}
          onChange={update("email")}
        />

        <PasswordField
          label="Şifre"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          fieldSize={size}
          error={errors.password}
          value={values.password}
          onChange={update("password")}
        />

        <PasswordRules />

        <PasswordField
          label="Şifre tekrarı"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          required
          fieldSize={size}
          error={errors.confirmPassword}
          value={values.confirmPassword}
          onChange={update("confirmPassword")}
        />

        <Checkbox
          name="acceptTerms"
          touchFriendly={variant === "mobile"}
          error={errors.acceptTerms}
          checked={acceptTerms}
          onChange={(event) => setAcceptTerms(event.target.checked)}
          label={
            <>
              <Link
                href="/terms"
                className="font-medium text-brand-700 hover:underline"
              >
                Kullanım koşullarını
              </Link>{" "}
              okudum ve kabul ediyorum.
            </>
          }
        />

        <SubmitButton buttonSize={size} pendingLabel="Hesap oluşturuluyor…">
          Kayıt ol
        </SubmitButton>
      </form>

      {googleEnabled && (
        <>
          <AuthDivider />
          <GoogleButton label="Google ile devam et" size={size} />
        </>
      )}
    </div>
  );
}
