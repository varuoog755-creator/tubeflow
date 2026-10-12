import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { PLAN_CONFIGS } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const email = session.email;

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { data: workspace } = await supabaseAdmin
      .from("workspaces")
      .select("id, name, plan, plan_status, created_at")
      .eq("owner_id", profile.id)
      .maybeSingle();

    const currentPlanId = (workspace?.plan || "free").toLowerCase();
    const currentPlan = PLAN_CONFIGS[currentPlanId] || PLAN_CONFIGS.free;

    // Count user's channels
    const { count: channelCount } = await supabaseAdmin
      .from("youtube_channels")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id);

    // Count user's delivered replies in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const { count: repliesCount } = await supabaseAdmin
      .from("processed_comments")
      .select("id", { count: "exact", head: true })
      .eq("reply_status", "replied")
      .gte("created_at", thirtyDaysAgo);

    return NextResponse.json({
      success: true,
      workspace: {
        id: workspace?.id,
        name: workspace?.name,
        plan: currentPlanId,
        planStatus: workspace?.plan_status || "active",
      },
      currentPlan,
      usage: {
        channelsConnected: channelCount || 0,
        channelsLimit: currentPlan.channelLimit,
        repliesThisMonth: repliesCount || 0,
        repliesLimit: currentPlan.monthlyRepliesLimit,
      },
      plans: PLAN_CONFIGS,
    });
  } catch (error: unknown) {
    console.error("Subscription GET error:", error);
    return NextResponse.json({ error: "Failed to load subscription details" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const email = session.email;

    const body = await request.json();
    const { plan } = body;

    if (!plan || !PLAN_CONFIGS[plan.toLowerCase()]) {
      return NextResponse.json(
        { error: "Invalid plan. Choose 'free', 'growth', or 'scale'." },
        { status: 400 }
      );
    }

    const targetPlanId = plan.toLowerCase();

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Update workspace plan
    const { data: updatedWs, error: wsError } = await supabaseAdmin
      .from("workspaces")
      .update({
        plan: targetPlanId,
        plan_status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("owner_id", profile.id)
      .select()
      .maybeSingle();

    if (wsError) {
      return NextResponse.json({ error: wsError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${PLAN_CONFIGS[targetPlanId].name}!`,
      plan: targetPlanId,
      workspace: updatedWs,
    });
  } catch (error: unknown) {
    console.error("Subscription POST error:", error);
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
