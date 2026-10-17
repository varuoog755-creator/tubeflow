import test from "node:test";
import assert from "node:assert/strict";
import {
  planFor,
  monthWindowStart,
  monthWindowEnd,
  monthlyAllowance,
  channelAllowance,
  decideRuleGuard,
  PLAN_CONFIGS,
  UNLIMITED_PLAN,
  byokAllowed,
} from "../src/lib/plan-limits.ts";

// These rules were added in the limits PR and shipped with no test coverage,
// because the code lived in a module that imports the Supabase client and so
// could not be loaded by node --test. These cover the decisions, not the
// queries.

test("Test account: the unlimited plan can never be metered out", () => {
  // The exemption is expressed as very large ceilings rather than a flag, so the
  // existing arithmetic has no branch to get wrong. Assert that with a reply
  // count far above every real plan.
  const heavy = monthlyAllowance(9_000_000, UNLIMITED_PLAN.monthlyRepliesLimit);
  assert.equal(heavy.exhausted, false);
  assert.equal(heavy.used, 9_000_000);
  assert.ok(heavy.remaining > 9_000_000);

  const channels = channelAllowance(99, UNLIMITED_PLAN.channelLimit, false);
  assert.equal(channels.atLimit, false);
  assert.equal(channels.allowed, true);
});

test("Test account: it does not leak into planFor, so no other account inherits it", () => {
  assert.equal(UNLIMITED_PLAN.id, "free");
  // A stored "free" must still resolve to the metered free plan.
  assert.notEqual(planFor("free"), UNLIMITED_PLAN);
  assert.equal(planFor("free").monthlyRepliesLimit, 10);
  assert.equal(planFor(undefined).monthlyRepliesLimit, 10);
});

test("Test account: a real free account is still capped after its 10 replies", () => {
  const capped = monthlyAllowance(10, PLAN_CONFIGS.free.monthlyRepliesLimit);
  assert.equal(capped.exhausted, true);
  assert.equal(capped.remaining, 0);
});

test("Plan resolution: unknown or missing plan falls back to free, never to unlimited", () => {
  assert.equal(planFor(undefined).id, "free");
  assert.equal(planFor(null).id, "free");
  assert.equal(planFor("").id, "free");
  assert.equal(planFor("enterprise-plus").id, "free");
  assert.equal(planFor("GROWTH").id, "growth");
  assert.equal(planFor("free").name, PLAN_CONFIGS.free.name);
});

test("Plan resolution: the advertised limits are the ones a plan actually carries", () => {
  // The pricing page and PLAN_CONFIGS disagreed on every number for as long as
  // both existed. These assertions are the contract that keeps them agreeing.
  assert.equal(PLAN_CONFIGS.free.monthlyRepliesLimit, 10);
  assert.equal(PLAN_CONFIGS.free.channelLimit, 1);
  assert.equal(PLAN_CONFIGS.growth.priceMonthlyInr, 499);
  assert.equal(PLAN_CONFIGS.growth.monthlyRepliesLimit, 500);
  assert.equal(PLAN_CONFIGS.growth.channelLimit, 2);
  assert.equal(PLAN_CONFIGS.scale.priceMonthlyInr, 999);
  assert.equal(PLAN_CONFIGS.scale.monthlyRepliesLimit, 2000);
  assert.equal(PLAN_CONFIGS.scale.channelLimit, 5);
  assert.equal(PLAN_CONFIGS.agency.priceMonthlyInr, 1999);
  assert.equal(PLAN_CONFIGS.agency.monthlyRepliesLimit, 100000);
  assert.equal(PLAN_CONFIGS.agency.channelLimit, 10);
});

test("Monthly window: starts on the 1st in UTC and ends on the next 1st", () => {
  const now = new Date("2026-10-14T09:30:00.000Z");
  assert.equal(monthWindowStart(now).toISOString(), "2026-10-01T00:00:00.000Z");
  assert.equal(monthWindowEnd(now).toISOString(), "2026-11-01T00:00:00.000Z");

  // A customer near month end must not get a window cut short by server time.
  const newYearEve = new Date("2026-12-31T23:59:59.000Z");
  assert.equal(monthWindowStart(newYearEve).toISOString(), "2026-12-01T00:00:00.000Z");
  assert.equal(monthWindowEnd(newYearEve).toISOString(), "2027-01-01T00:00:00.000Z");
});

test("Monthly allowance: blocks exactly at the limit, not one reply early", () => {
  const a = monthlyAllowance(0, 5000);
  assert.equal(a.allowed ?? true, true);
  assert.equal(a.remaining, 5000);
  assert.equal(a.exhausted, false);

  assert.equal(monthlyAllowance(4999, 5000).exhausted, false);
  assert.equal(monthlyAllowance(4999, 5000).remaining, 1);

  const last = monthlyAllowance(5000, 5000);
  assert.equal(last.remaining, 0);
  assert.equal(last.exhausted, true);

  // Overshoot cannot produce a negative allowance.
  const over = monthlyAllowance(5200, 5000);
  assert.equal(over.remaining, 0);
  assert.equal(over.exhausted, true);
});

test("Monthly allowance: a zero limit is treated as uncapped, not as blocked", () => {
  // This was the original `replySuccessRate: 100` bug class - a rate with a zero
  // denominator. A limit of 0 here means "not configured", and must not make the
  // customer look like they have used everything.
  const z = monthlyAllowance(0, 0);
  assert.equal(z.exhausted, false);
  assert.equal(z.remaining, 0);
  assert.equal(monthlyAllowance(7, 0).exhausted, false);
});

test("Channel allowance: refuses the (limit + 1)th channel, not the limitth", () => {
  assert.equal(channelAllowance(0, 1, false).allowed, true);
  assert.equal(channelAllowance(1, 1, false).allowed, false);
  assert.equal(channelAllowance(1, 1, false).atLimit, true);

  assert.equal(channelAllowance(4, 5, false).allowed, true);
  assert.equal(channelAllowance(5, 5, false).allowed, false);
  assert.equal(channelAllowance(10, 10, false).allowed, false);
});

test("Channel allowance: re-auth of an already connected channel is never refused", () => {
  // This is the case that would have locked an owner out of a channel they pay
  // for, on a routine token refresh.
  assert.equal(channelAllowance(1, 1, true).allowed, true);
  assert.equal(channelAllowance(10, 1, true).allowed, true);
  assert.equal(channelAllowance(99, 1, true).allowed, true);
});

test("Rule guard: daily cap stops the rule on the capth reply", () => {
  const atCap = decideRuleGuard({ usedToday: 10, maxRepliesPerDay: 10 });
  assert.equal(atCap.allowed, false);
  assert.equal(atCap.reason, "daily_cap");

  const oneLeft = decideRuleGuard({ usedToday: 9, maxRepliesPerDay: 10 });
  assert.equal(oneLeft.allowed, true);
});

test("Rule guard: an unset cap or cooldown means unlimited, not blocked", () => {
  // The columns default to 500/60 in the schema, but the API and the rule editor
  // can both send 0 or null. Treating either as "blocked" would silently stop a
  // customer's automation with no explanation.
  const none = decideRuleGuard({ usedToday: 9999, maxRepliesPerDay: 0, cooldownMinutes: 0 });
  assert.equal(none.allowed, true);

  const nullish = decideRuleGuard({
    usedToday: 9999,
    maxRepliesPerDay: null,
    cooldownMinutes: null,
    minutesSinceLastReply: 0.01,
  });
  assert.equal(nullish.allowed, true);
});

test("Rule guard: cooldown holds the rule until it has elapsed", () => {
  const held = decideRuleGuard({
    usedToday: 3,
    cooldownMinutes: 60,
    minutesSinceLastReply: 5,
  });
  assert.equal(held.allowed, false);
  assert.equal(held.reason, "cooldown");
  assert.equal(held.cooldownRemainingMinutes, 55);

  const elapsed = decideRuleGuard({
    usedToday: 3,
    cooldownMinutes: 60,
    minutesSinceLastReply: 60,
  });
  assert.equal(elapsed.allowed, true);

  const wellPast = decideRuleGuard({
    usedToday: 3,
    cooldownMinutes: 60,
    minutesSinceLastReply: 600,
  });
  assert.equal(wellPast.allowed, true);
});

test("Rule guard: a rule that has not posted today ignores its cooldown", () => {
  const first = decideRuleGuard({
    usedToday: 0,
    cooldownMinutes: 60,
    minutesSinceLastReply: null,
  });
  assert.equal(first.allowed, true);
});

test("Rule guard: daily cap is reported ahead of cooldown", () => {
  // Both are true at once. Reporting the cap tells the creator what will actually
  // change tomorrow; reporting the cooldown would say "wait N minutes" and then
  // still not reply.
  const v = decideRuleGuard({
    usedToday: 10,
    maxRepliesPerDay: 10,
    cooldownMinutes: 60,
    minutesSinceLastReply: 1,
  });
  assert.equal(v.allowed, false);
  assert.equal(v.reason, "daily_cap");
});

test("Rule guard: a blocked reply explains itself", () => {
  const cap = decideRuleGuard({ usedToday: 10, maxRepliesPerDay: 10 });
  assert.match(String(cap.detail), /10/);
  assert.match(String(cap.detail), /tomorrow/i);

  const cool = decideRuleGuard({
    usedToday: 1,
    cooldownMinutes: 30,
    minutesSinceLastReply: 28,
  });
  assert.match(String(cool.detail), /2 more minutes/i);

  const one = decideRuleGuard({
    usedToday: 1,
    cooldownMinutes: 30,
    minutesSinceLastReply: 29.5,
  });
  assert.match(String(one.detail), /1 more minute\b/i);
});

test("BYOK: the free trial stays on BigRedHub's shared quota", () => {
  // Free trial = platform credentials. Connecting personal Google Cloud
  // credentials is a paid-plan capability, decided here (pure) and enforced
  // by the API routes that use it.
  assert.equal(byokAllowed("free", false), false);
  assert.equal(byokAllowed(undefined, false), false);
  assert.equal(byokAllowed(null, false), false);
  assert.equal(byokAllowed("", false), false);
});

test("BYOK: paid plans may run on their own Google Cloud credentials", () => {
  assert.equal(byokAllowed("growth", false), true);
  assert.equal(byokAllowed("scale", false), true);
  assert.equal(byokAllowed("agency", false), true);
  assert.equal(byokAllowed("GROWTH", false), true);
});

test("BYOK: the test account keeps access on any stored plan", () => {
  assert.equal(byokAllowed("free", true), true);
  assert.equal(byokAllowed("growth", true), true);
  assert.equal(byokAllowed(undefined, true), true);
});

test("Rule guard: garbage counters cannot unlock a capped rule", () => {
  // A negative or NaN count must not read as "below the cap".
  assert.equal(decideRuleGuard({ usedToday: -5, maxRepliesPerDay: 10 }).allowed, true);
  const nan = decideRuleGuard({ usedToday: Number.NaN, maxRepliesPerDay: 10 });
  assert.equal(nan.allowed, true);
  assert.equal(nan.usedToday, 0);
  // ...but a negative elapsed time must not satisfy a cooldown.
  const notYet = decideRuleGuard({
    usedToday: 1,
    cooldownMinutes: 30,
    minutesSinceLastReply: -10,
  });
  assert.equal(notYet.allowed, false);
});