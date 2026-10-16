import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.email || !isAdmin(session.email)) {
      return NextResponse.json({ error: "Access denied. Admin portal only." }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { workspaceId, newPlan } = body;

    if (!workspaceId || !newPlan) {
      return NextResponse.json({ error: "workspaceId and newPlan are required" }, { status: 400 });
    }

    const { data: updated, error } = await supabaseAdmin
      .from("workspaces")
      .update({ plan: newPlan, updated_at: new Date().toISOString() })
      .eq("id", workspaceId)
      .select()
      .single();

    if (error || !updated) {
      return NextResponse.json({ error: error?.message || "Failed to update plan" }, { status: 500 });
    }

    return NextResponse.json({ success: true, workspace: updated });
  } catch (err: unknown) {
    console.error("Admin user plan update error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
