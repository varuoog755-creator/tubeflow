import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const { data: link } = await supabaseAdmin
      .from("tracked_links")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (!link) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 1. Record Click Event asynchronously
    const userAgent = request.headers.get("user-agent") || "unknown";
    const referrer = request.headers.get("referer") || "direct";
    const isMobile = /mobile|android|iphone/i.test(userAgent);
    const device = isMobile ? "mobile" : "desktop";

    await supabaseAdmin.from("click_events").insert({
      tracked_link_id: link.id,
      device,
      referrer,
      user_agent: userAgent.slice(0, 200),
    });

    // 2. Increment Link Click Count
    await supabaseAdmin
      .from("tracked_links")
      .update({
        clicks_count: (link.clicks_count || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", link.id);

    // 3. Clean Redirect to destination URL
    return NextResponse.redirect(new URL(link.destination_url));
  } catch (err: unknown) {
    console.error("Tracked link redirect error:", err);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
