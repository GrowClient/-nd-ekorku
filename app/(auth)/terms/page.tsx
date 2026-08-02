import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kullanım koşulları" };

/**
 * Kayıt formundaki onay kutusunun bağlantısı kırık kalmasın diye eklenen
 * yer tutucu sayfa. Hukuki metin sonraki aşamalarda doldurulacaktır.
 */
export default function TermsPage() {
  return (
    <div className="mx-auto min-h-screen-safe w-full max-w-2xl px-5 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Kullanım koşulları
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-slate-600">
        Bu sürüm (v0.1.0-auth) yalnızca çekirdek mimari ve kimlik doğrulama
        bölümünü içerir. Hizmete ait kullanım koşulları metni sonraki aşamada
        yayımlanacaktır.
      </p>
      <p className="mt-6 text-sm">
        <Link href="/register" className="font-medium text-brand-700 hover:underline">
          Kayıt ekranına dön
        </Link>
      </p>
    </div>
  );
}
