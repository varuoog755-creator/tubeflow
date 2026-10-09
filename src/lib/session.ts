import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "tubeflow_super_secret_session_jwt_key_2026_xyz!"
);

const SESSION_COOKIE_NAME = "tf_session_token";

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
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      fullName: payload.fullName as string,
      avatarUrl: (payload.avatarUrl as string) || null,
      workspaceId: payload.workspaceId as string,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      // Graceful backward-compatibility check for legacy email cookie during upgrade
      const legacyEmail = cookieStore.get("tf_user_email")?.value;
      if (legacyEmail) {
        return {
          userId: "legacy",
          email: legacyEmail,
          fullName: "Creator",
          avatarUrl: null,
          workspaceId: "default",
        };
      }
      return null;
    }
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export function setSessionCookie(response: any, token: string): void {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export function clearSessionCookie(response: any): void {
  response.cookies.delete(SESSION_COOKIE_NAME);
  response.cookies.delete("tf_user_email");
}
