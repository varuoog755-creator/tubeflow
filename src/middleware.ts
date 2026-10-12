import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const UNIFORM_SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "bigredhub_super_secret_jwt_session_auth_key_2026_prod_vault_x99!";

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(UNIFORM_SESSION_SECRET);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard, /admin, and their subpaths
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    let sessionToken = request.cookies.get("tf_session_token")?.value;

    if (!sessionToken) {
      const authHeader = request.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        sessionToken = authHeader.substring(7).trim();
      }
    }

    if (!sessionToken) {
      sessionToken = request.nextUrl.searchParams.get("token") || undefined;
    }

    let isAuthenticated = false;

    if (sessionToken) {
      try {
        await jwtVerify(sessionToken, getJwtSecret());
        isAuthenticated = true;
      } catch {
        // Fallback for tokens signed with SUPABASE_SERVICE_ROLE_KEY or legacy key
        const fallbacks = [
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          "bigredhub_super_secret_jwt_session_auth_key_2026_prod!",
        ].filter(Boolean) as string[];

        for (const fb of fallbacks) {
          try {
            await jwtVerify(sessionToken, new TextEncoder().encode(fb));
            isAuthenticated = true;
            break;
          } catch {
            continue;
          }
        }
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
