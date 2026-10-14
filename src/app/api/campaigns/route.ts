import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { publicChannel } from "@/lib/safe-channel";
import { validateReplyTemplate } from "@/lib/reply-engine";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email;
    if (!email || !session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Get Profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, avatar_url")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({
        authenticated: false,
        channel: null,
        campaigns: [],
        stats: { totalReplies: 0, activeRules: 0, heartsLikes: 0, quotaUsed: 0 },
        logs: [],
      });
    }

    // 2. Get Channel
    // `select("*")` plus a bare `channel` in the response published this
    // workspace's YouTube access_token and refresh_token to the client. The
    // refresh token never expires on its own, so whoever read it could act as
    // the creator on YouTube indefinitely. Stripped via the shared helper.
    const { data: channel } = await supabaseAdmin
      .from("youtube_channels")
      .select("*")
      .eq("user_id", profile.id)
      .maybeSingle();

    // 3. Get Campaigns
    //
    // Reads `trigger_rules`, not the legacy `campaigns` table. The endpoint was
    // still writing to and reading from `campaigns` while the entire product -
    // dashboard, poll worker, rule editor - ran on `trigger_rules`. Nothing
    // ever displayed or executed a campaign created here, so POST returned
    // `{"success": true}` for a row that could never fire a reply. Returning
    // the same list the engine actually reads makes the endpoint honest.
    //
    // Scoped by channel_id, which is how a rule is actually attached.
    // `trigger_rules` has no user_id column; scoping by it silently returned an
    // empty list for a workspace that demonstrably had rules.
    const { data: ownedChannels } = await supabaseAdmin
      .from("youtube_channels")
      .select("id")
      .eq("user_id", profile.id);

    const ownedChannelIds = (ownedChannels || []).map((c) => c.id as string);

    const { data: campaigns } = ownedChannelIds.length
      ? await supabaseAdmin
          .from("trigger_rules")
          .select("*")
          .in("channel_id", ownedChannelIds)
          .order("created_at", { ascending: false })
      : { data: [] };

    // 4. Get Logs
    const { data: logs } = await supabaseAdmin
      .from("comment_logs")
      .select("*")
      .eq("channel_id", channel?.id || "00000000-0000-0000-0000-000000000000")
      .order("processed_at", { ascending: false })
      .limit(10);

    // 5. Total counts
    const totalReplies = logs?.length || 0;
    const activeRules = campaigns?.filter((c) => c.is_active).length || 0;

    return NextResponse.json({
      authenticated: true,
      profile,
      channel: publicChannel(channel || {}),
      campaigns: campaigns || [],
      logs: logs || [],
      stats: {
        totalReplies,
        activeRules,
        heartsLikes: totalReplies,
        quotaUsed: totalReplies * 50,
      },
    });
  } catch (error: unknown) {
    console.error("Dashboard data error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email;
    if (!email || !session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, keywords, replyTemplate, targetMode } = body;
    if (!name || !keywords || !replyTemplate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", session.userId)
      .eq("email", email)
      .maybeSingle();
    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 403 });

    const { data: channel } = await supabaseAdmin
      .from("youtube_channels")
      .select("id")
      .eq("user_id", profile.id)
      .eq("is_active", true)
      .maybeSingle();
    if (!channel) {
      return NextResponse.json({ error: "Connect a YouTube channel before creating a campaign" }, { status: 409 });
    }

    const keywordList = Array.isArray(keywords)
      ? keywords
      : keywords.split(",").map((k: string) => k.trim().toUpperCase());

    // Validated with the same validator the rule editor uses, so a template
    // that would publish literal "{cta_url}" into a public comment is rejected
    // at creation rather than at reply time.
    const templateCheck = validateReplyTemplate(replyTemplate);
    if (!templateCheck.valid) {
      return NextResponse.json({ error: templateCheck.error }, { status: 400 });
    }

    const { data: workspace } = await supabaseAdmin
      .from("workspaces")
      .select("id")
      .eq("owner_id", profile.id)
      .maybeSingle();

    // Written to `trigger_rules` - the table the poll worker, the dashboard and
    // the rule editor all read. This used to insert into the legacy `campaigns`
    // table, which nothing has ever executed, so the endpoint answered
    // `{"success": true}` for a campaign that could never reply to anything.
    //
    // No `user_id`: that column does not exist on `trigger_rules`. A rule is
    // attached by workspace_id + channel_id, matching the rule editor's insert.
    const { data: campaign, error: insertErr } = await supabaseAdmin
      .from("trigger_rules")
      .insert({
        workspace_id: workspace?.id || null,
        channel_id: channel.id,
        name,
        is_active: true,
        target_mode: targetMode || "all",
        keywords: keywordList,
        negative_keywords: [],
        match_type: "contains",
        keyword_match_operator: "ANY",
        reply_templates: [replyTemplate],
        cta_url: typeof body.ctaUrl === "string" && body.ctaUrl.trim() ? body.ctaUrl.trim() : null,
        intent_category: "ALL",
        delay_seconds: 0,
      })
      .select("*")
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, campaign });
  } catch (err: unknown) {
    console.error("Create campaign error:", err);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}
