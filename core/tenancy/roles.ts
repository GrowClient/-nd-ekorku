import { OrganizationRole } from "@prisma/client";

export { OrganizationRole };

/** Rollerin arayüzde gösterilecek Türkçe karşılıkları. */
export const ROLE_LABELS: Record<OrganizationRole, string> = {
  OWNER: "Firma Sahibi",
  ADMIN: "Yönetici",
  MEMBER: "Üye",
};

/**
 * Yetki sıralaması. Büyük sayı daha geniş yetki demektir.
 * Modüller ileride `hasAtLeastRole(role, "ADMIN")` şeklinde kontrol yapar.
 */
const ROLE_WEIGHT: Record<OrganizationRole, number> = {
  OWNER: 30,
  ADMIN: 20,
  MEMBER: 10,
};

export function roleLabel(role: OrganizationRole | string | null | undefined): string {
  if (!role) return ROLE_LABELS.MEMBER;
  return ROLE_LABELS[role as OrganizationRole] ?? ROLE_LABELS.MEMBER;
}

export function hasAtLeastRole(
  role: OrganizationRole | null | undefined,
  required: OrganizationRole,
): boolean {
  if (!role) return false;
  return ROLE_WEIGHT[role] >= ROLE_WEIGHT[required];
}
