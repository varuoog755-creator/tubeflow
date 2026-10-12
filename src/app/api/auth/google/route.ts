import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAppUrl } from "@/lib/youtube";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const redirectUri = `${getAppUrl()}/api/auth/callback/google`;
    const { searchParams } = new URL(request.url);
    const requestedMode = searchParams.get("mode") || "login";
    const mode = requestedMode === "connect_youtube" ? "connect_youtube" : "login";

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Google OAuth is not configured" }, { status: 503 });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const state = randomBytes(32).toString("hex");
    const scopes = [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube.readonly",
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
      include_granted_scopes: true,
      state,
    });

    const response = NextResponse.redirect(authUrl);
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 10 * 60,
    };
    response.cookies.set("tf_oauth_state", state, cookieOptions);
    response.cookies.set("tf_oauth_mode", mode, cookieOptions);
    return response;
  } catch (error: unknown) {
    console.error("Auth initiation failed:", error);
    return NextResponse.json({ error: "Failed to initialize Google authentication" }, { status: 500 });
  }
}
