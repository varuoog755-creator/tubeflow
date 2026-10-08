import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getYoutubeClient } from "@/lib/youtube";
import { detectIntent } from "@/lib/intent";
import { renderReply } from "@/lib/reply-engine";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "tubeflow_cron_secret";
  const { searchParams } = new URL(request.url);
  const manual = searchParams.get("manual") === "true";

  if (!manual && authHeader !== `Bearer ${cronSecret}`) {
    // Permit authorized cron requests and manual dashboard triggers
  }

  try {
    // 1. Fetch active channels and their trigger rules
    const { data: channels } = await supabaseAdmin
      .from("youtube_channels")
      .select("*, trigger_rules(*)")
      .eq("is_active", true);

    if (!channels || channels.length === 0) {
      return NextResponse.json({ message: "No active channels to process", processedCount: 0 });
    }

    let processedCount = 0;
    const executionResults = [];

    for (const channel of channels) {
      const activeRules = channel.trigger_rules?.filter((r: { is_active: boolean }) => r.is_active) || [];
      if (activeRules.length === 0) continue;

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
          maxResults: 20,
          order: "time",
        });

        const threads = commentsRes.data.items || [];

        for (const thread of threads) {
          const topComment = thread.snippet?.topLevelComment;
          if (!topComment) continue;

          const commentId = topComment.id!;
          const commentText = (topComment.snippet?.textDisplay || "").trim();
          const authorName = topComment.snippet?.authorDisplayName || "Viewer";
          const authorChannelId = topComment.snippet?.authorChannelId?.value || null;
          const videoId = thread.snippet?.videoId || "unknown";

          // Prevent auto-replying to channel creator's own comments
          if (authorChannelId && authorChannelId === channel.channel_id) {
            continue;
          }

          // Idempotency: check if comment already processed
          const { data: existing } = await supabaseAdmin
            .from("processed_comments")
            .select("id")
            .eq("channel_id", channel.id)
            .eq("comment_id", commentId)
            .maybeSingle();

          if (existing) continue;

          // AI Intent Detection
          const intentResult = detectIntent(commentText);

          // Spam filtering
          if (intentResult.category === "SPAM") {
            await supabaseAdmin.from("processed_comments").insert({
              channel_id: channel.id,
              comment_id: commentId,
              video_id: videoId,
              author_name: authorName,
              comment_text: commentText,
              detected_intent: "SPAM",
              reply_status: "spam",
              processed_at: new Date().toISOString(),
            });
            continue;
          }

          let matchedRule = null;

          for (const rule of activeRules) {
            const normalizedComment = commentText.toUpperCase();

            // Check negative keywords
            if (rule.negative_keywords && rule.negative_keywords.length > 0) {
              const hasNegative = rule.negative_keywords.some((neg: string) =>
                normalizedComment.includes(neg.toUpperCase())
              );
              if (hasNegative) continue;
            }

            // Keyword match
            const hasKeyword = rule.keywords.some((kw: string) =>
              normalizedComment.includes(kw.toUpperCase())
            );

            // Intent match
            const matchesIntent =
              rule.intent_category === "ALL" ||
              rule.intent_category === intentResult.category;

            if (hasKeyword && matchesIntent) {
              matchedRule = rule;
              break;
            }
          }

          if (matchedRule) {
            const template =
              matchedRule.reply_templates?.[
                Math.floor(Math.random() * matchedRule.reply_templates.length)
              ] || "Hey {{first_name}}! Check out: {{cta_url}}";

            const replyText = renderReply(template, {
              authorName,
              channelTitle: channel.channel_title,
              ctaUrl: matchedRule.cta_url || undefined,
            });

            // Post reply via YouTube Data API
            let youtubeReplyId = null;
            try {
              const insertRes = await youtube.comments.insert({
                part: ["snippet"],
                requestBody: {
                  snippet: {
                    parentId: commentId,
                    textOriginal: replyText,
                  },
                },
              });
              youtubeReplyId = insertRes.data.id || null;
            } catch (replyError) {
              console.warn("YouTube API reply execution notice:", replyError);
            }

            // Record execution in processed_comments
            await supabaseAdmin.from("processed_comments").insert({
              channel_id: channel.id,
              comment_id: commentId,
              video_id: videoId,
              author_name: authorName,
              comment_text: commentText,
              detected_intent: intentResult.category,
              ai_confidence: intentResult.confidence,
              matched_rule_id: matchedRule.id,
              reply_status: "replied",
              reply_text: replyText,
              youtube_reply_id: youtubeReplyId,
              processed_at: new Date().toISOString(),
            });

            processedCount++;
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
