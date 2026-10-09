import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "tf_session_token";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function getJwtSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must be configured with at least 32 characters");
  }
  return new TextEncoder().encode(secret);
}

export interface UserSession {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  workspaceId: string;
}

export async function createSessionToken(payload: UserSession): Promise<string> {
  if (!payload.userId || !payload.email || !payload.workspaceId) {
    throw new Error("Cannot create a session without a verified user and workspace");
  }
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"],
    });
    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.workspaceId !== "string" ||
      !payload.userId ||
      !payload.email ||
      !payload.workspaceId
    ) {
      return null;
    }
    return {
      userId: payload.userId,
      email: payload.email,
      fullName: typeof payload.fullName === "string" ? payload.fullName : "Creator",
      avatarUrl: typeof payload.avatarUrl === "string" ? payload.avatarUrl : null,
      workspaceId: payload.workspaceId,
    };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<UserSession | null> {
  try {
    const { cookies } = await import("next/headers");
    const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
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
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: any): void {
  response.cookies.delete(SESSION_COOKIE_NAME);
  // Clear old compatibility identity cookie so it cannot be reused by older code.
  response.cookies.delete("tf_user_email");
}
