import NextAuth from "next-auth";
import { authConfig } from "./config";

/**
 * Middleware için hafif Auth.js örneği. Yalnızca oturum çerezini çözer;
 * veritabanına erişmez, bu yüzden edge çalışma ortamında sorunsuz çalışır.
 */
export const { auth: authEdge } = NextAuth(authConfig);
