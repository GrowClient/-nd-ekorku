import Link from "next/link";
import type { Metadata } from "next";

import { AuthScreen } from "@/components/layouts/AuthScreen";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Şifremi unuttum" };

export default function ForgotPasswordPage() {
  return (
    <AuthScreen
      title="Şifremi unuttum"
      description="E-posta adresinizi girin, şifre yenileme bağlantısı gönderelim."
      renderForm={(variant) => <ForgotPasswordForm variant={variant} />}
      renderFooter={() => (
        <p>
          Şifrenizi hatırladınız mı?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-700 hover:underline"
          >
            Giriş yap
          </Link>
        </p>
      )}
    />
  );
}
