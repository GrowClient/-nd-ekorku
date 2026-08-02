import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

/**
 * Masaüstü kimlik doğrulama düzeni.
 * Sol: marka ve kısa tanıtım alanı. Sağ: form.
 * Yalnızca geniş ekranlarda görünür (lg ve üzeri).
 */
export function DesktopAuthLayout({
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
    <div className={cn("min-h-screen-safe grid grid-cols-[1.05fr_1fr]", className)}>
      {/* Marka / tanıtım alanı */}
      <aside className="relative flex flex-col justify-between overflow-hidden bg-brand-800 px-12 py-10 text-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(60rem 40rem at -10% -10%, #2044db 0%, transparent 55%), radial-gradient(50rem 35rem at 110% 110%, #1c2f6e 0%, transparent 60%)",
          }}
        />

        <div className="relative">
          <Link href="/" aria-label="Ana sayfa">
            <Logo tone="light" />
          </Link>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-3xl leading-tight font-semibold tracking-tight">
            İşletmenizin tek merkezi.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/75">
            barkERP, sektörünüze göre açıp kapatabileceğiniz modüllerle çalışan
            bir kurumsal kaynak planlama altyapısıdır. Her firma kendi
            verisiyle, kendi kullanıcılarıyla ayrı çalışır.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-white/80">
            {[
              "Çok kiracılı yapı — firmalar birbirinin verisini göremez",
              "Modüler kurulum — yalnızca kullandığınız bölümler açık",
              "Rol tabanlı yetkilendirme",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white/50"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-white/50">
          Sürüm v0.1.0-auth · Modüller sonraki aşamalarda eklenecek
        </p>
      </aside>

      {/* Form alanı */}
      <main className="flex items-center justify-center px-12 py-10">
        <div className="w-full max-w-[26rem]">
          <header className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">{description}</p>
          </header>

          {children}

          {footer && (
            <div className="mt-7 border-t border-slate-200 pt-5 text-sm text-slate-600">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
