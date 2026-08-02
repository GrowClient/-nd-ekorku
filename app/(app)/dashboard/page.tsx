import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { auth } from "@/core/auth";
import { roleLabel } from "@/core/tenancy/roles";
import { DesktopAppLayout } from "@/components/layouts/DesktopAppLayout";
import { MobileAppLayout } from "@/components/layouts/MobileAppLayout";

export const metadata: Metadata = { title: "Panel" };

export default async function DashboardPage() {
  const session = await auth();

  // Middleware zaten koruyor; burada ikinci bir güvenlik katmanı olarak
  // sunucu tarafında da doğrulanır.
  if (!session?.user) redirect("/login");

  const user = session.user;
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.name ||
    user.email ||
    "Kullanıcı";
  const organizationName = user.organizationName ?? "Firma tanımlı değil";
  const role = roleLabel(user.role);

  const content = <DashboardContent displayName={displayName} />;

  return (
    <>
      <div className="hidden lg:block">
        <DesktopAppLayout
          organizationName={organizationName}
          userName={displayName}
          roleLabel={role}
        >
          {content}
        </DesktopAppLayout>
      </div>

      <div className="lg:hidden">
        <MobileAppLayout
          organizationName={organizationName}
          userName={displayName}
          roleLabel={role}
        >
          {content}
        </MobileAppLayout>
      </div>
    </>
  );
}

function DashboardContent({ displayName }: { displayName: string }) {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Hoş geldiniz, {displayName}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Hesabınız hazır. Aşağıda firma ve yetki bilgileriniz yer alıyor.
        </p>
      </section>

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-800">
          Modüller sonraki aşamalarda eklenecek
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
          Bu sürüm (v0.1.0-auth) yalnızca çekirdek mimariyi ve kimlik doğrulamayı
          içerir. Kafe/restoran, triko/tekstil, stok, satış ve muhasebe modülleri
          sonraki aşamalarda bu panele eklenecektir.
        </p>
      </section>
    </div>
  );
}
