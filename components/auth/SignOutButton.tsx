"use client";

import { signOutAction } from "@/core/auth/actions";
import { SubmitButton } from "@/components/ui/Button";

export function SignOutButton({
  size = "md",
  variant = "secondary",
  fullWidth = true,
  className,
}: {
  size?: "md" | "lg";
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  className?: string;
}) {
  return (
    <form action={signOutAction} className={className}>
      <SubmitButton
        variant={variant}
        buttonSize={size}
        fullWidth={fullWidth}
        pendingLabel="Çıkış yapılıyor…"
      >
        Oturumu kapat
      </SubmitButton>
    </form>
  );
}
