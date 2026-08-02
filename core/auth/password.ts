import bcrypt from "bcryptjs";

/**
 * Şifreler asla düz metin saklanmaz. bcrypt, cost 12 ile kullanılır.
 * (Argon2 de kabul edilebilir bir alternatiftir; bcryptjs saf JavaScript
 * olduğu için Cloud Run / App Engine imajlarında ek derleme gerektirmez.)
 */
const BCRYPT_COST = 12;

/**
 * Kullanıcı bulunamadığında da benzer süre harcamak için kullanılan sahte
 * hash. Zamanlama farkından kullanıcı var/yok bilgisi sızmasını engeller.
 */
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKcEe.RQmnzE3zbKAy8Fs2v3sJcZ0zN2M5R7C";

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, BCRYPT_COST);
}

export async function verifyPassword(
  plainPassword: string,
  passwordHash: string | null | undefined,
): Promise<boolean> {
  if (!passwordHash) {
    // Kullanıcı yok ya da yalnızca Google ile kayıtlı: yine de karşılaştırma
    // yaparak yanıt süresini eşitle.
    await bcrypt.compare(plainPassword, DUMMY_HASH);
    return false;
  }

  return bcrypt.compare(plainPassword, passwordHash);
}
