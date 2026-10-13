
// Plan catalogue.
//
// The numbers here were completely different from the pricing page for as long
// as both existed: the page sold Free / Pro / Business at 0 / 499 / 1499 with
// 1 / 5 / 10 channels, while this file declared "Starter Free" / "Pro Growth" /
// "Agency Scale" at 0 / 1499 / 3999 with 1 / 3 / 10. Nothing rendered this file
// so the disagreement stayed invisible until it was read side by side with the
// live page. The marketing figures are now the ones of record and this file
// matches them.
//
// Two things worth knowing:
//
//   - `id` is stored in `workspaces.plan`, so these strings are data, not
//     display names. Renaming a plan's `name` is safe; changing its `id` is not.
//   - `monthlyRepliesLimit` counts replies BigRedHub posts, which is what
//     /api/subscription measures by counting processed_comments rows with
//     reply_status = 'replied'. It does not count comments merely seen.
//
// Note: nothing enforces these limits yet (issue #13). They are the advertised
// allowance and are reported back to the dashboard, not a gate.
export interface PlanConfig {
  id: "free" | "growth" | "scale";
  name: string;
  tagline: string;
  priceMonthlyInr: number;
  priceMonthlyInrYearly: number;
  channelLimit: number;
  monthlyRepliesLimit: number;
  features: string[];
  popular?: boolean;
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "For small creators",
    priceMonthlyInr: 0,
    priceMonthlyInrYearly: 0,
    channelLimit: 1,
    monthlyRepliesLimit: 100,
    features: [
      "100 replies / month",
      "1 YouTube channel",
      "Keyword and intent filters",
      "Official YouTube API compliance",
      "Community support",
    ],
  },
  growth: {
    id: "growth",
    name: "Pro",
    tagline: "For growing creators",
    priceMonthlyInr: 499,
    priceMonthlyInrYearly: 399,
    channelLimit: 5,
    monthlyRepliesLimit: 5000,
    popular: true,
    features: [
      "5,000 replies / month",
      "Up to 5 YouTube channels",
      "AI buyer-intent classification",
      "Anti-spam Spintax variations",
      "Tracked shortlinks and conversion attribution",
      "Target specific videos and Shorts",
      "Human reply delays (0s to 30s)",
    ],
  },
  scale: {
    id: "scale",
    name: "Business",
    tagline: "For large channels",
    priceMonthlyInr: 1499,
    priceMonthlyInrYearly: 1199,
    channelLimit: 10,
    monthlyRepliesLimit: 20000,
    features: [
      "20,000 replies / month",
      "Up to 10 YouTube channels",
      "Everything in Pro",
      "Multi-creator workspace management",
      "Custom branded shortlink domain",
      "High-frequency polling cycle",
      "Priority support",
    ],
  },
};

/**
 * Plan and rule allowance rules, with no database and no environment access.
 *
 * The enforcement added in the limits PR had no tests, because it lived in a
 * module that imports the Supabase client and therefore cannot be loaded by
 * `node --test` (which does not resolve the `@/` alias). These are the decisions
 * that actually gate a customer's replies, so they are split out here to be
 * tested directly: `src/lib/limits.ts` does the counting and calls into here to
 * decide.
 */

export function planFor(planId?: string | null): PlanConfig {
  if (!planId) return PLAN_CONFIGS.free;
  return PLAN_CONFIGS[String(planId).toLowerCase()] || PLAN_CONFIGS.free;
}

/**
 * Start of the current calendar month in UTC, used as the reply window.
 *
 * UTC rather than local time so a workspace does not get a shorter month when
 * the server's timezone is behind the customer's.
 */
export function monthWindowStart(now: Date = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
}

export function monthWindowEnd(now: Date = new Date()): Date {
  const start = monthWindowStart(now);
  return new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 1));
}

export interface Allowance {
  limit: number;
  used: number;
  remaining: number;
  exhausted: boolean;
}

export function monthlyAllowance(used: number, limit: number): Allowance {
  const safeUsed = Number.isFinite(used) && used > 0 ? Math.floor(used) : 0;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 0;
  const remaining = Math.max(0, safeLimit - safeUsed);
  return {
    limit: safeLimit,
    used: safeUsed,
    remaining,
    exhausted: safeLimit > 0 ? remaining === 0 : false,
  };
}

/**
 * Whether a new channel may be attached.
 *
 * `alreadyConnected` must be true for a re-auth of an existing channel, or a
 * routine token refresh would eventually lock the owner out of a channel they
 * already pay for.
 */
export function channelAllowance(
  connectedCount: number,
  channelLimit: number,
  alreadyConnected: boolean
): { allowed: boolean; connected: number; limit: number; atLimit: boolean } {
  const connected = Number.isFinite(connectedCount) && connectedCount > 0 ? Math.floor(connectedCount) : 0;
  const limit = Number.isFinite(channelLimit) && channelLimit > 0 ? Math.floor(channelLimit) : 0;
  const atLimit = limit > 0 && connected >= limit;
  return {
    allowed: alreadyConnected || !atLimit,
    connected,
    limit,
    atLimit,
  };
}

export type GuardReason = "daily_cap" | "cooldown";

export interface RuleGuardInput {
  /** Replies this rule already posted since midnight UTC. */
  usedToday: number;
  /** 0 or null means the creator chose no cap. */
  maxRepliesPerDay?: number | null;
  /** 0 or null means no cooldown. */
  cooldownMinutes?: number | null;
  /** Minutes since this rule last posted. null when it has not posted today. */
  minutesSinceLastReply?: number | null;
}

export interface RuleGuardVerdict {
  allowed: boolean;
  reason?: GuardReason;
  dailyCap: number;
  usedToday: number;
  cooldownRemainingMinutes: number;
  /** Human-readable reason, safe to show a customer. */
  detail?: string;
}

/**
 * The creator's own safety settings.
 *
 * Both of these are editable in the rule editor and were stored on every rule,
 * but the reply path never read them - a "10 a day, 60 minute cooldown" rule
 * behaved exactly like an unlimited one. These are the settings that keep a
 * channel out of spam trouble, so the cap is checked first: a rule that has run
 * out of daily allowance should report that, not a cooldown.
 */
export function decideRuleGuard(input: RuleGuardInput): RuleGuardVerdict {
  const usedToday = Number.isFinite(input.usedToday) && input.usedToday > 0 ? Math.floor(input.usedToday) : 0;

  const rawCap = input.maxRepliesPerDay;
  const dailyCap = typeof rawCap === "number" && Number.isFinite(rawCap) && rawCap > 0 ? Math.floor(rawCap) : 0;

  if (dailyCap > 0 && usedToday >= dailyCap) {
    return {
      allowed: false,
      reason: "daily_cap",
      dailyCap,
      usedToday,
      cooldownRemainingMinutes: 0,
      detail: `Daily cap of ${dailyCap} reached. No more replies from this rule until tomorrow.`,
    };
  }

  const rawCooldown = input.cooldownMinutes;
  const cooldown =
    typeof rawCooldown === "number" && Number.isFinite(rawCooldown) && rawCooldown > 0
      ? Math.floor(rawCooldown)
      : 0;

  const since =
    typeof input.minutesSinceLastReply === "number" &&
    Number.isFinite(input.minutesSinceLastReply)
      ? input.minutesSinceLastReply
      : null;

  if (cooldown > 0 && since !== null && since < cooldown) {
    // Fails closed on purpose. A negative elapsed time means a clock skew or a
    // corrupt row; treating that as "cooldown satisfied" would let the rule post
    // early, which is the single outcome these settings exist to prevent.
    // Waiting the cooldown out is recoverable - a spam strike on the
    // customer's channel is not.
    const remaining = Math.max(1, Math.ceil(cooldown - Math.max(0, since)));
    return {
      allowed: false,
      reason: "cooldown",
      dailyCap,
      usedToday,
      cooldownRemainingMinutes: remaining,
      detail: `Cooldown active. ${remaining} more minute${remaining === 1 ? "" : "s"} before this rule can post again.`,
    };
  }

  return { allowed: true, dailyCap, usedToday, cooldownRemainingMinutes: 0 };
}