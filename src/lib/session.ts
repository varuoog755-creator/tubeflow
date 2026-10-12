import { SignJWT, jwtVerify } from "jose";

const UNIFORM_SESSION_SECRET =
  process.env.SESSION_SECRET ||
  "bigredhub_super_secret_jwt_session_auth_key_2026_prod_vault_x99!";

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(UNIFORM_SESSION_SECRET);
}

export const SESSION_COOKIE_NAME = "tf_session_token";

export interface UserSession {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  workspaceId: string;
}

export async function createSessionToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  if (!token) return null;

  // 1. Primary verification with uniform secret
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
      avatarUrl: (payload.avatarUrl as string) || null,
      workspaceId: payload.workspaceId as string,
    };
  } catch {
    // 2. Fallback verification for tokens signed with previous service key or legacy fallback
    const fallbacks = [
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      "bigredhub_super_secret_jwt_session_auth_key_2026_prod!",
    ].filter(Boolean) as string[];

    for (const fb of fallbacks) {
      try {
        const { payload } = await jwtVerify(token, new TextEncoder().encode(fb));
        return {
          userId: payload.userId as string,
          email: payload.email as string,
          fullName: payload.fullName as string,
          avatarUrl: (payload.avatarUrl as string) || null,
          workspaceId: payload.workspaceId as string,
        };
      } catch {
        continue;
      }
    }

    return null;
  }
}

export async function getSession(request?: any): Promise<UserSession | null> {
  try {
    let token: string | undefined;

    // Check request cookies if request object provided
    if (request?.cookies) {
      if (typeof request.cookies.get === "function") {
        token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      } else if (request.cookies[SESSION_COOKIE_NAME]) {
        token = request.cookies[SESSION_COOKIE_NAME];
      }
    }

    // Check request Authorization header
    if (!token && request?.headers) {
      const authHeader =
        typeof request.headers.get === "function"
          ? request.headers.get("authorization")
          : request.headers["authorization"];
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    }

    // Fallback to Next.js headers cookies()
    if (!token) {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    }

    if (!token) {
      return null;
    }

    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function setSessionCookie(response: any, token: string): void {
  const thirtyDays = 60 * 60 * 24 * 30; // 30 days
  const isProd = process.env.NODE_ENV === "production";
  const expires = new Date(Date.now() + thirtyDays * 1000);

  if (response?.cookies?.set) {
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: thirtyDays,
      expires,
    });
  }

  // Explicit Set-Cookie header for Next.js redirect responses
  if (response?.headers?.append) {
    const headerVal = `${SESSION_COOKIE_NAME}=${token}; Path=/; Max-Age=${thirtyDays}; Expires=${expires.toUTCString()}; HttpOnly; ${isProd ? "Secure; " : ""}SameSite=Lax`;
    response.headers.append("Set-Cookie", headerVal);
  }
}

export function clearSessionCookie(response: any): void {
  response.cookies.delete(SESSION_COOKIE_NAME);
  response.cookies.delete("tf_user_email");
}
