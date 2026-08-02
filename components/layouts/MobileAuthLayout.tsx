import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

/**
 * Mobil kimlik doğrulama düzeni.
 * Tek kolon, tanıtım görselleri yok, dokunmaya uygun büyük alanlar.
 * Klavye açıldığında form kullanılabilir kalsın diye içerik dikeyde akar
 * (sabitlenmiş/ortalanmış yükseklik kullanılmaz).
 */
export function MobileAuthLayout({
  title,
  description,
  children,
  footer,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-h-screen-safe flex flex-col bg-white", className)}>
      <header className="px-5 pt-7 pb-5">
        <Link href="/" aria-label="Ana sayfa">
          <Logo />
        </Link>
        <h1 className="mt-6 text-[22px] leading-tight font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-1.5 text-[15px] leading-relaxed text-slate-500">
          {description}
        </p>
      </header>

      <main className="flex-1 px-5 pb-8">{children}</main>

      {footer && (
        <footer className="border-t border-slate-200 px-5 py-5 text-[15px] text-slate-600">
          {footer}
        </footer>
      )}
    </div>
  );
}
