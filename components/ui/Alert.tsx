import { cn } from "@/lib/cn";

type AlertTone = "error" | "success" | "info";

const TONE_STYLES: Record<AlertTone, string> = {
  error: "border-red-200 bg-red-50 text-red-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-brand-200 bg-brand-50 text-brand-800",
};

export function Alert({
  tone = "info",
  children,
  className,
}: {
  tone?: AlertTone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live="polite"
      className={cn(
        "rounded-lg border px-3.5 py-3 text-sm leading-relaxed",
        TONE_STYLES[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
