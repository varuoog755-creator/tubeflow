import { NextRequest, NextResponse } from "next/server";
import { oauth2Client, getYoutubeClient } from "@/lib/youtube";
import { supabaseAdmin } from "@/lib/supabase";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tubeflow-195u4q2pb-varuoog755-creators-projects.vercel.app";

  if (error || !code) {
    return NextResponse.redirect(`${appUrl}/dashboard?auth_error=${encodeURIComponent(error || "no_code")}`);
  }

  try {
    // 1. Exchange code for access & refresh tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 2. Fetch Google User Profile
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
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
      // Create record in auth.users or profiles
      const { data: newProfile, error: profileErr } = await supabaseAdmin
        .from("profiles")
        .insert({
          id: crypto.randomUUID(),
          email,
          full_name: name,
          avatar_url: avatar,
        })
        .select("id")
        .single();

      if (profileErr || !newProfile) {
        throw new Error(profileErr?.message || "Failed to create profile");
      }
      userId = newProfile.id;
    }

    // 4. Fetch YouTube Channel details
    const youtube = getYoutubeClient(tokens.access_token || "", tokens.refresh_token || "");
    const channelRes = await youtube.channels.list({
      part: ["snippet", "statistics"],
      mine: true,
    });

    const channelItem = channelRes.data.items?.[0];
    const channelId = channelItem?.id || `channel_${Date.now()}`;
    const channelTitle = channelItem?.snippet?.title || `${name}'s YouTube Channel`;
    const channelThumbnail = channelItem?.snippet?.thumbnails?.default?.url || avatar;

    const tokenExpiry = tokens.expiry_date
      ? new Date(tokens.expiry_date).toISOString()
      : new Date(Date.now() + 3600 * 1000).toISOString();

    // 5. Store / Update YouTube Channel connection in DB
    await supabaseAdmin
      .from("youtube_channels")
      .upsert(
        {
          user_id: userId,
          channel_id: channelId,
          channel_title: channelTitle,
          thumbnail_url: channelThumbnail,
          access_token: tokens.access_token || "",
          refresh_token: tokens.refresh_token || "",
          token_expiry: tokenExpiry,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,channel_id" }
      );

    // 6. Set auth session cookie and redirect to dashboard
    const response = NextResponse.redirect(`${appUrl}/dashboard?connected=true`);
    response.cookies.set("tf_user_email", email, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (err: unknown) {
    console.error("OAuth Callback failed:", err);
    return NextResponse.redirect(`${appUrl}/dashboard?auth_error=callback_failed`);
  }
}
