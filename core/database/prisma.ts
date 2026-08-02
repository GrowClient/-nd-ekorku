import { PrismaClient } from "@prisma/client";

/**
 * Prisma istemcisi yalnızca sunucu tarafında çalışır. Tarayıcı hiçbir zaman
 * doğrudan PostgreSQL'e bağlanmaz; tüm sorgular server action / route
 * handler içinden geçer.
 *
 * Geliştirme modunda Next.js hot-reload her derlemede modülü yeniden
 * yüklediği için istemci global üzerinde saklanır (bağlantı havuzunun
 * tükenmesini engeller).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
