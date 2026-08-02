"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export type FieldSize = "md" | "lg";

const SIZE_STYLES: Record<FieldSize, string> = {
  // Masaüstü: kompakt, kurumsal
  md: "h-11 px-3.5 text-sm",
  // Mobil: dokunmaya uygun büyük alan
  lg: "h-13 px-4 text-base",
};

type TextFieldProps = Omit<React.ComponentPropsWithoutRef<"input">, "size"> & {
  label: string;
  error?: string;
  hint?: string;
  fieldSize?: FieldSize;
};

export function TextField({
  label,
  error,
  hint,
  fieldSize = "md",
  className,
  id,
  ...inputProps
}: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [error ? errorId : null, hint ? hintId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(
          "block w-full rounded-lg border bg-white text-slate-900 shadow-xs transition",
          "placeholder:text-slate-400",
          "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none",
          "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
          SIZE_STYLES[fieldSize],
          error ? "border-red-400" : "border-slate-300",
          className,
        )}
        {...inputProps}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

type PasswordFieldProps = Omit<TextFieldProps, "type">;

export function PasswordField({
  label,
  error,
  hint,
  fieldSize = "md",
  className,
  id,
  ...inputProps
}: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const [visible, setVisible] = useState(false);

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error ? errorId : null, hint ? hintId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn(
            "block w-full rounded-lg border bg-white pr-20 text-slate-900 shadow-xs transition",
            "placeholder:text-slate-400",
            "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none",
            "disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500",
            SIZE_STYLES[fieldSize],
            error ? "border-red-400" : "border-slate-300",
            className,
          )}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute inset-y-0 right-0 px-3.5 text-xs font-medium text-slate-500 hover:text-slate-800"
          aria-label={visible ? "Şifreyi gizle" : "Şifreyi göster"}
        >
          {visible ? "Gizle" : "Göster"}
        </button>
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
