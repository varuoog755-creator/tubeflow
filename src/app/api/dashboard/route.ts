import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email;

    if (!email) {
      return NextResponse.json({
        authenticated: false,
        channel: null,
        channels: [],
        rules: [],
        logs: [],
        stats: {
          connectedChannels: 0,
          commentsMonitored: 0,
          commentsMatched: 0,
          repliesSent: 0,
          failedReplies: 0,
          spamBlocked: 0,
          replySuccessRate: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
        },
      });
    }

    // 1. Get or create Profile
    let { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      const newUserId = session?.userId || crypto.randomUUID();
      const defaultName = session?.fullName || (email.includes("@") ? email.split("@")[0] : "Creator");
      const { data: createdProfile } = await supabaseAdmin
        .from("profiles")
        .upsert({
          id: newUserId,
          email,
          full_name: defaultName,
          updated_at: new Date().toISOString(),
        })
        .select("*")
        .maybeSingle();

      profile = createdProfile || {
        id: newUserId,
        email,
        full_name: defaultName,
      };
    }

    // 2. Get or create Workspace
    let { data: workspace } = await supabaseAdmin
      .from("workspaces")
      .select("*")
      .eq("owner_id", profile.id)
      .maybeSingle();

    if (!workspace) {
      const newWsId = session?.workspaceId || crypto.randomUUID();
      const slug = `${email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const { data: createdWs } = await supabaseAdmin
        .from("workspaces")
        .insert({
          id: newWsId,
          name: `${profile.full_name}'s Workspace`,
          slug,
          owner_id: profile.id,
          plan: "growth",
          plan_status: "active",
        })
        .select("*")
        .maybeSingle();

      workspace = createdWs;
    }

    // 3. Get Channels owned by user
    let { data: channels } = await supabaseAdmin
      .from("youtube_channels")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });

    // Auto-create sample channel for customer demonstration if none exists yet
    if (!channels || channels.length === 0) {
      const isHimalayan = email.includes("himalayanpine");
      const defaultTitle = isHimalayan ? "Himalayan Pine Studio" : `${profile.full_name}'s Channel`;
      const defaultCustomUrl = isHimalayan ? "@himalayanpine" : `@${email.split("@")[0]}`;
      
      const { data: newCh } = await supabaseAdmin
        .from("youtube_channels")
        .insert({
          user_id: profile.id,
          workspace_id: workspace?.id || null,
          channel_id: `UC_${profile.id.substring(0, 12)}`,
          channel_title: defaultTitle,
          custom_url: defaultCustomUrl,
          thumbnail_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=150&auto=format&fit=crop&q=80",
          subscriber_count: isHimalayan ? 24800 : 12400,
          video_count: 52,
          view_count: isHimalayan ? 489200 : 253000,
          access_token: "demo",
          refresh_token: "demo",
          is_active: true,
        })
        .select("*")
        .maybeSingle();

      if (newCh) {
        channels = [newCh];
      }
    }

    const activeChannel = channels?.[0] || null;
    const channelIds = (channels || []).map((c) => c.id);

    // 4. Get Rules (scoped to workspace or user's channels)
    let rules: Record<string, unknown>[] = [];
    if (workspace?.id || channelIds.length > 0) {
      let rulesQuery = supabaseAdmin
        .from("trigger_rules")
        .select("*, youtube_channels(channel_title)")
        .order("created_at", { ascending: false });

      if (workspace?.id && channelIds.length > 0) {
        rulesQuery = rulesQuery.or(`workspace_id.eq.${workspace.id},channel_id.in.(${channelIds.join(",")})`);
      } else if (workspace?.id) {
        rulesQuery = rulesQuery.eq("workspace_id", workspace.id);
      } else {
        rulesQuery = rulesQuery.in("channel_id", channelIds);
      }

      const { data: userRules } = await rulesQuery;
      rules = userRules || [];
    }

    // 5. Get Processed Comments Logs (scoped to user's channels)
    let logs: Record<string, unknown>[] = [];
    let commentsMonitored = 0;
    let commentsMatched = 0;
    let repliesSent = 0;
    let failedReplies = 0;
    let spamBlocked = 0;

    if (channelIds.length > 0) {
      const { data: recentLogs, count } = await supabaseAdmin
        .from("processed_comments")
        .select("*, trigger_rules(name)", { count: "exact" })
        .in("channel_id", channelIds)
        .order("created_at", { ascending: false })
        .limit(20);

      logs = recentLogs || [];
      commentsMonitored = count || logs.length;

      // Calculate totals accurately across user's channels
      const { data: statsLogs } = await supabaseAdmin
        .from("processed_comments")
        .select("reply_status, matched_rule_id, youtube_reply_id")
        .in("channel_id", channelIds);

      if (statsLogs) {
        repliesSent = statsLogs.filter(
          (l) => l.reply_status === "replied" && l.youtube_reply_id !== null
        ).length;
        failedReplies = statsLogs.filter((l) => l.reply_status === "error").length;
        spamBlocked = statsLogs.filter((l) => l.reply_status === "spam").length;
        commentsMatched = statsLogs.filter((l) => l.matched_rule_id !== null).length;
      }
    }

    // 6. Get Tracked Links metrics (scoped to workspace or channels)
    let clicks = 0;
    let conversions = 0;
    let revenue = 0;

    if (workspace?.id || channelIds.length > 0) {
      let linksQuery = supabaseAdmin
        .from("tracked_links")
        .select("clicks_count, conversions_count, revenue_generated");

      if (workspace?.id) {
        linksQuery = linksQuery.eq("workspace_id", workspace.id);
      } else {
        linksQuery = linksQuery.in("channel_id", channelIds);
      }

      const { data: links } = await linksQuery;
      if (links) {
        clicks = links.reduce((acc, l) => acc + (l.clicks_count || 0), 0);
        conversions = links.reduce((acc, l) => acc + (l.conversions_count || 0), 0);
        revenue = links.reduce((acc, l) => acc + parseFloat(l.revenue_generated || "0"), 0);
      }
    }

    const totalAttempts = repliesSent + failedReplies;
    const replySuccessRate =
      totalAttempts > 0 ? Math.round((repliesSent / totalAttempts) * 100) : 100;

    return NextResponse.json({
      authenticated: true,
      profile,
      workspace,
      channel: activeChannel,
      channels: channels || [],
      rules,
      logs,
      stats: {
        connectedChannels: channels?.length || 0,
        commentsMonitored,
        commentsMatched,
        repliesSent,
        failedReplies,
        spamBlocked,
        replySuccessRate,
        clicks,
        conversions,
        revenue,
      },
    });
  } catch (error: unknown) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
