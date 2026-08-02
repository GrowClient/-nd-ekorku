import { Logo } from "@/components/ui/Logo";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { cn } from "@/lib/cn";

/** Masaüstü uygulama çerçevesi: üst çubuk + geniş içerik alanı. */
export function DesktopAppLayout({
  organizationName,
  userName,
  roleLabel,
  children,
  className,
}: {
  organizationName: string;
  userName: string;
  roleLabel: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen-safe flex flex-col", className)}>
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Logo />
            <span aria-hidden className="h-6 w-px bg-slate-200" />
            <span className="text-sm font-medium text-slate-600">
              {organizationName}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right leading-tight">
              <p className="text-sm font-medium text-slate-800">{userName}</p>
              <p className="text-xs text-slate-500">{roleLabel}</p>
            </div>
            <SignOutButton fullWidth={false} />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-8 py-10">
        {children}
      </main>
    </div>
  );
}
