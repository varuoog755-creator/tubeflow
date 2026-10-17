import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { byokAllowed, planFor } from "@/lib/plan-limits";
import { isTestAccount } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("email", session.email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { data: workspace } = await supabaseAdmin
      .from("workspaces")
      .select("id, plan, byok_enabled, byok_client_id, byok_client_secret")
      .eq("owner_id", profile.id)
      .maybeSingle();

    const planId = String(workspace?.plan || "free").toLowerCase();
    const testAccount = isTestAccount(profile.email);

    return NextResponse.json({
      success: true,
      byok_enabled: Boolean(workspace?.byok_enabled),
      byok_client_id: workspace?.byok_client_id || "",
      has_client_secret: Boolean(workspace?.byok_client_secret),
      byok_allowed: byokAllowed(planId, testAccount),
      plan_name: testAccount ? "Test account" : planFor(planId).name,
    });
  } catch (error: unknown) {
    console.error("BYOK GET error:", error);
    return NextResponse.json({ error: "Failed to load BYOK configuration" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("email", session.email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const { byok_enabled, byok_client_id, byok_client_secret } = body;

    // Product model, enforced here and not only in the dashboard: the free
    // trial runs on BigRedHub's shared Google quota; a workspace's own client
    // id/secret is a paid-plan capability. Without this check a free
    // workspace could switch itself onto personal credentials with a POST.
    if (Boolean(byok_enabled)) {
      const { data: planRow } = await supabaseAdmin
        .from("workspaces")
        .select("plan")
        .eq("owner_id", profile.id)
        .maybeSingle();

      if (!byokAllowed(planRow?.plan, isTestAccount(profile.email))) {
        return NextResponse.json(
          {
            error:
              "Your own Google Cloud credentials unlock on paid plans. The free trial runs on BigRedHub's shared quota - no setup needed. Upgrade to use your own client ID & key.",
          },
          { status: 403 }
        );
      }
    }

    const updatePayload: Record<string, unknown> = {
      byok_enabled: Boolean(byok_enabled),
      updated_at: new Date().toISOString(),
    };

    if (typeof byok_client_id === "string") {
      updatePayload.byok_client_id = byok_client_id.trim();
    }

    if (typeof byok_client_secret === "string" && byok_client_secret.trim().length > 0) {
      updatePayload.byok_client_secret = byok_client_secret.trim();
    }

    const { data: updatedWorkspace, error: updateError } = await supabaseAdmin
      .from("workspaces")
      .update(updatePayload)
      .eq("owner_id", profile.id)
      .select("id, plan, byok_enabled, byok_client_id, byok_client_secret")
      .maybeSingle();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "BYOK credentials saved successfully",
      byok_enabled: Boolean(updatedWorkspace?.byok_enabled),
      byok_client_id: updatedWorkspace?.byok_client_id || "",
      has_client_secret: Boolean(updatedWorkspace?.byok_client_secret),
    });
  } catch (error: unknown) {
    console.error("BYOK POST error:", error);
    return NextResponse.json({ error: "Failed to update BYOK configuration" }, { status: 500 });
  }
}
