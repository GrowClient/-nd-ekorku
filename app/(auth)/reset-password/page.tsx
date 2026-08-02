import Link from "next/link";
import type { Metadata } from "next";

import { AuthScreen } from "@/components/layouts/AuthScreen";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Şifre yenileme" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = params.token;
  const token = (Array.isArray(raw) ? raw[0] : raw) ?? "";

  return (
    <AuthScreen
      title="Yeni şifre belirle"
      description="Hesabınız için yeni bir şifre oluşturun."
      renderForm={(variant) => (
        <ResetPasswordForm variant={variant} token={token} />
      )}
      renderFooter={() => (
        <p>
          Bağlantının süresi mi doldu?{" "}
          <Link
            href="/forgot-password"
            className="font-medium text-brand-700 hover:underline"
          >
            Yeni bağlantı iste
          </Link>
        </p>
      )}
    />
  );
}
