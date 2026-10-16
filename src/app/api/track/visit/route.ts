import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { path, referrer, screenWidth } = body;

    if (!path) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    // Ignore assets, api calls, and static resources
    if (path.startsWith("/api") || path.startsWith("/_next") || path.includes(".")) {
      return NextResponse.json({ ok: true });
    }

    const userAgent = request.headers.get("user-agent") || "";
    const forwardedFor = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    const ip = forwardedFor.split(",")[0].trim();
    
    // Hash IP for privacy compliance
    const ipHash = createHash("sha256").update(ip + (process.env.SESSION_SECRET || "brh_salt")).digest("hex").slice(0, 16);

    let device = "desktop";
    if (screenWidth && Number(screenWidth) < 768) {
      device = "mobile";
    } else if (screenWidth && Number(screenWidth) < 1024) {
      device = "tablet";
    } else if (/mobile|android|iphone|ipad/i.test(userAgent)) {
      device = "mobile";
    }

    const country = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry") || "IN";

    // Non-blocking insert
    void supabaseAdmin.from("visitor_events").insert({
      path: path.slice(0, 200),
      referrer: (referrer || "").slice(0, 300),
      user_agent: userAgent.slice(0, 300),
      ip_hash: ipHash,
      device,
      country,
      created_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
