import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email || request.cookies.get("tf_user_email")?.value || "varuoog755@gmail.com";

    // 1. Get Profile
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
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
          replySuccessRate: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
        },
      });
    }

    // 2. Get Channels
    const { data: channels } = await supabaseAdmin
      .from("youtube_channels")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });

    const activeChannel = channels?.[0] || null;

    // 3. Get Rules
    const { data: rules } = await supabaseAdmin
      .from("trigger_rules")
      .select("*")
      .order("created_at", { ascending: false });

    // 4. Get Processed Comments Logs
    const { data: logs } = await supabaseAdmin
      .from("processed_comments")
      .select("*, trigger_rules(name)")
      .order("created_at", { ascending: false })
      .limit(15);

    // 5. Get Tracked Links metrics
    const { data: links } = await supabaseAdmin
      .from("tracked_links")
      .select("clicks_count, conversions_count, revenue_generated");

    // 6. Calculate real aggregated statistics
    const repliesSent = logs?.filter(l => l.reply_status === "replied").length || 0;
    const commentsMonitored = logs?.length || 0;
    const commentsMatched = logs?.filter(l => l.matched_rule_id !== null).length || 0;
    const clicks = links?.reduce((acc, l) => acc + (l.clicks_count || 0), 0) || 0;
    const conversions = links?.reduce((acc, l) => acc + (l.conversions_count || 0), 0) || 0;
    const revenue = links?.reduce((acc, l) => acc + parseFloat(l.revenue_generated || "0"), 0) || 0;

    const replySuccessRate = commentsMatched > 0 ? Math.round((repliesSent / commentsMatched) * 100) : 100;

    return NextResponse.json({
      authenticated: true,
      profile,
      channel: activeChannel,
      channels: channels || [],
      rules: rules || [],
      logs: logs || [],
      stats: {
        connectedChannels: channels?.length || 0,
        commentsMonitored,
        commentsMatched,
        repliesSent,
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
