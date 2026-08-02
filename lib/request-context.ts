import { headers } from "next/headers";

/**
 * İstemci IP adresini ters vekil (reverse proxy) başlıklarından okur.
 * Cloud Run / App Engine / Vercel arkasında `x-forwarded-for` ilk değeri
 * gerçek istemcidir. Bulunamazsa hız sınırlama için sabit bir anahtar döner.
 */
export async function getClientIp(): Promise<string> {
  const headerList = await headers();

  const forwardedFor = headerList.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }

  return (
    headerList.get("x-real-ip") ??
    headerList.get("cf-connecting-ip") ??
    "unknown"
  );
}
