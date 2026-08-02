"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { Prisma } from "@prisma/client";

import { prisma } from "@/core/database/prisma";
import { createOrganizationForUser } from "@/core/tenancy/organization";
import { getClientIp } from "@/lib/request-context";
import { sanitizeRedirectPath } from "@/lib/safe-redirect";
import { getAppUrl, isProduction } from "@/lib/env";
import {
  RATE_LIMITS,
  checkRateLimit,
  rateLimitMessage,
  resetRateLimit,
} from "@/lib/rate-limit";

import { signIn, signOut } from "./index";
import type { FormState } from "./form-state";
import { hashPassword } from "./password";
import { sendPasswordResetEmail } from "./mailer";
import {
  consumePasswordResetToken,
  createPasswordResetToken,
  markPasswordResetTokenUsed,
} from "./tokens";
import {
  fieldErrorsFrom,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./validation";

const GENERIC_ERROR =
  "İşlem tamamlanamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.";

function boolFrom(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true";
}

/* -------------------------------------------------------------------------- */
/*  Giriş                                                                      */
/* -------------------------------------------------------------------------- */

export async function loginAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember: boolFrom(formData.get("remember")),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Lütfen form alanlarını kontrol edin.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const { email, password, remember } = parsed.data;
  const ip = await getClientIp();

  const ipLimit = checkRateLimit(`login:ip:${ip}`, RATE_LIMITS.login);
  if (!ipLimit.success) {
    return { status: "error", message: rateLimitMessage(ipLimit.retryAfterSeconds) };
  }

  const emailLimit = checkRateLimit(`login:email:${email}`, RATE_LIMITS.login);
  if (!emailLimit.success) {
    return { status: "error", message: rateLimitMessage(emailLimit.retryAfterSeconds) };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      remember: String(remember),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      // Kullanıcı var/yok bilgisini açığa çıkarmayan tek tip mesaj.
      return { status: "error", message: "E-posta veya şifre hatalı." };
    }
    console.error("[auth] Giriş sırasında beklenmeyen hata:", error);
    return { status: "error", message: GENERIC_ERROR };
  }

  resetRateLimit(`login:email:${email}`);

  const target = sanitizeRedirectPath(
    formData.get("callbackUrl")?.toString() ?? null,
  );
  redirect(target);
}

/* -------------------------------------------------------------------------- */
/*  Kayıt                                                                      */
/* -------------------------------------------------------------------------- */

export async function registerAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    organizationName: formData.get("organizationName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    acceptTerms: boolFrom(formData.get("acceptTerms")),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Lütfen form alanlarını kontrol edin.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const { firstName, lastName, organizationName, email, password } = parsed.data;
  const ip = await getClientIp();

  const limit = checkRateLimit(`register:ip:${ip}`, RATE_LIMITS.register);
  if (!limit.success) {
    return { status: "error", message: rateLimitMessage(limit.retryAfterSeconds) };
  }

  const passwordHash = await hashPassword(password);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          email,
          passwordHash,
        },
      });

      await createOrganizationForUser(user.id, organizationName, tx);
    });
  } catch (error) {
    // P2002: benzersizlik ihlali (e-posta zaten kayıtlı).
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        status: "error",
        message:
          "Bu e-posta adresiyle kayıt oluşturulamadı. Giriş yapmayı veya şifrenizi sıfırlamayı deneyin.",
        fieldErrors: { email: "Bu e-posta adresi kullanılamıyor." },
      };
    }
    console.error("[auth] Kayıt sırasında beklenmeyen hata:", error);
    return { status: "error", message: GENERIC_ERROR };
  }

  // Kayıttan sonra otomatik giriş.
  try {
    await signIn("credentials", {
      email,
      password,
      remember: "true",
      redirect: false,
    });
  } catch (error) {
    console.error("[auth] Kayıt sonrası otomatik giriş başarısız:", error);
    redirect("/login?registered=1");
  }

  redirect("/dashboard");
}

/* -------------------------------------------------------------------------- */
/*  Şifremi unuttum                                                            */
/* -------------------------------------------------------------------------- */

const FORGOT_PASSWORD_NOTICE =
  "Eğer bu e-posta adresi kayıtlıysa, şifre yenileme bağlantısı gönderildi. Gelen kutunuzu kontrol edin.";

export async function forgotPasswordAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Lütfen geçerli bir e-posta adresi girin.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const { email } = parsed.data;
  const ip = await getClientIp();

  const limit = checkRateLimit(`forgot:ip:${ip}`, RATE_LIMITS.forgotPassword);
  if (!limit.success) {
    return { status: "error", message: rateLimitMessage(limit.retryAfterSeconds) };
  }
  const emailLimit = checkRateLimit(
    `forgot:email:${email}`,
    RATE_LIMITS.forgotPassword,
  );
  if (!emailLimit.success) {
    return { status: "error", message: rateLimitMessage(emailLimit.retryAfterSeconds) };
  }

  let devResetUrl: string | undefined;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });

    // Kullanıcı yoksa da aynı mesaj döner (enumeration koruması).
    if (user) {
      const token = await createPasswordResetToken(user.id);
      const resetUrl = `${getAppUrl()}/reset-password?token=${token}`;
      await sendPasswordResetEmail(email, resetUrl);
      if (!isProduction) devResetUrl = resetUrl;
    }
  } catch (error) {
    console.error("[auth] Şifre sıfırlama isteği sırasında hata:", error);
    // Hata detayı kullanıcıya sızdırılmaz.
    return { status: "error", message: GENERIC_ERROR };
  }

  return { status: "success", message: FORGOT_PASSWORD_NOTICE, devResetUrl };
}

/* -------------------------------------------------------------------------- */
/*  Şifre yenileme                                                             */
/* -------------------------------------------------------------------------- */

export async function resetPasswordAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Lütfen form alanlarını kontrol edin.",
      fieldErrors: fieldErrorsFrom(parsed.error),
    };
  }

  const { token, password } = parsed.data;
  const ip = await getClientIp();

  const limit = checkRateLimit(`reset:ip:${ip}`, RATE_LIMITS.resetPassword);
  if (!limit.success) {
    return { status: "error", message: rateLimitMessage(limit.retryAfterSeconds) };
  }

  try {
    const result = await consumePasswordResetToken(token);
    if (!result) {
      return {
        status: "error",
        message:
          "Bağlantı geçersiz veya süresi dolmuş. Lütfen yeni bir şifre yenileme bağlantısı isteyin.",
      };
    }

    const passwordHash = await hashPassword(password);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: result.userId },
        data: { passwordHash },
      }),
      // Tüm açık jetonları geçersiz kıl.
      prisma.passwordResetToken.deleteMany({
        where: { userId: result.userId, usedAt: null },
      }),
      // Veritabanı oturumlarına geçilirse mevcut oturumlar da kapansın.
      prisma.session.deleteMany({ where: { userId: result.userId } }),
    ]);

    await markPasswordResetTokenUsed(token);
  } catch (error) {
    console.error("[auth] Şifre yenileme sırasında hata:", error);
    return { status: "error", message: GENERIC_ERROR };
  }

  redirect("/login?reset=1");
}

/* -------------------------------------------------------------------------- */
/*  Google ile giriş / Oturum kapatma                                          */
/* -------------------------------------------------------------------------- */

export async function googleSignInAction(formData: FormData): Promise<void> {
  const target = sanitizeRedirectPath(
    formData.get("callbackUrl")?.toString() ?? null,
  );
  await signIn("google", { redirectTo: target });
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: "/login" });
}
