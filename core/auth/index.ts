import NextAuth, { type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { prisma } from "@/core/database/prisma";
import { getOrCreateActiveMembership } from "@/core/tenancy/organization";
import { isGoogleAuthEnabled } from "@/lib/env";
import { authConfig, LONG_SESSION_MS, SHORT_SESSION_MS } from "./config";
import { verifyPassword } from "./password";
import { loginSchema } from "./validation";

/**
 * Sunucu tarafı Auth.js kurulumu. Prisma ve bcrypt burada kullanılır; bu
 * dosya asla edge (middleware) tarafından import edilmez.
 */

const providers: NextAuthConfig["providers"] = [
  Credentials({
    id: "credentials",
    name: "E-posta ve şifre",
    credentials: {
      email: { label: "E-posta", type: "email" },
      password: { label: "Şifre", type: "password" },
      remember: { label: "Beni hatırla", type: "text" },
    },
    async authorize(rawCredentials) {
      // Sunucu tarafında her zaman yeniden doğrula.
      const parsed = loginSchema.safeParse({
        email: rawCredentials?.email,
        password: rawCredentials?.password,
        remember: rawCredentials?.remember === "true",
      });

      if (!parsed.success) return null;

      const { email, password, remember } = parsed.data;

      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          firstName: true,
          lastName: true,
          image: true,
          passwordHash: true,
        },
      });

      // verifyPassword, kullanıcı yoksa da sahte bir karşılaştırma yaparak
      // yanıt süresini eşitler (kullanıcı sayımı / enumeration koruması).
      const isValid = await verifyPassword(password, user?.passwordHash);
      if (!user || !isValid) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        remember,
      };
    },
  }),
];

if (isGoogleAuthEnabled()) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      // Hesap ele geçirme riskine karşı otomatik hesap birleştirme kapalı.
      allowDangerousEmailAccountLinking: false,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name ?? null,
          lastName: profile.family_name ?? null,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  );
}

function defaultOrganizationName(
  name?: string | null,
  email?: string | null,
): string {
  const base = name?.trim() || email?.split("@")[0] || "Yeni";
  return `${base} İşletmesi`;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers,

  events: {
    /**
     * Google ile ilk girişte kullanıcı adapter tarafından oluşturulur.
     * Bu kullanıcıyı hemen kendi firmasına OWNER olarak bağlarız; böylece
     * hiçbir kullanıcı kiracısız kalmaz.
     */
    async createUser({ user }) {
      if (!user.id) return;
      await getOrCreateActiveMembership(
        user.id,
        defaultOrganizationName(user.name, user.email),
      );
    },
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      // Yeni giriş: kimlik ve kiracı bilgilerini jetona yaz.
      if (user?.id) {
        token.id = user.id;
        token.firstName = user.firstName ?? null;
        token.lastName = user.lastName ?? null;
        token.absoluteExpiry =
          Date.now() + (user.remember === false ? SHORT_SESSION_MS : LONG_SESSION_MS);

        const membership = await getOrCreateActiveMembership(
          user.id,
          defaultOrganizationName(user.name, user.email),
        );
        token.organizationId = membership?.organizationId ?? null;
        token.organizationName = membership?.organizationName ?? null;
        token.role = membership?.role ?? null;
      }

      // "Beni hatırla" seçilmediyse oturum kısa sürede biter.
      if (token.absoluteExpiry && Date.now() > token.absoluteExpiry) {
        return null;
      }

      // Profil/firma güncellendiğinde jetonu tazele.
      if (trigger === "update" && token.id) {
        const membership = await getOrCreateActiveMembership(
          token.id,
          defaultOrganizationName(token.name, token.email),
        );
        token.organizationId = membership?.organizationId ?? null;
        token.organizationName = membership?.organizationName ?? null;
        token.role = membership?.role ?? null;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.firstName = token.firstName ?? null;
        session.user.lastName = token.lastName ?? null;
        session.user.organizationId = token.organizationId ?? null;
        session.user.organizationName = token.organizationName ?? null;
        session.user.role = token.role ?? null;
      }
      return session;
    },
  },
});
