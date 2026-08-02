import { auth } from "@/core/auth";
import type { OrganizationRole } from "@prisma/client";

export type TenantContext = {
  userId: string;
  organizationId: string;
  organizationName: string;
  role: OrganizationRole;
};

/**
 * Aktif kiracı bağlamı. İleride eklenecek ERP modülleri, veri sorgularını
 * DAİMA bu fonksiyondan aldıkları `organizationId` ile filtrelemelidir.
 * Böylece bir firmanın verisi başka bir firmaya sızmaz.
 *
 * Oturum yoksa `null` döner.
 */
export async function getOrganizationContext(): Promise<TenantContext | null> {
  const session = await auth();
  const user = session?.user;

  if (!user?.id || !user.organizationId) return null;

  return {
    userId: user.id,
    organizationId: user.organizationId,
    organizationName: user.organizationName ?? "",
    role: user.role ?? "MEMBER",
  };
}

/**
 * Bağlam zorunlu olduğunda kullanılır. Oturum yoksa hata fırlatır;
 * sayfa/route bunu 401 olarak ele almalıdır.
 */
export async function requireOrganizationContext(): Promise<TenantContext> {
  const context = await getOrganizationContext();
  if (!context) {
    throw new Error("UNAUTHORIZED");
  }
  return context;
}
