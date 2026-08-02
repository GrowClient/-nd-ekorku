import { handlers } from "@/core/auth";

/**
 * Auth.js uç noktaları (OAuth callback, oturum, CSRF).
 * Tüm kimlik doğrulama işlemleri sunucu tarafında burada sonlanır.
 */
export const { GET, POST } = handlers;
