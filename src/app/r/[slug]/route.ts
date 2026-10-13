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
      // Previously a 307 to "/". A short link is pasted into a real YouTube
      // comment, so a deleted or mistyped slug bounced that visitor onto the
      // sales page: the customer read it as the destination failing and the
      // creator got no signal that their link was dead. 404 says what happened.
      return new NextResponse(
        "<!doctype html><meta charset=\"utf-8\"><title>Link not found</title>" +
          "<meta name=\"robots\" content=\"noindex\">" +
          "<body style=\"font:16px system-ui;padding:3rem;max-width:34rem;margin:auto\">" +
          "<h1>Link not found</h1>" +
          "<p>This tracked link is no longer active. If you followed it from a video " +
          "comment, the creator may have changed or removed it.</p></body>",
        { status: 404, headers: { "content-type": "text/html; charset=utf-8" } }
      );
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
