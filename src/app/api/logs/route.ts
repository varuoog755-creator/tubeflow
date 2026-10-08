import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.email || request.cookies.get("tf_user_email")?.value || "varuoog755@gmail.com";
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const status = searchParams.get("status");
    const query = searchParams.get("query");

    const offset = (page - 1) * limit;

    let dbQuery = supabaseAdmin
      .from("processed_comments")
      .select("*, trigger_rules(name)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "ALL") {
      dbQuery = dbQuery.eq("reply_status", status.toLowerCase());
    }

    if (query) {
      dbQuery = dbQuery.or(`comment_text.ilike.%${query}%,author_name.ilike.%${query}%`);
    }

    const { data: logs, count, error } = await dbQuery;

    if (error) {
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
