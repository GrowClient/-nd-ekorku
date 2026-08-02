import type { NextAuthConfig } from "next-auth";
import { getAppUrl } from "@/lib/env";

/**
 * Edge çalışma ortamında da güvenle yüklenebilen temel Auth.js ayarları.
 * Burada Prisma, bcrypt gibi Node.js'e özel bağımlılıklar KULLANILMAZ;
 * middleware bu dosyayı kullanır.
 */
export const authConfig = {
  // Ters vekil arkasında (Cloud Run, App Engine) host başlığına güven.
  trustHost: true,

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    // Credentials sağlayıcısı yalnızca JWT stratejisiyle çalışır.
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 gün (üst sınır)
    updateAge: 24 * 60 * 60,
  },

  // Çerezler httpOnly + sameSite=lax; HTTPS altında Secure bayrağı eklenir.
  useSecureCookies: getAppUrl().startsWith("https://"),

  providers: [],
} satisfies NextAuthConfig;

/** "Beni hatırla" işaretlenmediğinde oturumun mutlak ömrü. */
export const SHORT_SESSION_MS = 12 * 60 * 60 * 1000; // 12 saat
/** "Beni hatırla" işaretlendiğinde oturumun mutlak ömrü. */
export const LONG_SESSION_MS = 30 * 24 * 60 * 60 * 1000; // 30 gün
