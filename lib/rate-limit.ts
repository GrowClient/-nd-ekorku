/**
 * Basit, bellek içi kayan pencere (sliding window) hız sınırlayıcı.
 *
 * Amaç: giriş ve şifre sıfırlama uçlarına yapılan kaba kuvvet denemelerini
 * yavaşlatmak. Tek sunucu örneği için yeterlidir.
 *
 * ÜRETİM NOTU: Birden fazla sunucu örneği (Cloud Run, App Engine vb.)
 * çalıştırıldığında bu sayaç örnek başına tutulur. O aşamada Redis /
 * Memorystore tabanlı ortak bir sayaca geçilmelidir; arayüz aynı kalabilir.
 */

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();

/** Bellekte sonsuz büyümeyi engellemek için üst sınır. */
const MAX_KEYS = 10_000;

export type RateLimitRule = {
  /** Pencere içinde izin verilen en fazla istek sayısı. */
  limit: number;
  /** Pencere uzunluğu (milisaniye). */
  windowMs: number;
};

export const RATE_LIMITS = {
  login: { limit: 10, windowMs: 5 * 60 * 1000 },
  register: { limit: 5, windowMs: 15 * 60 * 1000 },
  forgotPassword: { limit: 5, windowMs: 15 * 60 * 1000 },
  resetPassword: { limit: 10, windowMs: 15 * 60 * 1000 },
} as const satisfies Record<string, RateLimitRule>;

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  /** Sınır aşıldıysa kaç saniye sonra tekrar denenebileceği. */
  retryAfterSeconds: number;
};

export function checkRateLimit(
  key: string,
  rule: RateLimitRule,
): RateLimitResult {
  const now = Date.now();

  if (buckets.size > MAX_KEYS) {
    pruneExpired(now);
    if (buckets.size > MAX_KEYS) buckets.clear();
  }

  const bucket = buckets.get(key) ?? { hits: [] };
  const windowStart = now - rule.windowMs;
  const hits = bucket.hits.filter((timestamp) => timestamp > windowStart);

  if (hits.length >= rule.limit) {
    buckets.set(key, { hits });
    const retryAfterMs = hits[0] + rule.windowMs - now;
    return {
      success: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  hits.push(now);
  buckets.set(key, { hits });

  return {
    success: true,
    remaining: rule.limit - hits.length,
    retryAfterSeconds: 0,
  };
}

/** Başarılı işlemden sonra sayacı sıfırlamak için (ör. doğru şifre girildi). */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

function pruneExpired(now: number): void {
  const longestWindow = Math.max(
    ...Object.values(RATE_LIMITS).map((rule) => rule.windowMs),
  );
  for (const [key, bucket] of buckets) {
    const alive = bucket.hits.filter((t) => t > now - longestWindow);
    if (alive.length === 0) buckets.delete(key);
    else bucket.hits = alive;
  }
}

/** Kullanıcıya gösterilecek Türkçe mesaj. */
export function rateLimitMessage(retryAfterSeconds: number): string {
  const minutes = Math.ceil(retryAfterSeconds / 60);
  return `Çok fazla deneme yapıldı. Lütfen ${minutes} dakika sonra tekrar deneyin.`;
}
