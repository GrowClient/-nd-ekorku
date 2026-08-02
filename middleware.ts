import { NextResponse } from "next/server";
import { authEdge } from "@/core/auth/edge";

/** Oturum açmış kullanıcının görmemesi gereken sayfalar. */
const GUEST_ONLY_ROUTES = ["/login", "/register"];
/** Oturum zorunlu olan sayfa ön ekleri. */
const PROTECTED_PREFIXES = ["/dashboard"];

export default authEdge((request) => {
  const { nextUrl } = request;
  const pathname = nextUrl.pathname;
  const isLoggedIn = Boolean(request.auth?.user);

  if (!isLoggedIn && PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const loginUrl = new URL("/login", nextUrl.origin);
    // Yalnızca uygulama içi yol taşınır (açık yönlendirme koruması).
    loginUrl.searchParams.set("callbackUrl", pathname + nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && GUEST_ONLY_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * API rotaları, Next.js statik dosyaları ve görseller hariç her istek.
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
