import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { prisma } from "@/core/database/prisma";

/** Şifre sıfırlama bağlantısının geçerlilik süresi. */
export const PASSWORD_RESET_TTL_MS = 60 * 60 * 1000; // 1 saat

/**
 * Jetonun kendisi veritabanında saklanmaz; yalnızca SHA-256 özeti saklanır.
 * Veritabanı sızsa bile jetonlar doğrudan kullanılamaz.
 */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

/**
 * Kullanıcı için yeni bir şifre sıfırlama jetonu üretir ve eski jetonlarını
 * geçersiz kılar. Ham jeton yalnızca burada döner, saklanmaz.
 */
export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = generateToken();

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId, usedAt: null } }),
    prisma.passwordResetToken.create({
      data: {
        userId,
        tokenHash: hashToken(token),
        expires: new Date(Date.now() + PASSWORD_RESET_TTL_MS),
      },
    }),
  ]);

  return token;
}

/** Jetonu doğrular; geçerliyse ilgili kullanıcı kimliğini döner. */
export async function consumePasswordResetToken(
  token: string,
): Promise<{ userId: string } | null> {
  const tokenHash = hashToken(token);

  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, expires: true, usedAt: true, tokenHash: true },
  });

  if (!record) return null;
  if (record.usedAt) return null;
  if (record.expires.getTime() < Date.now()) return null;
  if (!safeCompare(record.tokenHash, tokenHash)) return null;

  return { userId: record.userId };
}

/** Jetonu kullanılmış olarak işaretler (tek kullanımlık). */
export async function markPasswordResetTokenUsed(token: string): Promise<void> {
  await prisma.passwordResetToken.updateMany({
    where: { tokenHash: hashToken(token), usedAt: null },
    data: { usedAt: new Date() },
  });
}

function safeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}
