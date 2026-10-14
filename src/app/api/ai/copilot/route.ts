import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    const email = session?.email;
    if (!email || !session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: "Message prompt is required" }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    // 1. Gather Channel Context
    const { data: channels } = await supabaseAdmin
      .from("youtube_channels")
      .select("channel_title, subscriber_count, video_count, view_count")
      .eq("user_id", profile?.id);

    // 2. Gather Active Rules
    const { data: rules } = await supabaseAdmin
      .from("trigger_rules")
      .select("name, keywords, cta_url, match_type, is_active")
      .eq("workspace_id", session.workspaceId);

    // 3. Gather Conversions and Links
    const { data: links } = await supabaseAdmin
      .from("tracked_links")
      .select("destination_url, clicks_count, conversions_count, revenue_generated")
      .eq("workspace_id", session.workspaceId);

    const channelSummary = channels?.map(c => `${c.channel_title} (${c.subscriber_count} subs, ${c.video_count} videos)`).join(", ") || "No channel connected";
    const activeRulesCount = rules?.filter(r => r.is_active).length || 0;
    const totalClicks = links?.reduce((acc, l) => acc + (l.clicks_count || 0), 0) || 0;
    const totalRevenue = links?.reduce((acc, l) => acc + parseFloat(l.revenue_generated || "0"), 0) || 0;

    // 4. Generate conversion-focused AI Copilot response
    const normalized = message.toLowerCase();
    let advice = "";

    // These are template strings, not model output, so every claim in them is a
    // claim the product makes to the customer. The previous wording told people
    // BigRedHub "delivers within 2 seconds while viewer intent is 100%" - the
    // poll cron runs once a day, so the real worst case is nearly 24 hours.
    if (normalized.includes("best converting") || normalized.includes("trigger")) {
      advice = `Based on your channel data (${channelSummary}), high-intent keywords like "LINK", "BUY", and "PRICE" are the ones worth testing first. Put the tracked link directly in the reply rather than asking people to DM you.`;
    } else if (normalized.includes("cta") || normalized.includes("shorts")) {
      advice = `For YouTube Shorts, put the CTA at the top of the description and pin a comment in the pattern: "Drop LINK below and I will send you the link." Replies go out on the next polling cycle, so set your rule delay to 0 to post as soon as that cycle sees the comment.`;
    } else if (normalized.includes("competitor")) {
      advice = `When analyzing competitor channels, compare video titles against your own rather than copying formats. Post a Short that answers the exact questions appearing in their comments.`;
    } else {
      advice = `Channel Context: ${channelSummary}. You have ${activeRulesCount} active automation rules. Tracked CTA clicks: ${totalClicks}. Total attributed revenue: ₹${totalRevenue}. Recommendation: Add a dedicated rule for discount codes (e.g., 'CODE', 'DISCOUNT') to capture price-sensitive buyers immediately before they leave the video.`;
    }

    return NextResponse.json({
      success: true,
      response: advice,
      context: {
        activeRulesCount,
        totalClicks,
        totalRevenue,
      },
    });
  } catch (error: unknown) {
    console.error("AI Copilot error:", error);
    return NextResponse.json({ error: "AI Assistant failed to generate response" }, { status: 500 });
  }
}
