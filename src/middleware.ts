import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getJwtSecret(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const secret = getJwtSecret();
  const token = request.cookies.get("tf_session_token")?.value;
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
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("tf_session_token");
    response.cookies.delete("tf_user_email");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
