import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAppUrl } from "@/lib/youtube";
import { google } from "googleapis";

import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const redirectUri = `${getAppUrl()}/api/auth/callback/google`;
    const { searchParams } = new URL(request.url);
    const requestedMode = searchParams.get("mode") || "login";
    const isChannelConnect = requestedMode === "connect_youtube" || requestedMode === "channel";
    const mode = isChannelConnect ? "connect_youtube" : "login";

    let clientId = process.env.GOOGLE_CLIENT_ID;
    let clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    let isByokAuth = false;

    // For paid/agency users who configured BYOK custom credentials:
    if (isChannelConnect) {
      const session = await getSession(request);
      if (session?.workspaceId) {
        const { data: ws } = await supabaseAdmin
          .from("workspaces")
          .select("byok_enabled, byok_client_id, byok_client_secret")
          .eq("id", session.workspaceId)
          .maybeSingle();

        if (ws?.byok_enabled && ws?.byok_client_id?.trim() && ws?.byok_client_secret?.trim()) {
          clientId = ws.byok_client_id.trim();
          clientSecret = ws.byok_client_secret.trim();
          isByokAuth = true;
        }
      }
    }

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "Google OAuth is not configured" }, { status: 503 });
    }

    const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    const state = randomBytes(32).toString("hex");

    // Basic identity scopes for sign-in: 100% non-sensitive, completely eliminates the
    // "Google hasn't verified this app" warning screen during user login.
    const basicScopes = [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    // Sensitive YouTube scopes requested ONLY when the user is explicitly connecting a YouTube channel.
    const channelScopes = [
      ...basicScopes,
      "https://www.googleapis.com/auth/youtube.force-ssl",
      "https://www.googleapis.com/auth/youtube.readonly",
    ];

    const scopes = isChannelConnect ? channelScopes : basicScopes;

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: isChannelConnect ? "consent" : "select_account",
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
    response.cookies.set("tf_oauth_byok", isByokAuth ? "true" : "false", cookieOptions);
    return response;
  } catch (error: unknown) {
    console.error("Auth initiation failed:", error);
    return NextResponse.json({ error: "Failed to initialize Google authentication" }, { status: 500 });
  }
}
