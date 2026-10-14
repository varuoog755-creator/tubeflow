import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getJwtSecret(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const secret = getJwtSecret();
  // 1. Primary cookie
  let token = request.cookies.get("brh_session_token")?.value;
  // 2. Fallback to legacy cookie
  if (!token) {
    token = request.cookies.get("tf_session_token")?.value;
  }
  // 3. Fallback to URL token query parameter
  const urlToken = request.nextUrl.searchParams.get("token");
  if (!token && urlToken) {
    token = urlToken;
  }

  let authenticated = false;

  if (secret && token) {
    try {
      const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
      authenticated =
        typeof payload.userId === "string" &&
        payload.userId.length > 0 &&
        typeof payload.email === "string" &&
        payload.email.length > 0 &&
        typeof payload.workspaceId === "string" &&
        payload.workspaceId.length > 0;
    } catch {
      authenticated = false;
    }
  }

  if (!authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  // Persist / refresh the 30-day session cookie so active sessions never expire
  if (token) {
    response.cookies.set("brh_session_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

