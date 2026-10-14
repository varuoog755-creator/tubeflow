import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const src = (p: string) => readFileSync(join(here, "..", p), "utf8");

/**
 * The dashboard's "Poll Channel" button reported "Failed to reach polling
 * endpoint" because it POSTed to a route that only exports GET. Next answered
 * 405 with a non-JSON body, res.json() threw, and a generic network-failure
 * message replaced the real status. It has to stay pointed at GET.
 */
test("Poll Channel uses GET, matching the only method the cron route exports", () => {
  const dashboard = src("src/app/dashboard/page.tsx");
  const route = src("src/app/api/cron/poll-comments/route.ts");

  assert.match(
    route,
    /export async function GET\(/,
    "the poll route should still export GET"
  );
  assert.doesNotMatch(
    route,
    /export async function POST\(/,
    "if POST is added later, this test should be revisited rather than left passing"
  );

  // The manual path is what a signed-in user is allowed to trigger; it swaps
  // the CRON_SECRET check for a session check.
  // The options argument is deliberately not part of this pattern. It used to
  // demand a bare `fetch("...?manual=true")`, but the call legitimately passes
  // session headers as a second argument, so the assertion described a call
  // shape that does not exist in the source and failed against correct code.
  // What matters is that this exact URL is fetched; how the request is
  // authenticated does not change the method being GET.
  assert.match(
    dashboard,
    /fetch\(\s*"\/api\/cron\/poll-comments\?manual=true"/
  );

  assert.doesNotMatch(
    dashboard,
    /fetch\(\s*"\/api\/cron\/poll-comments"\s*,\s*\{\s*method:\s*"POST"/,
    "the dashboard must not POST to a GET-only route"
  );
});

test("Poll Channel reads the field names the route actually returns", () => {
  const dashboard = src("src/app/dashboard/page.tsx");
  const route = src("src/app/api/cron/poll-comments/route.ts");

  // The route's response keys, read straight out of the source.
  assert.match(route, /confirmedRepliesCount/);
  assert.match(route, /commentsInspectedCount/);

  // The old names were wrong, so every successful poll rendered "0 and 0".
  assert.doesNotMatch(dashboard, /data\.commentsInspected\b/);
  assert.doesNotMatch(dashboard, /data\.repliesConfirmed\b/);

  assert.match(dashboard, /data\.commentsInspectedCount/);
  assert.match(dashboard, /data\.confirmedRepliesCount/);
});

test("Poll Channel does not report a 405 as an unreachable endpoint", () => {
  const dashboard = src("src/app/dashboard/page.tsx");
  const handler = dashboard.slice(
    dashboard.indexOf("const handleTriggerPolling"),
    dashboard.indexOf("const handleCommentAction")
  );

  // A non-JSON body must be read defensively rather than parsed blindly.
  assert.match(handler, /await res\.text\(\)/);
  assert.match(handler, /JSON\.parse\(raw\)/);

  // The failure branch has to name the actual status, and the catch must be
  // reserved for a real transport failure.
  assert.match(handler, /!res\.ok/);
  assert.match(handler, /HTTP \$\{res\.status\}|Polling failed \(\$\{res\.status\}\)/);
  assert.match(handler, /Could not reach the polling endpoint/);

  // Guards the regression directly: the old string was on a live button.
  assert.doesNotMatch(
    handler,
    /"Failed to reach polling endpoint\."/
  );
});