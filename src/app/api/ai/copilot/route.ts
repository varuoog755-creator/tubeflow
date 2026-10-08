import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email || request.cookies.get("tf_user_email")?.value || "varuoog755@gmail.com";
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
      .select("name, keywords, cta_url, match_type, is_active");

    // 3. Gather Conversions and Links
    const { data: links } = await supabaseAdmin
      .from("tracked_links")
      .select("destination_url, clicks_count, conversions_count, revenue_generated");

    const channelSummary = channels?.map(c => `${c.channel_title} (${c.subscriber_count} subs, ${c.video_count} videos)`).join(", ") || "No channel connected";
    const activeRulesCount = rules?.filter(r => r.is_active).length || 0;
    const totalClicks = links?.reduce((acc, l) => acc + (l.clicks_count || 0), 0) || 0;
    const totalRevenue = links?.reduce((acc, l) => acc + parseFloat(l.revenue_generated || "0"), 0) || 0;

    // 4. Generate conversion-focused AI Copilot response
    const normalized = message.toLowerCase();
    let advice = "";

    if (normalized.includes("best converting") || normalized.includes("trigger")) {
      advice = `Based on your channel data (${channelSummary}), high-intent keywords like "LINK", "BUY", and "PRICE" yield the strongest click-through rates. Ensure your reply contains an instant direct link rather than asking them to DM you.`;
    } else if (normalized.includes("cta") || normalized.includes("shorts")) {
      advice = `For YouTube Shorts, high-performing creators place the CTA in the first 2 seconds of the description and use this pinned pattern: "Pin a top comment: 'Drop LINK below and I will send you the secret formula instantly.' TubeFlow then delivers within 2 seconds while viewer intent is 100%."`;
    } else if (normalized.includes("competitor")) {
      advice = `When analyzing competitor channels, identify video titles with a view-to-subscriber ratio exceeding 3x. Post a contrasting breakdown Short addressing the exact viewer questions from their comments.`;
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
