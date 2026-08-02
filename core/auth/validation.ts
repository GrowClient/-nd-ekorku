import { z } from "zod";

/**
 * Tüm form doğrulamaları burada tanımlanır ve HEM istemci HEM sunucu
 * tarafında kullanılır. Sunucu tarafı doğrulama her zaman çalışır; istemci
 * doğrulaması yalnızca kullanıcı deneyimi içindir.
 */

/** Kullanıcıya gösterilecek şifre kuralları. */
export const PASSWORD_RULES = [
  "En az 8 karakter",
  "En az bir büyük harf",
  "En az bir küçük harf",
  "En az bir rakam",
] as const;

export const passwordSchema = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalı.")
  .max(72, "Şifre en fazla 72 karakter olabilir.")
  .regex(/[A-ZÇĞİÖŞÜ]/, "Şifre en az bir büyük harf içermeli.")
  .regex(/[a-zçğıöşü]/, "Şifre en az bir küçük harf içermeli.")
  .regex(/[0-9]/, "Şifre en az bir rakam içermeli.");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "E-posta adresi gerekli.")
  .max(254, "E-posta adresi çok uzun.")
  .email("Geçerli bir e-posta adresi girin.")
  .transform((value) => value.toLowerCase());

export const loginSchema = z.object({
  email: emailSchema,
  // Girişte şifre kurallarını tekrar uygulamıyoruz; yalnızca boş olmasın.
  password: z.string().min(1, "Şifre gerekli.").max(72, "Şifre çok uzun."),
  remember: z.boolean().optional().default(false),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, "Ad en az 2 karakter olmalı.")
      .max(60, "Ad çok uzun."),
    lastName: z
      .string()
      .trim()
      .min(2, "Soyad en az 2 karakter olmalı.")
      .max(60, "Soyad çok uzun."),
    organizationName: z
      .string()
      .trim()
      .min(2, "Firma adı en az 2 karakter olmalı.")
      .max(120, "Firma adı çok uzun."),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Şifre tekrarı gerekli."),
    acceptTerms: z.literal(true, {
      message: "Devam etmek için kullanım koşullarını kabul etmelisiniz.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Bağlantı geçersiz."),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Şifre tekrarı gerekli."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor.",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/** Zod hatalarını alan adı → mesaj sözlüğüne çevirir. */
export function fieldErrorsFrom(
  error: z.ZodError<unknown>,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
