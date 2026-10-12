import { NextRequest, NextResponse } from "next/server";
import { getSession, verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie");
  const rawCookieFromRequest = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = await getSession(request);
  const verifyDirect = rawCookieFromRequest ? await verifySessionToken(rawCookieFromRequest) : null;

  return NextResponse.json({
    hasCookieHeader: Boolean(cookieHeader),
    cookieHeaderPreview: cookieHeader ? cookieHeader.substring(0, 100) : null,
    hasRawCookie: Boolean(rawCookieFromRequest),
    rawCookieLength: rawCookieFromRequest ? rawCookieFromRequest.length : 0,
    sessionResolved: Boolean(session),
    sessionEmail: session?.email || null,
    verifyDirectResolved: Boolean(verifyDirect),
  });
}
