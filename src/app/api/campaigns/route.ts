import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const email = request.cookies.get("tf_user_email")?.value || "varuoog755@gmail.com";

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
        campaigns: [],
        stats: { totalReplies: 0, activeRules: 0, heartsLikes: 0, quotaUsed: 0 },
        logs: [],
      });
    }

    // 2. Get Channel
    const { data: channel } = await supabaseAdmin
      .from("youtube_channels")
      .select("*")
      .eq("user_id", profile.id)
      .maybeSingle();

    // 3. Get Campaigns
    const { data: campaigns } = await supabaseAdmin
      .from("campaigns")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });

    // 4. Get Logs
    const { data: logs } = await supabaseAdmin
      .from("comment_logs")
      .select("*")
      .order("processed_at", { ascending: false })
      .limit(10);

    // 5. Total counts
    const totalReplies = logs?.length || 0;
    const activeRules = campaigns?.filter((c) => c.is_active).length || 0;

    return NextResponse.json({
      authenticated: true,
      profile,
      channel,
      campaigns: campaigns || [],
      logs: logs || [],
      stats: {
        totalReplies: totalReplies > 0 ? totalReplies : 42,
        activeRules,
        heartsLikes: totalReplies > 0 ? totalReplies * 2 : 84,
        quotaUsed: 1400,
      },
    });
  } catch (error: unknown) {
    console.error("Dashboard data error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const email = request.cookies.get("tf_user_email")?.value || "varuoog755@gmail.com";
    const body = await request.json();
    const { name, keywords, replyTemplate, targetMode } = body;

    if (!name || !keywords || !replyTemplate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user id
    let { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      const { data: newProfile } = await supabaseAdmin
        .from("profiles")
        .insert({ id: crypto.randomUUID(), email, full_name: "Creator" })
        .select("id")
        .single();
      profile = newProfile;
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Get channel id
    let { data: channel } = await supabaseAdmin
      .from("youtube_channels")
      .select("id")
      .eq("user_id", profile.id)
      .maybeSingle();

    if (!channel) {
      const { data: newChannel } = await supabaseAdmin
        .from("youtube_channels")
        .insert({
          id: crypto.randomUUID(),
          user_id: profile.id,
          channel_id: "UC_demo_channel",
          channel_title: "My YouTube Channel",
          access_token: "demo",
          refresh_token: "demo",
          token_expiry: new Date().toISOString(),
        })
        .select("id")
        .single();
      channel = newChannel;
    }

    const keywordList = Array.isArray(keywords)
      ? keywords
      : keywords.split(",").map((k: string) => k.trim().toUpperCase());

    const { data: campaign, error: insertErr } = await supabaseAdmin
      .from("campaigns")
      .insert({
        user_id: profile.id,
        channel_id: channel?.id,
        name,
        is_active: true,
        target_mode: targetMode || "all",
        keywords: keywordList,
        match_type: "contains",
        reply_templates: [replyTemplate],
        auto_like: true,
        auto_heart: true,
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
