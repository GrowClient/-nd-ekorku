import { OrganizationRole, type Prisma } from "@prisma/client";
import { prisma } from "@/core/database/prisma";

/** Firma adından URL dostu, benzersiz bir slug üretir. */
export function slugify(value: string): string {
  const turkishMap: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };

  const base = value
    .split("")
    .map((char) => turkishMap[char] ?? char)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);

  return base || "firma";
}

/** Veritabanında çakışmayan bir slug bulur. */
export async function generateUniqueSlug(
  name: string,
  client: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<string> {
  const base = slugify(name);

  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${randomSuffix()}`;
    const existing = await client.organization.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }

  return `${base}-${Date.now().toString(36)}`;
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

/**
 * Kullanıcı için firma oluşturur ve kullanıcıyı OWNER rolüyle bağlar.
 * Kayıt akışı ile Google ile ilk giriş akışının ortak adımıdır.
 */
export async function createOrganizationForUser(
  userId: string,
  organizationName: string,
  client: Prisma.TransactionClient | typeof prisma = prisma,
) {
  const slug = await generateUniqueSlug(organizationName, client);

  const organization = await client.organization.create({
    data: { name: organizationName.trim(), slug },
  });

  await client.organizationMembership.create({
    data: {
      userId,
      organizationId: organization.id,
      role: OrganizationRole.OWNER,
    },
  });

  return organization;
}

export type ActiveMembership = {
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: OrganizationRole;
};

/**
 * Kullanıcının aktif firmasını döner. Henüz firması yoksa (ör. Google ile
 * ilk giriş) otomatik olarak bir firma oluşturur; böylece hiçbir kullanıcı
 * kiracısız kalmaz.
 */
export async function getOrCreateActiveMembership(
  userId: string,
  fallbackOrganizationName: string,
): Promise<ActiveMembership | null> {
  const existing = await prisma.organizationMembership.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    include: { organization: true },
  });

  if (existing) {
    return {
      organizationId: existing.organizationId,
      organizationName: existing.organization.name,
      organizationSlug: existing.organization.slug,
      role: existing.role,
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });
  if (!user) return null;

  const organization = await createOrganizationForUser(
    userId,
    fallbackOrganizationName,
  );

  return {
    organizationId: organization.id,
    organizationName: organization.name,
    organizationSlug: organization.slug,
    role: OrganizationRole.OWNER,
  };
}
