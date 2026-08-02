import type { Metadata, Viewport } from "next";
import { warnOnMissingEnv } from "@/lib/env";
import "./globals.css";

warnOnMissingEnv();

export const metadata: Metadata = {
  title: {
    default: "barkERP",
    template: "%s · barkERP",
  },
  description:
    "Modüler, çok kiracılı SaaS ERP altyapısı. Sektörünüze göre açıp kapatabileceğiniz modüller.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Mobil klavye açıldığında görünür alanın doğru hesaplanması için
  viewportFit: "cover",
  themeColor: "#1b308b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
