import { cn } from "@/lib/cn";

export function Logo({
  className,
  showText = true,
  tone = "dark",
}: {
  className?: string;
  showText?: boolean;
  tone?: "dark" | "light";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "grid h-9 w-9 place-items-center rounded-lg text-sm font-bold tracking-tight",
          tone === "light"
            ? "bg-white/15 text-white ring-1 ring-white/25"
            : "bg-brand-600 text-white",
        )}
      >
        bE
      </span>
      {showText && (
        <span
          className={cn(
            "text-lg font-semibold tracking-tight",
            tone === "light" ? "text-white" : "text-slate-900",
          )}
        >
          bark<span className="font-normal opacity-80">ERP</span>
        </span>
      )}
    </span>
  );
}
