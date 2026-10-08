import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email || request.cookies.get("tf_user_email")?.value || "varuoog755@gmail.com";

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ rules: [] });
    }

    const { data: rules } = await supabaseAdmin
      .from("trigger_rules")
      .select("*")
      .order("created_at", { ascending: false });

    return NextResponse.json({ rules: rules || [] });
  } catch (error: unknown) {
    console.error("Fetch rules error:", error);
    return NextResponse.json({ error: "Failed to fetch rules" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email || request.cookies.get("tf_user_email")?.value || "varuoog755@gmail.com";
    const body = await request.json();
    const {
      name,
      keywords,
      negativeKeywords,
      matchType,
      targetMode,
      replyTemplates,
      ctaUrl,
      intentCategory,
      delaySeconds,
    } = body;

    if (!name || !keywords || !replyTemplates || replyTemplates.length === 0) {
      return NextResponse.json({ error: "Missing required rule parameters" }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    const { data: channel } = await supabaseAdmin
      .from("youtube_channels")
      .select("id, workspace_id")
      .eq("user_id", profile?.id)
      .maybeSingle();

    const keywordList = Array.isArray(keywords)
      ? keywords
      : keywords.split(",").map((k: string) => k.trim().toUpperCase());

    const negativeList = Array.isArray(negativeKeywords)
      ? negativeKeywords
      : (negativeKeywords || "").split(",").map((k: string) => k.trim().toUpperCase()).filter(Boolean);

    const { data: newRule, error: insertErr } = await supabaseAdmin
      .from("trigger_rules")
      .insert({
        workspace_id: channel?.workspace_id,
        channel_id: channel?.id,
        name,
        keywords: keywordList,
        negative_keywords: negativeList,
        match_type: matchType || "contains",
        target_mode: targetMode || "all",
        reply_templates: Array.isArray(replyTemplates) ? replyTemplates : [replyTemplates],
        cta_url: ctaUrl || null,
        intent_category: intentCategory || "ALL",
        delay_seconds: parseInt(delaySeconds || "0", 10),
        is_active: true,
      })
      .select("*")
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, rule: newRule });
  } catch (error: unknown) {
    console.error("Create rule error:", error);
    return NextResponse.json({ error: "Failed to create trigger rule" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, is_active } = body;

    const { data: updated, error } = await supabaseAdmin
      .from("trigger_rules")
      .update({ is_active, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, rule: updated });
  } catch (error: unknown) {
    console.error("Update rule error:", error);
    return NextResponse.json({ error: "Failed to update rule" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Rule ID required" }, { status: 400 });
    }

    await supabaseAdmin.from("trigger_rules").delete().eq("id", id);
    return NextResponse.json({ success: true, message: "Rule deleted" });
  } catch (error: unknown) {
    console.error("Delete rule error:", error);
    return NextResponse.json({ error: "Failed to delete rule" }, { status: 500 });
  }
}
