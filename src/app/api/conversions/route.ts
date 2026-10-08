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
      return NextResponse.json({ links: [], totals: { clicks: 0, leads: 0, conversions: 0, revenue: 0 } });
    }

    const { data: links } = await supabaseAdmin
      .from("tracked_links")
      .select("*")
      .order("created_at", { ascending: false });

    const totals = (links || []).reduce(
      (acc, l) => ({
        clicks: acc.clicks + (l.clicks_count || 0),
        leads: acc.leads + (l.leads_count || 0),
        conversions: acc.conversions + (l.conversions_count || 0),
        revenue: acc.revenue + parseFloat(l.revenue_generated || "0"),
      }),
      { clicks: 0, leads: 0, conversions: 0, revenue: 0 }
    );

    return NextResponse.json({ links: links || [], totals });
  } catch (error: unknown) {
    console.error("Fetch conversions error:", error);
    return NextResponse.json({ error: "Failed to fetch conversion metrics" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email || request.cookies.get("tf_user_email")?.value || "varuoog755@gmail.com";
    const body = await request.json();
    const { destinationUrl, campaignName } = body;

    if (!destinationUrl) {
      return NextResponse.json({ error: "Destination URL is required" }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    const { data: workspace } = await supabaseAdmin
      .from("workspaces")
      .select("id")
      .eq("owner_id", profile?.id)
      .maybeSingle();

    const slug = `tf-${Math.random().toString(36).substring(2, 8)}`;

    const { data: newLink, error: insertErr } = await supabaseAdmin
      .from("tracked_links")
      .insert({
        workspace_id: workspace?.id,
        slug,
        destination_url: destinationUrl,
        campaign_name: campaignName || "YouTube Shorts Campaign",
        clicks_count: 0,
        leads_count: 0,
        conversions_count: 0,
        revenue_generated: 0.0,
      })
      .select("*")
      .single();

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, link: newLink });
  } catch (error: unknown) {
    console.error("Create tracked link error:", error);
    return NextResponse.json({ error: "Failed to create tracked link" }, { status: 500 });
  }
}
