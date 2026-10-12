import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getJwtSecret(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "bigredhub_super_secret_jwt_session_auth_key_2026_prod!";
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard, /admin, and their subpaths
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get("tf_session_token")?.value;

    let isAuthenticated = false;

    if (sessionToken) {
      try {
        await jwtVerify(sessionToken, getJwtSecret());
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    }

    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      if (request.nextUrl.search) {
        loginUrl.search = request.nextUrl.search;
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
