import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.email) {
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
    const email = session.email;

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

    // Channels owned by user (or all channels if platform admin)
    const isUserAdmin = isAdmin(email);
    let channelsQuery = supabaseAdmin
      .from("youtube_channels")
      .select("*")
      .order("created_at", { ascending: false });

    if (!isUserAdmin) {
      channelsQuery = channelsQuery.eq("user_id", profile.id);
    }

    const { data: channels } = await channelsQuery;
    const activeChannel = channels?.[0] || null;
    const channelIds = (channels || []).map((c) => c.id);

    // 4. Prepare queries to execute in parallel
    let rulesQuery = supabaseAdmin
      .from("trigger_rules")
      .select("*, youtube_channels(channel_title)")
      .order("created_at", { ascending: false });

    if (!isUserAdmin) {
      if (workspace?.id && channelIds.length > 0) {
        rulesQuery = rulesQuery.or(`workspace_id.eq.${workspace.id},channel_id.in.(${channelIds.join(",")})`);
      } else if (workspace?.id) {
        rulesQuery = rulesQuery.eq("workspace_id", workspace.id);
      } else if (channelIds.length > 0) {
        rulesQuery = rulesQuery.in("channel_id", channelIds);
      }
    }

    let logsQuery = supabaseAdmin
      .from("processed_comments")
      .select("*, trigger_rules(name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .limit(50);

    if (!isUserAdmin && channelIds.length > 0) {
      logsQuery = logsQuery.in("channel_id", channelIds);
    }

    let statsQuery = supabaseAdmin
      .from("processed_comments")
      .select("reply_status, matched_rule_id, youtube_reply_id")
      .limit(1000);

    if (!isUserAdmin) {
      statsQuery = statsQuery.in("channel_id", channelIds);
    }

    let linksQuery = supabaseAdmin
      .from("tracked_links")
      .select("clicks_count, conversions_count, revenue_generated");

    if (workspace?.id) {
      linksQuery = linksQuery.eq("workspace_id", workspace.id);
    } else if (channelIds.length > 0) {
      linksQuery = linksQuery.in("channel_id", channelIds);
    }

    // Execute queries concurrently
    const [rulesRes, logsRes, statsRes, linksRes] = await Promise.all([
      rulesQuery,
      isUserAdmin || channelIds.length > 0 ? logsQuery : Promise.resolve({ data: [], count: 0 }),
      isUserAdmin || channelIds.length > 0 ? statsQuery : Promise.resolve({ data: [] }),
      workspace?.id || channelIds.length > 0 ? linksQuery : Promise.resolve({ data: [] }),
    ]);

    const rules = rulesRes.data || [];
    const logs = logsRes.data || [];
    const commentsMonitored = logsRes.count || logs.length;

    let repliesSent = 0;
    let failedReplies = 0;
    let spamBlocked = 0;
    let commentsMatched = 0;

    const statsLogs = statsRes.data;
    if (statsLogs) {
      repliesSent = statsLogs.filter(
        (l: any) => l.reply_status === "replied" && l.youtube_reply_id !== null
      ).length;
      failedReplies = statsLogs.filter((l: any) => l.reply_status === "error").length;
      spamBlocked = statsLogs.filter((l: any) => l.reply_status === "spam").length;
      commentsMatched = statsLogs.filter((l: any) => l.matched_rule_id !== null).length;
    }

    let clicks = 0;
    let conversions = 0;
    let revenue = 0;

    const links = linksRes.data;
    if (links) {
      clicks = links.reduce((acc: number, l: any) => acc + (l.clicks_count || 0), 0);
      conversions = links.reduce((acc: number, l: any) => acc + (l.conversions_count || 0), 0);
      revenue = links.reduce((acc: number, l: any) => acc + parseFloat(l.revenue_generated || "0"), 0);
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
