import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const redirectUri = `${origin}/api/auth/callback/google`;
    const url = getAuthUrl(redirectUri);
    return NextResponse.redirect(url);
  } catch (error: unknown) {
    console.error("Auth initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to initialize Google authentication" },
      { status: 500 }
    );
  }
}
