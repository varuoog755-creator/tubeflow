import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.email || !isAdmin(session.email)) {
      return NextResponse.json({ error: "Access denied. Admin portal only." }, { status: 403 });
    }

    // 1. Fetch all profiles & workspaces
    const { data: profiles, error: profErr } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, avatar_url, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (profErr) {
      console.error("Admin overview profiles error:", profErr);
    }

    const { data: workspaces } = await supabaseAdmin
      .from("workspaces")
      .select("id, name, slug, owner_id, plan, plan_status, byok_enabled, byok_client_id, created_at");

    const { data: channels } = await supabaseAdmin
      .from("youtube_channels")
      .select("id, user_id, channel_id, channel_title, custom_url, subscriber_count, video_count, is_active, created_at");

    const { data: rules } = await supabaseAdmin
      .from("trigger_rules")
      .select("id, workspace_id, name, is_active, max_replies_per_day");

    // 2. Fetch replies delivered count & comments count
    const { count: totalRepliesCount } = await supabaseAdmin
      .from("processed_comments")
      .select("*", { count: "exact", head: true })
      .eq("reply_status", "replied");

    const { count: totalCommentsCount } = await supabaseAdmin
      .from("processed_comments")
      .select("*", { count: "exact", head: true });

    // 3. Fetch visitor analytics
    const todayStart = new Date();
    todayStart.setUTCHours(0, 0, 0, 0);

    const { data: recentVisitors } = await supabaseAdmin
      .from("visitor_events")
      .select("id, path, referrer, device, ip_hash, country, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);

    const { count: totalPageViews } = await supabaseAdmin
      .from("visitor_events")
      .select("*", { count: "exact", head: true });

    const visitorsList = recentVisitors || [];
    const todayVisitors = visitorsList.filter((v) => new Date(v.created_at) >= todayStart);

    // Compute unique visitors
    const uniqueIpsAllTime = new Set(visitorsList.map((v) => v.ip_hash)).size;
    const uniqueIpsToday = new Set(todayVisitors.map((v) => v.ip_hash)).size;

    // Device breakdown
    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    visitorsList.forEach((v) => {
      const d = (v.device || "desktop").toLowerCase() as keyof typeof devices;
      if (devices[d] !== undefined) devices[d]++;
      else devices.desktop++;
    });

    // Top pages
    const pageCounts: Record<string, number> = {};
    visitorsList.forEach((v) => {
      const p = v.path || "/";
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, views]) => ({ path, views }));

    // Top referrers
    const refCounts: Record<string, number> = {};
    visitorsList.forEach((v) => {
      let r = v.referrer?.trim() || "Direct / None";
      try {
        if (r.startsWith("http")) {
          const u = new URL(r);
          r = u.hostname;
        }
      } catch {
        // use as is
      }
      refCounts[r] = (refCounts[r] || 0) + 1;
    });
    const topReferrers = Object.entries(refCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([source, count]) => ({ source, count }));

    // 4. Fetch Support Tickets
    const { data: allTickets } = await supabaseAdmin
      .from("support_tickets")
      .select("*")
      .order("created_at", { ascending: false });

    const ticketsList = allTickets || [];
    const openTicketsCount = ticketsList.filter((t) => t.status === "open").length;
    const inProgressTicketsCount = ticketsList.filter((t) => t.status === "in_progress").length;
    const resolvedTicketsCount = ticketsList.filter((t) => t.status === "resolved" || t.status === "closed").length;

    // Combine user profiles with workspace & channel info for advanced user table
    const workspaceMap = new Map((workspaces || []).map((w) => [w.owner_id, w]));
    const channelMap = new Map((channels || []).map((c) => [c.user_id, c]));

    const usersData = (profiles || []).map((p) => {
      const ws = workspaceMap.get(p.id);
      const ch = channelMap.get(p.id);
      const userRules = (rules || []).filter((r) => r.workspace_id === ws?.id);

      return {
        id: p.id,
        email: p.email,
        fullName: p.full_name || p.email.split("@")[0],
        avatarUrl: p.avatar_url,
        workspaceId: ws?.id,
        workspaceName: ws?.name || "Workspace",
        plan: ws?.plan || "free",
        planStatus: ws?.plan_status || "active",
        byokEnabled: Boolean(ws?.byok_enabled),
        byokClientId: ws?.byok_client_id || null,
        channelConnected: Boolean(ch),
        channelTitle: ch?.channel_title || null,
        channelCustomUrl: ch?.custom_url || null,
        subscribers: ch?.subscriber_count || 0,
        rulesCount: userRules.length,
        createdAt: p.created_at,
        updatedAt: p.updated_at,
      };
    });

    return NextResponse.json({
      success: true,
      metrics: {
        totalUsers: profiles?.length || 0,
        totalWorkspaces: workspaces?.length || 0,
        totalChannels: channels?.length || 0,
        totalRules: rules?.length || 0,
        totalRepliesDelivered: totalRepliesCount || 0,
        totalCommentsMonitored: totalCommentsCount || 0,
        pageViewsToday: todayVisitors.length,
        pageViewsTotal: totalPageViews || visitorsList.length,
        uniqueVisitorsToday: uniqueIpsToday,
        uniqueVisitorsTotal: uniqueIpsAllTime,
        openTickets: openTicketsCount,
        inProgressTickets: inProgressTicketsCount,
        resolvedTickets: resolvedTicketsCount,
        totalTickets: ticketsList.length,
      },
      analytics: {
        topPages,
        topReferrers,
        deviceBreakdown: devices,
        recentVisitors: visitorsList.slice(0, 30),
      },
      users: usersData,
      tickets: ticketsList,
    });
  } catch (err: unknown) {
    console.error("Admin overview error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
