import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// This legacy endpoint previously created sessions from caller-supplied email/name
// query parameters. Keep it explicitly disabled so old links cannot mint sessions.
export async function GET() {
  return NextResponse.json(
    {
      error: "This login endpoint has been disabled. Use the verified Google OAuth flow.",
      code: "CUSTOMER_LOGIN_DISABLED",
    },
    { status: 410, headers: { "Cache-Control": "no-store" } }
  );
}
