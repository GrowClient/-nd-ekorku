import Link from "next/link";
import type { Metadata } from "next";

import { AuthScreen } from "@/components/layouts/AuthScreen";
import { LoginForm } from "@/components/auth/LoginForm";
import { Alert } from "@/components/ui/Alert";
import { isGoogleAuthEnabled } from "@/lib/env";
import { sanitizeRedirectPath } from "@/lib/safe-redirect";

export const metadata: Metadata = { title: "Giriş yap" };

/** Auth.js hata kodlarının kullanıcıya gösterilecek Türkçe karşılıkları. */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked:
    "Bu e-posta adresi daha önce şifreyle kayıt olmuş. Lütfen e-posta ve şifrenizle giriş yapın.",
  AccessDenied: "Giriş izni verilmedi. Lütfen tekrar deneyin.",
  Configuration:
    "Giriş yapılandırması tamamlanmamış. Lütfen sistem yöneticinizle görüşün.",
  CredentialsSignin: "E-posta veya şifre hatalı.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const callbackUrl = sanitizeRedirectPath(first("callbackUrl"));
  const errorCode = first("error");
  const errorMessage = errorCode
    ? (AUTH_ERROR_MESSAGES[errorCode] ??
      "Giriş yapılamadı. Lütfen tekrar deneyin.")
    : null;

  const notice = first("reset")
    ? "Şifreniz güncellendi. Yeni şifrenizle giriş yapabilirsiniz."
    : first("registered")
      ? "Hesabınız oluşturuldu. Giriş yapabilirsiniz."
      : null;

  const googleEnabled = isGoogleAuthEnabled();

  return (
    <AuthScreen
      title="Giriş yap"
      description="Hesabınıza erişmek için bilgilerinizi girin."
      renderForm={(variant) => (
        <div className="space-y-4">
          {errorMessage && <Alert tone="error">{errorMessage}</Alert>}
          {notice && <Alert tone="success">{notice}</Alert>}
          <LoginForm
            variant={variant}
            callbackUrl={callbackUrl}
            googleEnabled={googleEnabled}
          />
        </div>
      )}
      renderFooter={() => (
        <p>
          Hesabın yok mu?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-700 hover:underline"
          >
            Kayıt ol
          </Link>
        </p>
      )}
    />
  );
}
