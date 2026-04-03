import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Route Protection by Role ─────────────────────────────────────────────────
// Using cookie-based auth check (edge runtime compatible)
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Get session token from cookies (NextAuth sets these)
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value ||
    req.cookies.get("next-auth.session-token")?.value ||
    req.cookies.get("__Secure-next-auth.session-token")?.value;

  const isAuthenticated = !!sessionToken;

  // Farmer routes — require authentication (role check done server-side in page)
  if (pathname.startsWith("/farmer")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Admin routes — require authentication (role check done server-side in page)
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/farmer/:path*", "/admin/:path*"],
};
