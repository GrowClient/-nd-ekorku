import { redirect } from "next/navigation";
import { auth } from "@/core/auth";

/** Kök adres, oturum durumuna göre yönlendirir. */
export default async function HomePage() {
  const session = await auth();
  redirect(session?.user ? "/dashboard" : "/login");
}
