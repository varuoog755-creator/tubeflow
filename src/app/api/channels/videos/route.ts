import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { getValidYoutubeClient } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export interface ChannelVideoItem {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  isShort: boolean;
  videoUrl: string;
}

function parseDurationSeconds(isoDuration: string): number {
  if (!isoDuration) return 0;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email;
    if (!email || !session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Resolve Profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name")
      .eq("email", email)
      .maybeSingle();

    if (!profile) return NextResponse.json({ error: "User profile not found" }, { status: 404 });

    // 2. Fetch User's Channel
    const { data: channel } = await supabaseAdmin
      .from("youtube_channels")
      .select("*")
      .eq("user_id", profile.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .maybeSingle();

    if (!channel || !channel.access_token || channel.access_token === "demo") {
      return NextResponse.json({
        channel: channel || null,
        videos: [],
        totals: { totalVideos: 0, totalViews: 0, totalLikes: 0, totalComments: 0 },
        notice: "Connect a real YouTube channel to load live video metrics.",
      });
    }

    // 3. Attempt live YouTube Data API v3 query
    try {
      const youtube = await getValidYoutubeClient({
        id: channel.id,
        access_token: channel.access_token,
        refresh_token: channel.refresh_token,
        token_expiry: channel.token_expiry,
      });

      // Get Uploads playlist ID
      const channelRes = await youtube.channels.list({
        part: ["contentDetails", "statistics", "snippet"],
        id: [channel.channel_id],
      });

      const uploadsPlaylistId =
        channelRes.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        throw new Error("Uploads playlist not found");
      }

      // Fetch latest videos in playlist
      const playlistRes = await youtube.playlistItems.list({
        part: ["snippet", "contentDetails"],
        playlistId: uploadsPlaylistId,
        maxResults: 20,
      });

      const videoIds = (playlistRes.data.items || [])
        .map((item) => item.contentDetails?.videoId)
        .filter(Boolean) as string[];

      if (videoIds.length === 0) {
        return NextResponse.json({
          channel,
          videos: [],
          totals: { totalVideos: 0, totalViews: 0, totalLikes: 0, totalComments: 0 },
        });
      }

      // Fetch statistics for each video
      const videosRes = await youtube.videos.list({
        part: ["snippet", "statistics", "contentDetails"],
        id: videoIds,
      });

      const liveVideos: ChannelVideoItem[] = (videosRes.data.items || []).map((v) => {
        const sec = parseDurationSeconds(v.contentDetails?.duration || "PT0S");
        const isShort = sec <= 60 || (v.snippet?.title || "").toLowerCase().includes("#shorts");
        return {
          id: v.id!,
          title: v.snippet?.title || "Untitled Video",
          thumbnail:
            v.snippet?.thumbnails?.maxres?.url ||
            v.snippet?.thumbnails?.high?.url ||
            v.snippet?.thumbnails?.default?.url ||
            "",
          publishedAt: v.snippet?.publishedAt || new Date().toISOString(),
          viewCount: parseInt(v.statistics?.viewCount || "0", 10),
          likeCount: parseInt(v.statistics?.likeCount || "0", 10),
          commentCount: parseInt(v.statistics?.commentCount || "0", 10),
          duration: formatDuration(sec),
          isShort,
          videoUrl: isShort
            ? `https://youtube.com/shorts/${v.id}`
            : `https://youtube.com/watch?v=${v.id}`,
        };
      });

      return NextResponse.json({
        channel,
        videos: liveVideos,
        totals: {
          totalVideos: liveVideos.length,
          totalViews: liveVideos.reduce((acc, v) => acc + v.viewCount, 0),
          totalLikes: liveVideos.reduce((acc, v) => acc + v.likeCount, 0),
          totalComments: liveVideos.reduce((acc, v) => acc + v.commentCount, 0),
        },
      });
    } catch (apiError) {
      console.error("Live YouTube videos fetch failed:", apiError);
      return NextResponse.json({
        channel,
        videos: [],
        totals: { totalVideos: 0, totalViews: 0, totalLikes: 0, totalComments: 0 },
        error: "Live YouTube video metrics are temporarily unavailable. Reconnect the channel or retry shortly.",
      }, { status: 502 });
    }
  } catch (error: unknown) {
    console.error("Fetch channel videos error:", error);
    return NextResponse.json({ error: "Failed to fetch channel videos" }, { status: 500 });
  }
}
