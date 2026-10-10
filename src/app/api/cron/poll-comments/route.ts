import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getValidYoutubeClient, isYoutubeQuotaError, isYoutubeTokenRevoked } from "@/lib/youtube";
import { detectIntent } from "@/lib/intent";
import { renderReply, evaluateRuleMatch } from "@/lib/reply-engine";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

async function handlePoll(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET || "tubeflow_cron_secret";
  const { searchParams } = new URL(request.url);
  const manual = searchParams.get("manual") === "true";

  // Check auth: Cron header or valid session
  const session = await getSession();
  const userEmail = session?.email || null;
  const isCronAuthorized = authHeader === `Bearer ${cronSecret}`;
  const isUserAuthorized = Boolean(session?.userId);
  const isUserAdmin = userEmail ? isAdmin(userEmail) : false;

  if (!isCronAuthorized && !isUserAuthorized) {
    return NextResponse.json({ error: "Unauthorized polling execution" }, { status: 401 });
  }

  try {
    // 1. Fetch active channels and their trigger rules
    let channelsQuery = supabaseAdmin
      .from("youtube_channels")
      .select("*, trigger_rules(*)")
      .eq("is_active", true);

    // If triggered manually by a standard creator, prioritize their channel
    if (session?.userId && !isCronAuthorized && !isUserAdmin) {
      channelsQuery = channelsQuery.eq("user_id", session.userId);
    }

    const { data: channels } = await channelsQuery;

    if (!channels || channels.length === 0) {
      return NextResponse.json({
        success: true,
        commentsInspected: 0,
        repliesConfirmed: 0,
        commentsInspectedCount: 0,
        confirmedRepliesCount: 0,
        message: "No active channels found to poll.",
      });
    }

    let confirmedRepliesCount = 0;
    let commentsInspectedCount = 0;
    const executionResults = [];

    for (const channel of channels) {
      const activeRules = (channel.trigger_rules || []).filter(
        (r: { is_active: boolean }) => r.is_active
      );

      if (activeRules.length === 0) {
        executionResults.push({ channel: channel.channel_title, status: "no_active_rules" });
        continue;
      }

      // If channel does not have an OAuth token, check local queued comments
      if (!channel.access_token || channel.access_token === "demo" || channel.access_token.startsWith("demo_")) {
        // Process any queued pending comments in database for this channel
        const { data: pendingComments } = await supabaseAdmin
          .from("processed_comments")
          .select("*")
          .eq("channel_id", channel.id)
          .eq("reply_status", "pending")
          .limit(10);

        if (pendingComments && pendingComments.length > 0) {
          for (const comm of pendingComments) {
            commentsInspectedCount++;
            const intentResult = detectIntent(comm.comment_text);
            let matchedRule = null;
            for (const rule of activeRules) {
              const evalRes = evaluateRuleMatch(
                {
                  keywords: rule.keywords || [],
                  negativeKeywords: rule.negative_keywords || [],
                  matchType: rule.match_type || "contains",
                  keywordMatchOperator: rule.keyword_match_operator || "ANY",
                  intentCategory: rule.intent_category || "ALL",
                },
                comm.comment_text,
                intentResult.category
              );
              if (evalRes.matched) {
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
                authorName: comm.author_name,
                channelTitle: channel.channel_title,
                ctaUrl: matchedRule.cta_url || undefined,
              });
              await supabaseAdmin
                .from("processed_comments")
                .update({
                  reply_status: "replied",
                  reply_text: replyText,
                  youtube_reply_id: `reply_${Date.now()}`,
                  processed_at: new Date().toISOString(),
                })
                .eq("id", comm.id);
              confirmedRepliesCount++;
            }
          }
        }

        executionResults.push({
          channel: channel.channel_title,
          status: "processed_queued",
          replies: confirmedRepliesCount,
        });
        continue;
      }

      // Real live YouTube Data API channel processing
      try {
        const youtube = await getValidYoutubeClient({
          id: channel.id,
          access_token: channel.access_token,
          refresh_token: channel.refresh_token,
          token_expiry: channel.token_expiry,
        });

        // Fetch latest comment threads from YouTube
        const commentsRes = await youtube.commentThreads.list({
          part: ["snippet"],
          allThreadsRelatedToChannelId: channel.channel_id,
          maxResults: 25,
          order: "time",
        });

        const threads = commentsRes.data.items || [];

        for (const thread of threads) {
          const topComment = thread.snippet?.topLevelComment;
          if (!topComment) continue;

          commentsInspectedCount++;
          const commentId = topComment.id!;
          const commentText = (topComment.snippet?.textDisplay || "").trim();
          const authorName = topComment.snippet?.authorDisplayName || "Viewer";
          const authorChannelId = topComment.snippet?.authorChannelId?.value || null;
          const videoId = thread.snippet?.videoId || "unknown";

          // Prevent auto-replying to channel creator's own comments
          if (authorChannelId && authorChannelId === channel.channel_id) {
            continue;
          }

          // Idempotency: skip comments already processed
          const { data: existing } = await supabaseAdmin
            .from("processed_comments")
            .select("id")
            .eq("channel_id", channel.id)
            .eq("comment_id", commentId)
            .maybeSingle();

          if (existing) continue;

          // AI Intent & Spam Detection
          const intentResult = detectIntent(commentText);

          // Dedicated spam filtering
          if (intentResult.category === "SPAM") {
            await supabaseAdmin.from("processed_comments").insert({
              channel_id: channel.id,
              comment_id: commentId,
              video_id: videoId,
              author_name: authorName,
              comment_text: commentText,
              detected_intent: "SPAM",
              ai_confidence: intentResult.confidence,
              reply_status: "spam",
              processed_at: new Date().toISOString(),
            });
            continue;
          }

          // Deterministic rule evaluation
          let matchedRule = null;
          for (const rule of activeRules) {
            // Video scope filtering (All, Single video, or Shorts only)
            if (
              (rule.target_mode === "single" || rule.target_mode === "specific_videos") &&
              rule.target_video_ids?.length > 0
            ) {
              if (!rule.target_video_ids.includes(videoId)) {
                continue;
              }
            }

            const evalResult = evaluateRuleMatch(
              {
                keywords: rule.keywords || [],
                negativeKeywords: rule.negative_keywords || [],
                matchType: rule.match_type || "contains",
                keywordMatchOperator: rule.keyword_match_operator || "ANY",
                intentCategory: rule.intent_category || "ALL",
              },
              commentText,
              intentResult.category
            );

            if (evalResult.matched) {
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
            let youtubeReplyId: string | null = null;
            let replyStatus: "replied" | "error" = "replied";
            let replyErrorMessage: string | null = null;

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
              if (youtubeReplyId) {
                confirmedRepliesCount++;
              }
            } catch (replyErr: unknown) {
              replyStatus = "error";
              replyErrorMessage =
                replyErr instanceof Error ? replyErr.message : "YouTube reply post failed";
              console.error(`Reply failed for comment ${commentId}:`, replyErr);

              if (isYoutubeQuotaError(replyErr)) {
                await supabaseAdmin.from("system_alerts").insert({
                  workspace_id: channel.workspace_id,
                  type: "quota_warning",
                  title: "YouTube API Quota Reached",
                  message:
                    "Daily YouTube API quota limit reached. Automated replies will resume on quota reset.",
                });
                break;
              }
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
              reply_status: replyStatus,
              reply_text: replyText,
              youtube_reply_id: youtubeReplyId,
              error_message: replyErrorMessage,
              processed_at: new Date().toISOString(),
            });
          }
        }

        executionResults.push({ channel: channel.channel_title, status: "success" });
      } catch (channelErr: unknown) {
        console.error(`Error processing channel ${channel.channel_title}:`, channelErr);
        if (isYoutubeTokenRevoked(channelErr)) {
          await supabaseAdmin
            .from("youtube_channels")
            .update({ is_active: false })
            .eq("id", channel.id);
        }
        executionResults.push({
          channel: channel.channel_title,
          status: "error",
          error: channelErr instanceof Error ? channelErr.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      success: true,
      commentsInspected: commentsInspectedCount,
      repliesConfirmed: confirmedRepliesCount,
      commentsInspectedCount,
      confirmedRepliesCount,
      results: executionResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Auto-reply worker error:", error);
    return NextResponse.json({ error: "Failed to process auto-replies" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handlePoll(request);
}

export async function POST(request: NextRequest) {
  return handlePoll(request);
}
