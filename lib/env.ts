/**
 * Ortam değişkenlerine tek noktadan erişim.
 * Gizli bilgiler kaynak koda yazılmaz; hepsi `.env` dosyasından okunur.
 */

export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";

/** Google OAuth yalnızca iki anahtar da tanımlıysa etkinleşir. */
export function isGoogleAuthEnabled(): boolean {
  return Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
}

/**
 * Şifre sıfırlama bağlantısında kullanılacak temel adres.
 * Üretimde AUTH_URL / NEXT_PUBLIC_APP_URL tanımlanmalıdır.
 */
export function getAppUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.AUTH_URL ??
    "http://localhost:3000";
  return url.replace(/\/$/, "");
}

/**
 * Üretimde eksik yapılandırmayı erken yakalamak için basit kontrol.
 * Uygulamayı çökertmez, yalnızca sunucu günlüğüne uyarı düşer.
 */
export function warnOnMissingEnv(): void {
  const required = ["DATABASE_URL", "AUTH_SECRET"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.warn(
      `[env] Eksik ortam değişkeni: ${missing.join(", ")}. ` +
        `.env.example dosyasını .env olarak kopyalayıp doldurun.`,
    );
  }
}
