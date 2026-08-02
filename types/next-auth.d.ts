import type { OrganizationRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

/**
 * Oturuma çok kiracılı (multi-tenant) alanları ekler.
 * Bu alanlar giriş anında JWT içine yazılır.
 */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      organizationId?: string | null;
      organizationName?: string | null;
      role?: OrganizationRole | null;
    } & DefaultSession["user"];
  }

  interface User {
    firstName?: string | null;
    lastName?: string | null;
    remember?: boolean;
  }
}

/**
 * `next-auth/jwt` yalnızca `@auth/core/jwt` modülünü yeniden dışa aktarır;
 * bu yüzden JWT arayüzü asıl tanımlandığı modülde genişletilir.
 */
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    organizationId?: string | null;
    organizationName?: string | null;
    role?: OrganizationRole | null;
    /** Oturumun mutlak bitiş zamanı (ms). "Beni hatırla" seçimine göre belirlenir. */
    absoluteExpiry?: number;
  }
}

export {};
