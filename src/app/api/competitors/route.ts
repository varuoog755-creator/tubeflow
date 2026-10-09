import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { getYoutubeClient } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email;
    if (!email || !session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    const { data: workspace } = await supabaseAdmin
      .from("workspaces")
      .select("id")
      .eq("owner_id", profile?.id)
      .maybeSingle();

    const { data: competitors } = await supabaseAdmin
      .from("competitors")
      .select("*")
      .eq("workspace_id", workspace?.id)
      .order("created_at", { ascending: false });

    return NextResponse.json({ competitors: competitors || [] });
  } catch (error: unknown) {
    console.error("Fetch competitors error:", error);
    return NextResponse.json({ error: "Failed to fetch competitors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email;
    const body = await request.json();
    const { channelHandleOrId } = body;

    if (!channelHandleOrId) {
      return NextResponse.json({ error: "Channel handle or ID is required" }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    const { data: workspace } = await supabaseAdmin
      .from("workspaces")
      .select("id")
      .eq("owner_id", profile?.id)
      .maybeSingle();

    // 1. Fetch channel info using active YouTube API client
    const { data: activeChannel } = await supabaseAdmin
      .from("youtube_channels")
      .select("access_token, refresh_token")
      .eq("user_id", profile?.id)
      .maybeSingle();

    let channelTitle = "Competitor Creator";
    let channelId = channelHandleOrId;
    let subscriberCount = 0;
    let videoCount = 0;
    let totalViews = 0;
    let thumbnailUrl = null;
    let customUrl = channelHandleOrId.startsWith("@") ? channelHandleOrId : `@${channelHandleOrId}`;

    if (activeChannel?.access_token) {
      try {
        const youtube = getYoutubeClient(activeChannel.access_token, activeChannel.refresh_token);
        
        // Search channel by handle or query
        const searchRes = await youtube.search.list({
          part: ["snippet"],
          q: channelHandleOrId,
          type: ["channel"],
          maxResults: 1,
        });

        const found = searchRes.data.items?.[0];
        if (found && found.snippet) {
          channelId = found.snippet.channelId || channelId;
          channelTitle = found.snippet.title || channelTitle;
          thumbnailUrl = found.snippet.thumbnails?.default?.url || null;

          // Fetch full statistics
          const statsRes = await youtube.channels.list({
            part: ["statistics", "snippet"],
            id: [channelId],
          });

          const statItem = statsRes.data.items?.[0];
          if (statItem) {
            subscriberCount = parseInt(statItem.statistics?.subscriberCount || "0", 10);
            videoCount = parseInt(statItem.statistics?.videoCount || "0", 10);
            totalViews = parseInt(statItem.statistics?.viewCount || "0", 10);
            customUrl = statItem.snippet?.customUrl || customUrl;
          }
        }
      } catch (ytErr) {
        console.warn("YouTube API competitor fetch fallback:", ytErr);
      }
    }

    // 2. Insert into competitors table
    const { data: competitor, error: insertErr } = await supabaseAdmin
      .from("competitors")
      .insert({
        workspace_id: workspace?.id,
        competitor_channel_id: channelId,
        channel_title: channelTitle,
        custom_url: customUrl,
        thumbnail_url: thumbnailUrl,
        subscriber_count: subscriberCount,
        video_count: videoCount,
        total_views: totalViews,
      })
      .select("*")
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, competitor });
  } catch (error: unknown) {
    console.error("Add competitor error:", error);
    return NextResponse.json({ error: "Failed to add competitor" }, { status: 500 });
  }
}
