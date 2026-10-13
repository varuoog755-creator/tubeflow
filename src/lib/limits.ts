import { supabaseAdmin } from "@/lib/supabase";
import { type PlanConfig } from "@/lib/admin";
import {
  planFor,
  monthWindowStart,
  monthWindowEnd,
  monthlyAllowance,
  channelAllowance,
  decideRuleGuard,
  type Allowance,
  type RuleGuardVerdict,
} from "@/lib/plan-limits";

export { planFor, monthWindowStart, monthWindowEnd, decideRuleGuard };
export type { Allowance, PlanConfig, RuleGuardVerdict };

/**
 * The database side of plan enforcement.
 *
 * `PLAN_CONFIGS` advertised channel and reply limits from the day it was
 * written. Nothing read `channelLimit` or `monthlyRepliesLimit` except
 * `/api/subscription`, which put them in a response so the dashboard could
 * print them. A free account could connect unlimited channels and post
 * unlimited replies, and any of them could self-serve an upgrade by POSTing to
 * that same endpoint.
 *
 * This module counts; `plan-limits.ts` decides. The split exists so the rules
 * that gate a customer's replies can be unit tested without a database.
 *
 * No caching: these run inside a cron and an OAuth callback, not a hot path,
 * and a stale answer here means either a customer hits a wall they paid to
 * remove, or a free account gets paid capacity.
 */

export async function getWorkspacePlan(workspaceId: string): Promise<PlanConfig> {
  const { data } = await supabaseAdmin
    .from("workspaces")
    .select("plan")
    .eq("id", workspaceId)
    .maybeSingle();
  return planFor(data?.plan);
}

export async function countConnectedChannels(workspaceId: string): Promise<number> {
  const { count } = await supabaseAdmin
    .from("youtube_channels")
    .select("id", { count: "exact", head: true })
    .eq("workspace_id", workspaceId);
  return count || 0;
}

export async function getReplyAllowance(workspaceId: string): Promise<Allowance & { plan: PlanConfig }> {
  const plan = await getWorkspacePlan(workspaceId);
  const since = monthWindowStart().toISOString();

  // processed_comments is keyed by channel, not workspace, so the workspace's
  // channel ids have to be resolved first.
  const { data: channels } = await supabaseAdmin
    .from("youtube_channels")
    .select("id")
    .eq("workspace_id", workspaceId);

  const channelIds = (channels || []).map((c) => c.id as string);

  // Count what actually went out, not what was attempted. A failed insert never
  // reached YouTube, so charging a customer for it would be wrong.
  const { count } = channelIds.length
    ? await supabaseAdmin
        .from("processed_comments")
        .select("id", { count: "exact", head: true })
        .in("channel_id", channelIds)
        .eq("reply_status", "replied")
        .gte("processed_at", since)
    : { count: 0 };

  return { plan, ...monthlyAllowance(count || 0, plan.monthlyRepliesLimit) };
}

export interface RuleGuard extends RuleGuardVerdict {
  /** Replies already sent for this rule today, for an explanation in the UI. */
  usedToday: number;
}

export async function checkRuleGuard(
  channelId: string,
  rule: { id: string; max_replies_per_day?: number | null; cooldown_minutes?: number | null }
): Promise<RuleGuard> {
  const dayStart = new Date();
  dayStart.setUTCHours(0, 0, 0, 0);
  const since = dayStart.toISOString();

  const { data: sentToday } = await supabaseAdmin
    .from("processed_comments")
    .select("processed_at")
    .eq("channel_id", channelId)
    .eq("matched_rule_id", rule.id)
    .eq("reply_status", "replied")
    .gte("processed_at", since);

  const rows = sentToday || [];
  const usedToday = rows.length;

  const lastProcessed = rows
    .map((r) => new Date(r.processed_at as string).getTime())
    .filter((t) => Number.isFinite(t))
    .sort((a, b) => b - a)[0];

  const minutesSinceLastReply =
    lastProcessed === undefined ? null : (Date.now() - lastProcessed) / 60000;

  return decideRuleGuard({
    usedToday,
    maxRepliesPerDay: rule.max_replies_per_day,
    cooldownMinutes: rule.cooldown_minutes,
    minutesSinceLastReply,
  });
}

/**
 * Write the period's usage row.
 *
 * `usage_metering` has existed in the schema since the beginning with a unique
 * constraint on (workspace_id, period_start) and has never had an insert. The
 * counter that gates replies reads `processed_comments`, so this row is the
 * billing record rather than the enforcement source.
 */
export async function recordUsage(
  workspaceId: string,
  usage: { replies: number; clicks?: number; apiCalls?: number }
): Promise<void> {
  const start = monthWindowStart();
  const end = monthWindowEnd();

  const { error } = await supabaseAdmin.from("usage_metering").upsert(
    {
      workspace_id: workspaceId,
      period_start: start.toISOString().slice(0, 10),
      period_end: end.toISOString().slice(0, 10),
      replies_used: usage.replies,
      ai_intent_credits_used: 0,
      tracked_clicks: usage.clicks ?? 0,
      api_calls: usage.apiCalls ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "workspace_id,period_start" }
  );

  if (error) {
    // Usage recording must never take the product down; the gate that stops
    // replies reads processed_comments, not this table.
    console.warn("usage_metering write failed:", error.message);
  }
}

/**
 * Whether another channel may be attached to this workspace.
 *
 * `alreadyConnected` matters: re-running the Google callback for a channel the
 * workspace already has is a token refresh, not a new connection.
 */
export async function canConnectChannel(
  workspaceId: string,
  alreadyConnected: boolean
): Promise<{ allowed: boolean; plan: PlanConfig; connected: number; limit: number }> {
  const plan = await getWorkspacePlan(workspaceId);
  if (alreadyConnected) {
    return { allowed: true, plan, connected: 0, limit: plan.channelLimit };
  }
  const connected = await countConnectedChannels(workspaceId);
  const verdict = channelAllowance(connected, plan.channelLimit, alreadyConnected);
  return { allowed: verdict.allowed, plan, connected: verdict.connected, limit: verdict.limit };
}

export async function queueNotice(
  userId: string,
  workspaceId: string,
  message: string
): Promise<void> {
  const { error } = await supabaseAdmin.from("notifications").insert({
    user_id: userId,
    workspace_id: workspaceId,
    type: "system",
    title: "Channel not connected",
    message,
    is_read: false,
    link: "/dashboard",
  });
  if (error) console.warn("notification insert failed:", error.message);
}