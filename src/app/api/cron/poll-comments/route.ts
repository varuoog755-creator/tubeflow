import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getYoutubeClient } from "@/lib/youtube";

// Spintax helper: transforms "{Hey|Hello|Hi} grab the link {here|below}"
function parseSpintax(text: string): string {
  const matches = text.match(/{([^{}]+)}/g);
  if (!matches) return text;
  let result = text;
  matches.forEach((match) => {
    const choices = match.slice(1, -1).split("|");
    const choice = choices[Math.floor(Math.random() * choices.length)];
    result = result.replace(match, choice);
  });
  return result;
}

export async function GET(request: NextRequest) {
  // Can be called via cron job or webhook
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "tubeflow_cron_secret";

  const { searchParams } = new URL(request.url);
  const manual = searchParams.get("manual") === "true";

  if (!manual && authHeader !== `Bearer ${cronSecret}`) {
    // allow manual run for dashboard testing
  }

  try {
    // 1. Fetch active channels and their campaigns
    const { data: channels } = await supabaseAdmin
      .from("youtube_channels")
      .select("*, campaigns(*)")
      .eq("is_active", true);

    if (!channels || channels.length === 0) {
      return NextResponse.json({ message: "No active channels to process", processedCount: 0 });
    }

    let processedCount = 0;
    const executionResults = [];

    for (const channel of channels) {
      const activeCampaigns = channel.campaigns?.filter((c: { is_active: boolean }) => c.is_active) || [];
      if (activeCampaigns.length === 0) continue;

      if (!channel.access_token || channel.access_token === "demo") {
        executionResults.push({ channel: channel.channel_title, status: "skipped_demo_token" });
        continue;
      }

      try {
        const youtube = getYoutubeClient(channel.access_token, channel.refresh_token);

        // Fetch recent comments from the channel
        const commentsRes = await youtube.commentThreads.list({
          part: ["snippet"],
          allThreadsRelatedToChannelId: channel.channel_id,
          maxResults: 15,
          order: "time",
        });

        const threads = commentsRes.data.items || [];

        for (const thread of threads) {
          const topComment = thread.snippet?.topLevelComment;
          if (!topComment) continue;

          const commentId = topComment.id!;
          const commentText = (topComment.snippet?.textDisplay || "").trim();
          const authorName = topComment.snippet?.authorDisplayName || "Viewer";
          const videoId = thread.snippet?.videoId || "unknown";

          // Check if already processed in logs
          const { data: existingLog } = await supabaseAdmin
            .from("comment_logs")
            .select("id")
            .eq("comment_id", commentId)
            .maybeSingle();

          if (existingLog) continue; // Already replied

          // Match against active campaigns
          for (const campaign of activeCampaigns) {
            const hasKeyword = campaign.keywords.some((kw: string) =>
              commentText.toUpperCase().includes(kw.toUpperCase())
            );

            if (hasKeyword) {
              // Prepare reply with spintax
              const template =
                campaign.reply_templates[
                  Math.floor(Math.random() * campaign.reply_templates.length)
                ] || "Hey, check out the link!";

              const replyText = parseSpintax(template);

              // Post auto-reply using YouTube Data API
              await youtube.comments.insert({
                part: ["snippet"],
                requestBody: {
                  snippet: {
                    parentId: commentId,
                    textOriginal: replyText,
                  },
                },
              });

              // Log success in DB
              await supabaseAdmin.from("comment_logs").insert({
                campaign_id: campaign.id,
                channel_id: channel.id,
                video_id: videoId,
                comment_id: commentId,
                author_name: authorName,
                comment_text: commentText,
                reply_sent: replyText,
                status: "replied",
              });

              processedCount++;
              break; // Replied once per comment
            }
          }
        }

        executionResults.push({ channel: channel.channel_title, status: "success" });
      } catch (channelErr: unknown) {
        console.error(`Error processing channel ${channel.channel_title}:`, channelErr);
        executionResults.push({ channel: channel.channel_title, status: "error" });
      }
    }

    return NextResponse.json({
      success: true,
      processedCount,
      results: executionResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Auto-reply worker error:", error);
    return NextResponse.json({ error: "Failed to process auto-replies" }, { status: 500 });
  }
}
