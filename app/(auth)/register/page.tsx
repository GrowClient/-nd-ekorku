import Link from "next/link";
import type { Metadata } from "next";

import { AuthScreen } from "@/components/layouts/AuthScreen";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { isGoogleAuthEnabled } from "@/lib/env";

export const metadata: Metadata = { title: "Kayıt ol" };

export default function RegisterPage() {
  const googleEnabled = isGoogleAuthEnabled();

  return (
    <AuthScreen
      title="Firma hesabı oluştur"
      description="Kayıt olduğunuzda firmanız açılır ve siz firma sahibi olursunuz."
      renderForm={(variant) => (
        <RegisterForm variant={variant} googleEnabled={googleEnabled} />
      )}
      renderFooter={() => (
        <p>
          Zaten hesabın var mı?{" "}
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
