import test from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { PLAN_CONFIGS } from "../src/lib/plan-limits.ts";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p: string) => readFileSync(join(here, "..", p), "utf8");

/**
 * The marketing site and the enforcement code drifted apart: the homepage Free
 * card promised "50 replies/month" while the engine granted 10 (and the
 * dashboard plus the JSON-LD both said 10). A customer signs up expecting 50,
 * sees 10, and the trust damage is done before any reply is posted. The cards
 * on src/app/page.tsx and PLAN_CONFIGS in src/lib/plan-limits.ts must never
 * disagree again, so this test reads both instead of trusting either.
 */
test("homepage pricing cards quote the same allowances the engine enforces", () => {
  const homepage = read("src/app/page.tsx");

  // Every pricing card renders its reply allowance as
  // <strong>N replies</strong>/month, Free first, then Pro, then Scale.
  const cardTexts = [
    ...homepage.matchAll(/<strong>([\d,]+) replies<\/strong>/g),
  ].map((m) => Number(m[1].replace(/,/g, "")));

  const enforced = [
    PLAN_CONFIGS.free,
    PLAN_CONFIGS.growth,
    PLAN_CONFIGS.scale,
  ].map((p) => p.monthlyRepliesLimit);

  assert.ok(
    cardTexts.length >= enforced.length,
    `expected at least ${enforced.length} pricing cards showing a reply count, found ${cardTexts.length}`
  );

  const firstThree = cardTexts.slice(0, 3);
  assert.deepEqual(
    firstThree,
    enforced,
    `homepage pricing cards (${firstThree.join(", ")}) must quote PLAN_CONFIGS allowances (${enforced.join(", ")})`
  );
});

/**
 * The upgrade buttons used to point at wa.me/919999999999 - a placeholder that
 * routed paying customers' WhatsApp messages to a stranger's number. A
 * fourteen-digit 919999999999-like value is memorable enough to reappear as a
 * "temporary" number during any future redesign, so scan the whole tree.
 */
test("no placeholder WhatsApp numbers anywhere in src", () => {
  const files: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (/\.tsx?$/.test(entry)) files.push(full);
    }
  };
  walk(join(here, "..", "src"));

  const offenders = files
    .map((f) => ({ f, text: readFileSync(f, "utf8") }))
    .filter(({ text }) => /wa\.me\/919999999999|919999999999/.test(text));

  assert.deepEqual(
    offenders.map((o) => o.f),
    [],
    "placeholder WhatsApp number 919999999999 must never ship; use the real support number"
  );
});

/**
 * The signed-in dashboard kept its own copy of the plan numbers and drifted in
 * three places at once: the sidebar upgrade card promised 5,000 replies on a
 * plan that grants 500, and two Free surfaces still said 50 against an enforced
 * 10. Every allowance on that surface must derive from PLAN_CONFIGS.
 */
test("dashboard plan surfaces derive their allowances from PLAN_CONFIGS", () => {
  const dash = read("src/app/dashboard/page.tsx");

  assert.ok(
    !/\b5,000 replies/.test(dash),
    "sidebar upgrade card must not hardcode 5,000 replies (Pro grants 500)"
  );
  assert.ok(
    !/\b50 replies/.test(dash),
    "Free surfaces must not hardcode 50 replies (Free grants 10)"
  );
  assert.ok(
    /PLAN_CONFIGS\.free\.monthlyRepliesLimit/.test(dash) &&
      /PLAN_CONFIGS\.growth\.monthlyRepliesLimit/.test(dash) &&
      /PLAN_CONFIGS\.scale\.monthlyRepliesLimit/.test(dash),
    "dashboard plan cards must render their reply counts from PLAN_CONFIGS"
  );
  assert.ok(
    /planFor\(workspacePlan\)/.test(dash),
    "dashboard must resolve the live plan with planFor() instead of a hardcoded badge"
  );
  assert.ok(
    !/Oct 8, 2026/.test(dash),
    "the header date pill must be computed at mount, not frozen"
  );
});

/**
 * The admin allowlist's own comments said "never in source" while the two owner
 * addresses stayed baked in as defaults - so anyone reading the public repo
 * could name themselves admin. The list builders must stay env-only.
 */
test("admin and test-account allowlists never contain addresses in source", () => {
  const admin = read("src/lib/admin.ts");
  assert.ok(
    !/@gmail\.com|@pages\.plusgoogle\.com/.test(admin),
    "src/lib/admin.ts must read admins and test accounts from the environment only"
  );
});

/**
 * BYOK (the customer's own Google Cloud credentials) is a paid-plan
 * capability: the free trial runs on BigRedHub's shared quota. The decision
 * has to hold server-side too - a dashboard-only lock would still let a free
 * workspace switch itself onto personal credentials with a direct POST, or
 * keep running an old credential through the OAuth flow and the cron.
 */
test("BYOK gating is enforced in the API routes, not only in the UI", () => {
  const byokRoute = read("src/app/api/workspace/byok/route.ts");
  assert.ok(
    /byokAllowed/.test(byokRoute),
    "POST /api/workspace/byok must refuse enabling BYOK on the free plan"
  );

  const googleStart = read("src/app/api/auth/google/route.ts");
  assert.ok(
    /isByokAllowed/.test(googleStart),
    "OAuth start must ignore stored BYOK credentials when the plan does not allow them"
  );

  const cron = read("src/app/api/cron/poll-comments/route.ts");
  assert.ok(
    /isByokAllowed/.test(cron),
    "the cron must ignore stored BYOK credentials when the plan does not allow them"
  );
});

/**
 * The Admin Console entry in the sidebar was gated on the owner's literal email
 * address (plus a substring "admin" match). The gate is now the server-computed
 * isAdmin flag, and the client must never spell an address out again.
 */
test("dashboard does not gate admin UI on a hardcoded address", () => {
  const dash = read("src/app/dashboard/page.tsx");
  assert.ok(
    !/varuoog755@gmail\.com/.test(dash),
    "dashboard must use the isAdmin flag from /api/dashboard, not a literal email"
  );
});

/**
 * Polling promises must stay deliverable. YouTube has no push feed for
 * comments, so no plan may advertise "real-time" scanning; the sweep must
 * enforce the per-plan cadence the comparison table renders, apply the Pro
 * reply-delay feature it sells, and carry no guessable shared secret now that
 * this repository is public.
 */
test("polling promises match what the shipped poll worker does", () => {
  const cron = read("src/app/api/cron/poll-comments/route.ts");

  assert.ok(/getPollCadenceMinutes/.test(cron), "the sweep must apply the per-plan cadence");
  assert.ok(/isPollDue/.test(cron), "the sweep must check the due window");
  assert.ok(/delay_seconds/.test(cron), "the Pro reply-delay feature must be applied in the reply path");

  assert.ok(
    !/bigredhub_cron_poll_2026/.test(cron),
    "the cron route must not embed a guessable fallback key"
  );
  assert.ok(
    !/bigredhub_cron_poll_2026/.test(read(".github/workflows/cron-poll.yml")),
    "the backup workflow must not embed a guessable fallback key"
  );

  const advertised = JSON.stringify(PLAN_CONFIGS);
  assert.ok(
    !/real-?time/i.test(advertised),
    "no plan may advertise real-time comment scanning; it is not deliverable"
  );
});
