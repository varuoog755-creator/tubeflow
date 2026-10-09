import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email || request.cookies.get("tf_user_email")?.value;
    if (!email) {
      return NextResponse.json({ logs: [], pagination: { page: 1, limit: 25, total: 0, totalPages: 0 } }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ logs: [], pagination: { page: 1, limit: 25, total: 0, totalPages: 0 } });
    }

    // Get all channels owned by the user
    const { data: userChannels } = await supabaseAdmin
      .from("youtube_channels")
      .select("id")
      .eq("user_id", profile.id);

    const channelIds = (userChannels || []).map((c) => c.id);

    if (channelIds.length === 0) {
      return NextResponse.json({
        logs: [],
        pagination: { page: 1, limit: 25, total: 0, totalPages: 0 },
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "25", 10), 100);
    const status = searchParams.get("status");
    const query = searchParams.get("query");
    const channelId = searchParams.get("channelId");
    const ruleId = searchParams.get("ruleId");

    const offset = (page - 1) * limit;

    let dbQuery = supabaseAdmin
      .from("processed_comments")
      .select("*, trigger_rules(name), youtube_channels(channel_title)", { count: "exact" })
      .in("channel_id", channelId ? [channelId] : channelIds)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "ALL") {
      dbQuery = dbQuery.eq("reply_status", status.toLowerCase());
    }

    if (ruleId) {
      dbQuery = dbQuery.eq("matched_rule_id", ruleId);
    }

    if (query) {
      dbQuery = dbQuery.or(`comment_text.ilike.%${query}%,author_name.ilike.%${query}%`);
    }

    const { data: logs, count, error } = await dbQuery;

    if (error) {
      console.error("Fetch reply logs database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      logs: logs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Fetch reply logs error:", error);
    return NextResponse.json({ error: "Failed to fetch reply logs" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email || request.cookies.get("tf_user_email")?.value;
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { logIds, status } = body;

    if (!Array.isArray(logIds) || logIds.length === 0 || !status) {
      return NextResponse.json({ error: "Invalid logIds or status" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("processed_comments")
      .update({
        reply_status: status,
        processed_at: new Date().toISOString(),
      })
      .in("id", logIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updatedCount: logIds.length });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Failed to update logs" }, { status: 500 });
  }
}
