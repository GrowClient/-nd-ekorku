import { Logo } from "@/components/ui/Logo";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { cn } from "@/lib/cn";

/** Mobil uygulama çerçevesi: tek kolon, dokunmaya uygun ölçüler. */
export function MobileAppLayout({
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
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <Logo />
        <p className="mt-3 text-sm font-medium text-slate-700">
          {organizationName}
        </p>
        <p className="text-xs text-slate-500">
          {userName} · {roleLabel}
        </p>
      </header>

      <main className="flex-1 px-5 py-6">{children}</main>

      <footer className="border-t border-slate-200 px-5 py-4">
        <SignOutButton size="lg" />
      </footer>
    </div>
  );
}
