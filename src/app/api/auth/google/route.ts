import { NextRequest, NextResponse } from "next/server";
import { getAppUrl } from "@/lib/youtube";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const redirectUri = `${origin}/api/auth/callback/google`;
    
    // Check if this is an app login or YouTube channel connection
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get("mode") || "connect_youtube"; // 'login' or 'connect_youtube'

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUri
    );

    const scopes = mode === "login"
      ? [
          "openid",
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
        ]
      : [
          "openid",
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/youtube.force-ssl",
          "https://www.googleapis.com/auth/youtube.readonly",
        ];

    const state = JSON.stringify({ mode, origin });

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: scopes,
      include_granted_scopes: true,
      state: Buffer.from(state).toString("base64"),
    });

    return NextResponse.redirect(authUrl);
  } catch (error: unknown) {
    console.error("Auth initiation failed:", error);
    return NextResponse.json(
      { error: "Failed to initialize Google authentication" },
      { status: 500 }
    );
  }
}
