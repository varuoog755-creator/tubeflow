import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { isAdmin, PLAN_CONFIGS } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.email || !isAdmin(session.email)) {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, plan, planStatus } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (plan) {
      const cleanPlan = plan.toLowerCase();
      if (!PLAN_CONFIGS[cleanPlan]) {
        return NextResponse.json({ error: "Invalid plan option" }, { status: 400 });
      }
      updates.plan = cleanPlan;
    }

    if (planStatus) {
      updates.plan_status = planStatus;
    }

    const { data: updatedWs, error: updateErr } = await supabaseAdmin
      .from("workspaces")
      .update(updates)
      .eq("owner_id", userId)
      .select()
      .maybeSingle();

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "User plan updated successfully by Admin",
      workspace: updatedWs,
    });
  } catch (error: unknown) {
    console.error("Admin user update error:", error);
    return NextResponse.json({ error: "Failed to update user workspace" }, { status: 500 });
  }
}
