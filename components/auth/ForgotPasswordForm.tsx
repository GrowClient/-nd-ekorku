"use client";

import { useActionState, useState } from "react";

import { forgotPasswordAction } from "@/core/auth/actions";
import { initialFormState } from "@/core/auth/form-state";
import type { AuthVariant } from "@/components/layouts/AuthScreen";
import { Alert } from "@/components/ui/Alert";
import { TextField } from "@/components/ui/TextField";
import { SubmitButton } from "@/components/ui/Button";

export function ForgotPasswordForm({ variant }: { variant: AuthVariant }) {
  const [state, formAction] = useActionState(
    forgotPasswordAction,
    initialFormState,
  );
  const size = variant === "mobile" ? "lg" : "md";
  const errors = state.fieldErrors ?? {};
  const [email, setEmail] = useState("");

  return (
    <div className="space-y-5">
      {state.status === "error" && state.message && (
        <Alert tone="error">{state.message}</Alert>
      )}

      {state.status === "success" && (
        <Alert tone="success">
          <p>{state.message}</p>
          {state.devResetUrl && (
            <p className="mt-2 break-all">
              <span className="font-semibold">Geliştirme ortamı:</span> e-posta
              sağlayıcısı henüz yapılandırılmadı. Bağlantı:{" "}
              <a
                href={state.devResetUrl}
                className="font-medium underline underline-offset-2"
              >
                {state.devResetUrl}
              </a>
            </p>
          )}
        </Alert>
      )}

      <form action={formAction} className="space-y-4" noValidate>
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
          hint="Hesabınıza bağlı e-posta adresini yazın."
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <SubmitButton buttonSize={size} pendingLabel="Gönderiliyor…">
          Yenileme bağlantısı gönder
        </SubmitButton>
      </form>
    </div>
  );
}
