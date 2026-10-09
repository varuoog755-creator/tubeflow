import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { getValidYoutubeClient, isYoutubeQuotaError } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email;

    if (!email) {
      return NextResponse.json({ error: "Unauthorized session" }, { status: 401 });
    }

    const body = await request.json();
    const { logId, commentId, channelId, replyText, action } = body;

    if (!logId && !commentId) {
      return NextResponse.json({ error: "Missing logId or commentId" }, { status: 400 });
    }

    // Verify user owns the channel or workspace
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: "User profile not found" }, { status: 403 });
    }

    // Handle "dismiss" action
    if (action === "dismiss") {
      const { data: ownedLog } = await supabaseAdmin
        .from("processed_comments")
        .select("id, channel_id, youtube_channels!inner(user_id)")
        .eq("id", logId)
        .eq("youtube_channels.user_id", profile.id)
        .maybeSingle();
      if (!ownedLog) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
      const { error: updateErr } = await supabaseAdmin
        .from("processed_comments")
        .update({
          reply_status: "skipped",
          processed_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", logId);

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, status: "skipped" });
    }

    // Handle "reply", "approve", or "retry" actions
    if (!replyText || typeof replyText !== "string" || !replyText.trim()) {
      return NextResponse.json({ error: "Reply text cannot be empty" }, { status: 400 });
    }

    // Get channel record
    let targetChannel = null;
    let storedCommentId: string | null = null;
    if (channelId) {
      const { data: chan } = await supabaseAdmin
        .from("youtube_channels")
        .select("*")
        .eq("id", channelId)
        .eq("user_id", profile.id)
        .maybeSingle();
      targetChannel = chan;
    }

    if (!targetChannel) {
      // Fallback: look up channel via the log record
      const { data: logRec } = await supabaseAdmin
        .from("processed_comments")
        .select("channel_id, comment_id")
        .eq("id", logId)
        .maybeSingle();

      if (logRec?.channel_id) {
        storedCommentId = logRec.comment_id;
        const { data: chan } = await supabaseAdmin
          .from("youtube_channels")
          .select("*")
          .eq("id", logRec.channel_id)
          .eq("user_id", profile.id)
          .maybeSingle();
        targetChannel = chan;
      }
    }

    if (logId && !storedCommentId) {
      const { data: ownedLog } = await supabaseAdmin.from("processed_comments").select("comment_id, channel_id").eq("id", logId).maybeSingle();
      if (!ownedLog || !targetChannel || ownedLog.channel_id !== targetChannel.id) return NextResponse.json({ error: "Comment not found for this channel" }, { status: 404 });
      storedCommentId = ownedLog.comment_id;
    }
    const effectiveCommentId = storedCommentId || commentId;
    if (!targetChannel) return NextResponse.json({ error: "Channel not found for this account" }, { status: 404 });
    let youtubeReplyId: string | null = null;
    let replyStatus: "replied" | "error" = "replied";
    let errorMessage: string | null = null;

    if (targetChannel && targetChannel.access_token) {
      try {
        const youtube = await getValidYoutubeClient({
          id: targetChannel.id,
          access_token: targetChannel.access_token,
          refresh_token: targetChannel.refresh_token,
          token_expiry: targetChannel.token_expiry,
        });

        // Insert reply to YouTube comment
        const apiRes = await youtube.comments.insert({
          part: ["snippet"],
          requestBody: {
            snippet: {
              parentId: effectiveCommentId,
              textOriginal: replyText.trim(),
            },
          },
        });

        youtubeReplyId = apiRes.data.id || null;
        if (!youtubeReplyId) {
          replyStatus = "error";
          errorMessage = "YouTube API returned empty comment ID";
        }
      } catch (ytErr: unknown) {
        replyStatus = "error";
        errorMessage = ytErr instanceof Error ? ytErr.message : String(ytErr);

        if (isYoutubeQuotaError(ytErr)) {
          errorMessage = "YouTube API daily quota reached. Retry when quota resets.";
        }
      }
    } else {
      // Channel not connected with active OAuth token
      replyStatus = "error";
      errorMessage = "Connected YouTube channel credentials not found or expired.";
    }

    // Update log in database
    const updatePayload: Record<string, any> = {
      reply_text: replyText.trim(),
      reply_status: replyStatus,
      processed_at: new Date().toISOString(),
      error_message: errorMessage,
    };

    if (youtubeReplyId) {
      updatePayload.youtube_reply_id = youtubeReplyId;
    }

    if (logId) {
      await supabaseAdmin
        .from("processed_comments")
        .update(updatePayload)
        .eq("id", logId)
        .eq("channel_id", targetChannel.id);
    }

    if (replyStatus === "error") {
      return NextResponse.json(
        {
          success: false,
          status: "error",
          errorMessage,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      status: "replied",
      youtubeReplyId,
      replyText: replyText.trim(),
    });
  } catch (error: unknown) {
    console.error("Comment reply API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
