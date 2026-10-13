import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getValidYoutubeClient, isYoutubeQuotaError, isYoutubeTokenRevoked } from "@/lib/youtube";
import { detectIntent } from "@/lib/intent";
import { renderReply, evaluateRuleMatch, findUnresolvedPlaceholders } from "@/lib/reply-engine";
import { getSession } from "@/lib/session";
import { getReplyAllowance, recordUsage, checkRuleGuard } from "@/lib/limits";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const { searchParams } = new URL(request.url);
  const manual = searchParams.get("manual") === "true";

  if (!manual && (!cronSecret || authHeader !== `Bearer ${cronSecret}`)) {
    return NextResponse.json({ error: "Unauthorized cron execution" }, { status: 401 });
  }

  if (manual) {
    const session = await getSession();
    if (!session?.userId || !session.workspaceId) {
      return NextResponse.json({ error: "Unauthorized user session" }, { status: 401 });
    }
  }

  try {
    // 1. Fetch active channels and their trigger rules
    let channelsQuery = supabaseAdmin
      .from("youtube_channels")
      .select("*, trigger_rules(*)")
      .eq("is_active", true);
    if (manual) {
      const session = await getSession();
      if (!session) return NextResponse.json({ error: "Unauthorized user session" }, { status: 401 });
      channelsQuery = channelsQuery.eq("user_id", session.userId).eq("workspace_id", session.workspaceId);
    }
    const { data: channels, error: channelsError } = await channelsQuery;
    if (channelsError) return NextResponse.json({ error: "Failed to load channels" }, { status: 500 });

    if (!channels || channels.length === 0) {
      return NextResponse.json({ message: "No active channels to process", processedCount: 0 });
    }

    let confirmedRepliesCount = 0;
    let commentsInspectedCount = 0;
    let skippedByGuard = 0;
    // Per-workspace reply tally, so usage_metering rows are attributed to the
    // account that actually posted rather than to every account the run touched.
    const repliesByWorkspace = new Map<string, number>();
    const executionResults = [];

    for (const channel of channels) {
      const activeRules = (channel.trigger_rules || []).filter(
        (r: { is_active: boolean }) => r.is_active
      );

      if (activeRules.length === 0) continue;

      if (!channel.access_token || channel.access_token === "demo") {
        executionResults.push({ channel: channel.channel_title, status: "skipped_demo_token" });
        continue;
      }

      try {
        // Authenticate with automatic token refresh if expired
        const youtube = await getValidYoutubeClient({
          id: channel.id,
          access_token: channel.access_token,
          refresh_token: channel.refresh_token,
          token_expiry: channel.token_expiry,
        });

        // Fetch latest comment threads from the channel
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
          let matchEvaluation = null;

          for (const rule of activeRules) {
            // Video scope filtering (All, Single video, or Shorts only)
            if (
              (rule.target_mode === "single" || rule.target_mode === "specific_videos") &&
              rule.target_video_ids?.length > 0
            ) {
              if (!rule.target_video_ids.includes(videoId)) {
                continue; // Comment is not on this rule's target video
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
              matchEvaluation = evalResult;
              break;
            }
          }

          if (matchedRule) {
            // Plan reply allowance. Checked immediately before the insert, not
            // once per run, so a single run cannot overshoot by posting every
            // remaining thread after the last reply.
            if (channel.workspace_id) {
              const allowance = await getReplyAllowance(channel.workspace_id);
              if (allowance.exhausted) {
                executionResults.push({
                  channel: channel.channel_title,
                  status: "plan_limit_reached",
                  limit: allowance.limit,
                  used: allowance.used,
                });
                await supabaseAdmin.from("notifications").insert({
                  user_id: channel.user_id,
                  workspace_id: channel.workspace_id,
                  type: "quota_warning",
                  title: "Reply limit reached",
                  message: `Your ${allowance.plan.name} plan includes ${allowance.limit} replies this period. All ${allowance.limit} are used, so no further replies will post until the period resets or you upgrade.`,
                });
                break; // stop this channel for this run
              }
            }

            // The creator's own safety settings. These were editable in the rule editor
            // and stored on the row, but the reply path never read them, so a
            // "10 replies a day / 60 minute cooldown" rule behaved like an
            // unlimited one. Checked per matched rule, not per run.
            const guard = await checkRuleGuard(channel.id, {
              id: matchedRule.id,
              max_replies_per_day: matchedRule.max_replies_per_day,
              cooldown_minutes: matchedRule.cooldown_minutes,
            });

            if (!guard.allowed) {
              skippedByGuard++;
              continue;
            }

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

            // Last line of defence before a public write. A template that still
            // contains a placeholder after rendering means the rule is
            // malformed, and posting it would show the viewer literal
            // "{{cta_url}}" text. Record the failure instead and post nothing.
            const unresolved = findUnresolvedPlaceholders(replyText);
            if (unresolved.length > 0) {
              replyStatus = "error";
              replyErrorMessage = `Reply not sent: template left ${unresolved
                .map((p) => `{{${p}}}`)
                .join(", ")} unsubstituted. Fix the reply template for rule "${matchedRule.name}".`;
              console.warn(
                `Blocked a malformed reply on channel ${channel.channel_title}:`,
                replyErrorMessage
              );
            } else {
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
                  if (channel.workspace_id) {
                    repliesByWorkspace.set(
                      channel.workspace_id,
                      (repliesByWorkspace.get(channel.workspace_id) || 0) + 1
                    );
                  }
                } else {
                  replyStatus = "error";
                  replyErrorMessage = "YouTube API returned empty comment ID";
                }
              } catch (replyError: unknown) {
                replyStatus = "error";
                replyErrorMessage =
                  replyError instanceof Error ? replyError.message : String(replyError);
                console.warn(
                  `YouTube API comment insert failure on channel ${channel.channel_title}:`,
                  replyErrorMessage
                );

                if (isYoutubeQuotaError(replyError)) {
                  // Log notification about quota exhaustion
                  await supabaseAdmin.from("notifications").insert({
                    user_id: channel.user_id,
                    workspace_id: channel.workspace_id,
                    type: "quota_warning",
                    title: "YouTube API Quota Reached",
                    message:
                      "Daily YouTube API quota limit reached. Automated replies will resume on quota reset.",
                  });
                  break; // Stop further requests for this channel in this run
                }
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

    // usage_metering has had a unique (workspace_id, period_start) constraint
    // since the first migration and never had an insert. Recording it after the
    // run keeps the period row present for billing without putting a write on
    // the per-reply hot path.
    //
    // Counted per workspace (see the declaration near the top of this handler):
    // one cron run sweeps every workspace, so attributing the run total to each
    // of them would inflate every account but the one that posted last.
    await Promise.all(
      Array.from(repliesByWorkspace.entries()).map(([workspaceId, replies]) =>
        recordUsage(workspaceId, { replies, apiCalls: 1 })
      )
    );

    return NextResponse.json({
      success: true,
      confirmedRepliesCount,
      commentsInspectedCount,
      skippedByGuard,
      results: executionResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Auto-reply worker error:", error);
    return NextResponse.json({ error: "Failed to process auto-replies" }, { status: 500 });
  }
}
