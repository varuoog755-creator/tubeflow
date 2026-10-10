import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin, PLAN_CONFIGS } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email || request.cookies.get("tf_user_email")?.value;

    if (!email || !isAdmin(email)) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    // 1. All Profiles
    const { data: profiles, error: pErr } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, avatar_url, created_at")
      .order("created_at", { ascending: false });

    // 2. All Workspaces
    const { data: workspaces } = await supabaseAdmin
      .from("workspaces")
      .select("id, owner_id, name, plan, plan_status, created_at");

    // 3. All Channels
    const { data: channels } = await supabaseAdmin
      .from("youtube_channels")
      .select("id, user_id, channel_id, channel_title, custom_url, thumbnail_url, subscriber_count, video_count, view_count, is_active, access_token, created_at")
      .order("created_at", { ascending: false });

    // 4. All Processed Comments & Replies
    const { count: totalComments } = await supabaseAdmin
      .from("processed_comments")
      .select("id", { count: "exact", head: true });

    const { count: totalReplies } = await supabaseAdmin
      .from("processed_comments")
      .select("id", { count: "exact", head: true })
      .eq("reply_status", "replied");

    // 5. Tracked Links Metrics
    const { data: links } = await supabaseAdmin
      .from("tracked_links")
      .select("clicks_count, conversions_count, revenue_generated");

    const totalClicks = (links || []).reduce((acc, l) => acc + (l.clicks_count || 0), 0);
    const totalConversions = (links || []).reduce((acc, l) => acc + (l.conversions_count || 0), 0);
    const totalRevenue = (links || []).reduce((acc, l) => acc + parseFloat(l.revenue_generated || "0"), 0);

    // 6. Plan breakdown
    const planCounts = {
      free: 0,
      growth: 0,
      scale: 0,
    };

    const wsMap = new Map();
    (workspaces || []).forEach((w) => {
      wsMap.set(w.owner_id, w);
      const p = (w.plan || "free").toLowerCase();
      if (p in planCounts) {
        planCounts[p as keyof typeof planCounts]++;
      }
    });

    // Channel count per user
    const channelMap = new Map<string, number>();
    (channels || []).forEach((c) => {
      const current = channelMap.get(c.user_id) || 0;
      channelMap.set(c.user_id, current + 1);
    });

    // Enhanced user list for admin management
    const usersList = (profiles || []).map((p) => {
      const ws = wsMap.get(p.id);
      const planId = (ws?.plan || "free").toLowerCase();
      return {
        id: p.id,
        email: p.email,
        fullName: p.full_name || "Creator",
        avatarUrl: p.avatar_url,
        createdAt: p.created_at,
        workspaceId: ws?.id,
        plan: planId,
        planName: PLAN_CONFIGS[planId]?.name || "Starter Free",
        planStatus: ws?.plan_status || "active",
        channelCount: channelMap.get(p.id) || 0,
      };
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: (profiles || []).length,
        totalChannels: (channels || []).length,
        totalComments: totalComments || 0,
        totalReplies: totalReplies || 0,
        totalClicks,
        totalConversions,
        totalRevenue,
        planCounts,
      },
      users: usersList,
      channels: channels || [],
    });
  } catch (error: unknown) {
    console.error("Admin stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
  }
}
