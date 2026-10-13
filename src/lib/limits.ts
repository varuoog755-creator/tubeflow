import { supabaseAdmin } from "@/lib/supabase";
import { PLAN_CONFIGS, type PlanConfig } from "@/lib/admin";

/**
 * Per-rule guards a creator sets for themselves.
 *
 * `max_replies_per_day` and `cooldown_minutes` live on trigger_rules and are
 * editable from the dashboard rule editor, but nothing in the reply path ever
 * read them. A creator who set "10 replies a day, 60 minute cooldown" to keep
 * their channel out of spam trouble got neither, and these are the controls that
 * exist specifically to protect the account. They are checked here rather than
 * trusted.
 */
export interface RuleGuard {
  allowed: boolean;
  reason?: "daily_cap" | "cooldown";
  /** Replies already sent for this rule today, for an explanation in the UI. */
  usedToday: number;
  dailyCap: number;
  /** Minutes still to wait, when reason is "cooldown". */
  cooldownRemainingMinutes: number;
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

  // 0 or null means "no cap chosen", which is how the column defaults.
  const dailyCap =
    typeof rule.max_replies_per_day === "number" && rule.max_replies_per_day > 0
      ? rule.max_replies_per_day
      : 0;

  if (dailyCap > 0 && usedToday >= dailyCap) {
    return { allowed: false, reason: "daily_cap", usedToday, dailyCap, cooldownRemainingMinutes: 0 };
  }

  const cooldownMinutes =
    typeof rule.cooldown_minutes === "number" && rule.cooldown_minutes > 0
      ? rule.cooldown_minutes
      : 0;

  if (cooldownMinutes > 0 && rows.length > 0) {
    const lastProcessed = rows
      .map((r) => new Date(r.processed_at as string).getTime())
      .filter((t) => Number.isFinite(t))
      .sort((a, b) => b - a)[0];

    if (lastProcessed !== undefined) {
      const elapsedMinutes = (Date.now() - lastProcessed) / 60000;
      if (elapsedMinutes < cooldownMinutes) {
        return {
          allowed: false,
          reason: "cooldown",
          usedToday,
          dailyCap,
          cooldownRemainingMinutes: Math.ceil(cooldownMinutes - elapsedMinutes),
        };
      }
    }
  }

  return { allowed: true, usedToday, dailyCap, cooldownRemainingMinutes: 0 };
}

/**
 * Plan allowances, and the counters that decide whether an action is allowed.
 *
 * `PLAN_CONFIGS` advertised channel and reply limits from the day it was written.
 * Nothing read `channelLimit` or `monthlyRepliesLimit` except `/api/subscription`,
 * which put them in a response so the dashboard could print them. A free account
 * could connect unlimited channels and post unlimited replies, and any of them
 * could self-serve an upgrade by POSTing to that same endpoint.
 *
 * This module is the missing read side. It is deliberately small and does no
 * caching: these counters run inside a cron and an OAuth callback, not a hot
 * path, and a stale answer here means either a customer hits a wall they paid to
 * remove, or a free account gets paid capacity.
 */

export const FREE_PLAN_FALLBACK: PlanConfig = PLAN_CONFIGS.free;

export function planFor(planId?: string | null): PlanConfig {
  if (!planId) return FREE_PLAN_FALLBACK;
  return PLAN_CONFIGS[planId.toLowerCase()] || FREE_PLAN_FALLBACK;
}

/** Start of the current calendar month, used as the reply allowance window. */
export function currentMonthStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
}

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

export interface ReplyAllowance {
  plan: PlanConfig;
  used: number;
  limit: number;
  remaining: number;
  exhausted: boolean;
}

export async function getReplyAllowance(workspaceId: string): Promise<ReplyAllowance> {
  const plan = await getWorkspacePlan(workspaceId);
  const since = currentMonthStart().toISOString();

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

  const used = count || 0;
  const remaining = Math.max(0, plan.monthlyRepliesLimit - used);
  return { plan, used, limit: plan.monthlyRepliesLimit, remaining, exhausted: remaining === 0 };
}

/**
 * Write the period's usage row.
 *
 * `usage_metering` has existed in the schema since the beginning with a unique
 * constraint on (workspace_id, period_start) and has never had an insert. These
 * counters read `processed_comments` instead because that is the table the
 * replies actually land in, and the two must agree.
 */
export async function recordUsage(
  workspaceId: string,
  usage: { replies: number; clicks?: number; apiCalls?: number }
): Promise<void> {
  const periodStart = currentMonthStart();
  const periodEnd = new Date(
    Date.UTC(periodStart.getUTCFullYear(), periodStart.getUTCMonth() + 1, 1)
  );

  const { error } = await supabaseAdmin.from("usage_metering").upsert(
    {
      workspace_id: workspaceId,
      period_start: periodStart.toISOString().slice(0, 10),
      period_end: periodEnd.toISOString().slice(0, 10),
      replies_used: usage.replies,
      ai_intent_credits_used: 0,
      tracked_clicks: usage.clicks ?? 0,
      api_calls: usage.apiCalls ?? 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "workspace_id,period_start" }
  );

  if (error) {
    // Usage recording must never take the product down; the counter that gates
    // replies reads processed_comments, not this table.
    console.warn("usage_metering write failed:", error.message);
  }
}

/**
 * Whether another channel may be attached to this workspace.
 *
 * `alreadyConnected` matters: re-running the Google callback for a channel the
 * workspace already has must not be counted against the limit, otherwise a
 * routine token refresh would eventually lock the owner out of their own
 * channel.
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
  return {
    allowed: connected < plan.channelLimit,
    plan,
    connected,
    limit: plan.channelLimit,
  };
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