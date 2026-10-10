import { NextRequest, NextResponse } from "next/server";
import { getOAuth2Client, getYoutubeClient } from "@/lib/youtube";
import { supabaseAdmin } from "@/lib/supabase";
import { createSessionToken, setSessionCookie } from "@/lib/session";
import { google } from "googleapis";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const rawState = searchParams.get("state");
  const origin = request.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/callback/google`;

  let mode = "connect_youtube";
  if (rawState) {
    try {
      const parsed = JSON.parse(Buffer.from(rawState, "base64").toString("utf-8"));
      mode = parsed.mode || mode;
    } catch {
      // ignore
    }
  }

  if (error || !code) {
    return NextResponse.redirect(`${origin}/dashboard?auth_error=${encodeURIComponent(error || "no_code")}`);
  }

  try {
    // 1. Exchange code for access & refresh tokens
    const authClient = getOAuth2Client(redirectUri);
    const { tokens } = await authClient.getToken(code);
    authClient.setCredentials(tokens);

    // 2. Fetch Google User Profile
    const oauth2 = google.oauth2({ version: "v2", auth: authClient });
    const userInfo = await oauth2.userinfo.get();
    const email = userInfo.data.email;
    const name = userInfo.data.name || "Creator";
    const avatar = userInfo.data.picture || null;

    if (!email) {
      throw new Error("Unable to retrieve Google email address");
    }

    // 3. Upsert Creator Profile in Supabase
    let userId: string;
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingProfile) {
      userId = existingProfile.id;
      await supabaseAdmin
        .from("profiles")
        .update({ full_name: name, avatar_url: avatar, updated_at: new Date().toISOString() })
        .eq("id", userId);
    } else {
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const existingAuthUser = userList?.users?.find((u) => u.email === email);
      if (existingAuthUser) {
        userId = existingAuthUser.id;
      } else {
        const { data: createdUser } = await supabaseAdmin.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { full_name: name, avatar_url: avatar },
        });
        userId = createdUser?.user?.id || crypto.randomUUID();
      }

      await supabaseAdmin
        .from("profiles")
        .upsert({
          id: userId,
          email,
          full_name: name,
          avatar_url: avatar,
          updated_at: new Date().toISOString(),
        });
    }

    // 4. Ensure Default Workspace exists for this user
    let workspaceId: string;
    const { data: existingWorkspace } = await supabaseAdmin
      .from("workspaces")
      .select("id")
      .eq("owner_id", userId)
      .maybeSingle();

    if (existingWorkspace) {
      workspaceId = existingWorkspace.id;
    } else {
      const slug = `${email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: newWorkspace } = await supabaseAdmin
        .from("workspaces")
        .insert({
          name: `${name}'s Workspace`,
          slug,
          owner_id: userId,
          plan: "free",
          plan_status: "active",
        })
        .select("id")
        .single();

      workspaceId = newWorkspace?.id || crypto.randomUUID();

      // Add to workspace_members as owner
      await supabaseAdmin
        .from("workspace_members")
        .insert({
          workspace_id: workspaceId,
          user_id: userId,
          role: "owner",
        });
    }

    // 5. Fetch and upsert YouTube channel info whenever tokens.access_token is present
    if (tokens.access_token) {
      try {
        const youtube = getYoutubeClient(tokens.access_token, tokens.refresh_token || "");
        const channelRes = await youtube.channels.list({
          part: ["snippet", "statistics"],
          mine: true,
        });

        const channelItem = channelRes.data.items?.[0];
        if (channelItem) {
          const channelId = channelItem.id!;
          const channelTitle = channelItem.snippet?.title || `${name}'s Channel`;
          const channelThumbnail = channelItem.snippet?.thumbnails?.default?.url || avatar;
          const customUrl = channelItem.snippet?.customUrl || null;
          const subCount = parseInt(channelItem.statistics?.subscriberCount || "0", 10);
          const videoCount = parseInt(channelItem.statistics?.videoCount || "0", 10);
          const viewCount = parseInt(channelItem.statistics?.viewCount || "0", 10);

          const tokenExpiry = tokens.expiry_date
            ? new Date(tokens.expiry_date).toISOString()
            : new Date(Date.now() + 3600 * 1000).toISOString();

          // Preserve existing refresh_token if new one was not returned by Google
          let refreshTokenToSave = tokens.refresh_token || "";
          if (!refreshTokenToSave) {
            const { data: existingChannel } = await supabaseAdmin
              .from("youtube_channels")
              .select("refresh_token")
              .eq("user_id", userId)
              .eq("channel_id", channelId)
              .maybeSingle();
            if (existingChannel?.refresh_token) {
              refreshTokenToSave = existingChannel.refresh_token;
            }
          }

          await supabaseAdmin
            .from("youtube_channels")
            .upsert(
              {
                user_id: userId,
                workspace_id: workspaceId,
                channel_id: channelId,
                channel_title: channelTitle,
                thumbnail_url: channelThumbnail,
                custom_url: customUrl,
                subscriber_count: subCount,
                video_count: videoCount,
                view_count: viewCount,
                access_token: tokens.access_token,
                refresh_token: refreshTokenToSave,
                token_expiry: tokenExpiry,
                is_active: true,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "user_id,channel_id" }
            );
        }
      } catch (ytError) {
        console.warn("YouTube channel fetch during login warning:", ytError);
      }
    }

    // 6. Issue secure Signed JWT Session Cookie
    const sessionToken = await createSessionToken({
      userId,
      email,
      fullName: name,
      avatarUrl: avatar,
      workspaceId,
    });

    const response = NextResponse.redirect(`${origin}/dashboard?authenticated=true`);
    setSessionCookie(response, sessionToken);

    return response;
  } catch (err: unknown) {
    console.error("OAuth Callback failed:", err);
    return NextResponse.redirect(`${origin}/dashboard?auth_error=callback_failed`);
  }
}
