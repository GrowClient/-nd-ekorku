import { isProduction } from "@/lib/env";

/**
 * E-posta gönderimi 1. aşamanın kapsamı dışındadır. Bu dosya tek bağlantı
 * noktası olarak durur: sonraki aşamada burada gerçek bir sağlayıcı
 * (SendGrid, Resend, Google Workspace SMTP vb.) devreye alınacaktır.
 *
 * Şu an bağlantı yalnızca sunucu günlüğüne yazılır.
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
): Promise<void> {
  if (isProduction) {
    console.info(
      `[mailer] Şifre sıfırlama bağlantısı üretildi (alıcı gizlendi). ` +
        `E-posta sağlayıcısı henüz yapılandırılmadı.`,
    );
    return;
  }

  console.info(
    `\n[mailer] Şifre sıfırlama bağlantısı\n  Alıcı : ${email}\n  Bağlantı: ${resetUrl}\n`,
  );
}
