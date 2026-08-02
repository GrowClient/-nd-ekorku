"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

type CheckboxProps = React.ComponentPropsWithoutRef<"input"> & {
  label: React.ReactNode;
  error?: string;
  /** Mobilde dokunma alanını büyütür. */
  touchFriendly?: boolean;
};

export function Checkbox({
  label,
  error,
  touchFriendly = false,
  id,
  className,
  ...inputProps
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div>
      <label
        htmlFor={inputId}
        className={cn(
          "flex cursor-pointer items-start gap-3 text-slate-700",
          touchFriendly ? "py-1.5 text-base" : "text-sm",
        )}
      >
        <input
          id={inputId}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "mt-0.5 shrink-0 rounded border-slate-300 text-brand-600",
            "focus:ring-2 focus:ring-brand-500/30",
            touchFriendly ? "h-5 w-5" : "h-4 w-4",
            error && "border-red-400",
            className,
          )}
          {...inputProps}
        />
        <span className="leading-snug">{label}</span>
      </label>
      {error && (
        <p id={errorId} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
