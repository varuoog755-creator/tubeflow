import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "tubeflow_super_secret_session_jwt_key_2026_xyz!"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard and all /dashboard/* subpaths
  if (pathname.startsWith("/dashboard")) {
    const sessionToken = request.cookies.get("tf_session_token")?.value;
    const legacyEmail = request.cookies.get("tf_user_email")?.value;

    let isAuthenticated = false;

    if (sessionToken) {
      try {
        await jwtVerify(sessionToken, JWT_SECRET);
        isAuthenticated = true;
      } catch {
        isAuthenticated = false;
      }
    } else if (legacyEmail) {
      isAuthenticated = true;
    }

    if (!isAuthenticated) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("auth_required", "true");
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
