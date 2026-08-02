"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm",
  secondary:
    "bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 active:bg-slate-100",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  md: "h-11 px-4 text-sm",
  lg: "h-13 px-5 text-base",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
    />
  );
}

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  buttonSize?: ButtonSize;
  loading?: boolean;
  /** Varsayılan olarak buton, kapsayıcısının tamamını kaplar. */
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  buttonSize = "md",
  loading = false,
  fullWidth = true,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        BASE,
        VARIANT_STYLES[variant],
        SIZE_STYLES[buttonSize],
        fullWidth ? "w-full" : "w-auto",
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

/**
 * Form gönderim butonu. `useFormStatus` sayesinde gönderim sürerken
 * kendiliğinden devre dışı kalır — çift gönderim engellenir.
 */
export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  buttonSize = "md",
  fullWidth = true,
  className,
  ...props
}: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      buttonSize={buttonSize}
      fullWidth={fullWidth}
      loading={pending}
      aria-busy={pending}
      className={className}
      {...props}
    >
      {pending ? (pendingLabel ?? "Lütfen bekleyin…") : children}
    </Button>
  );
}
