import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { getValidYoutubeClient } from "@/lib/youtube";

export const dynamic = "force-dynamic";

// GET all connected channels for the user's workspace
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email || request.cookies.get("tf_user_email")?.value;

    if (!email) {
      return NextResponse.json({ channels: [] }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ channels: [] });
    }

    const { data: channels } = await supabaseAdmin
      .from("youtube_channels")
      .select(
        "id, channel_id, channel_title, thumbnail_url, custom_url, subscriber_count, video_count, view_count, is_active, token_expiry, created_at, updated_at"
      )
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ channels: channels || [] });
  } catch (error: unknown) {
    console.error("Fetch channels error:", error);
    return NextResponse.json({ error: "Failed to fetch channels" }, { status: 500 });
  }
}

// POST switch active channel or refresh metrics
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email || request.cookies.get("tf_user_email")?.value;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, channelDbId } = body;

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (action === "sync_metrics") {
      const { data: channel } = await supabaseAdmin
        .from("youtube_channels")
        .select("*")
        .eq("id", channelDbId)
        .eq("user_id", profile.id)
        .single();

      if (!channel || !channel.access_token) {
        return NextResponse.json({ error: "Channel not found or token missing" }, { status: 404 });
      }

      const youtube = await getValidYoutubeClient({
        id: channel.id,
        access_token: channel.access_token,
        refresh_token: channel.refresh_token,
        token_expiry: channel.token_expiry,
      });

      const res = await youtube.channels.list({
        part: ["statistics", "snippet"],
        id: [channel.channel_id],
      });

      const item = res.data.items?.[0];
      if (item) {
        const subscriberCount = parseInt(item.statistics?.subscriberCount || "0", 10);
        const videoCount = parseInt(item.statistics?.videoCount || "0", 10);
        const viewCount = parseInt(item.statistics?.viewCount || "0", 10);

        await supabaseAdmin
          .from("youtube_channels")
          .update({
            subscriber_count: subscriberCount,
            video_count: videoCount,
            view_count: viewCount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", channelDbId);

        return NextResponse.json({
          success: true,
          metrics: { subscriberCount, videoCount, viewCount },
        });
      }
    }

    if (action === "disconnect") {
      await supabaseAdmin
        .from("youtube_channels")
        .delete()
        .eq("id", channelDbId)
        .eq("user_id", profile.id);

      return NextResponse.json({ success: true, message: "Channel disconnected" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Channel action error:", error);
    return NextResponse.json({ error: "Channel operation failed" }, { status: 500 });
  }
}
