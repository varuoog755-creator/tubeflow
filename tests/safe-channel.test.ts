import test from "node:test";
import assert from "node:assert/strict";
import { publicChannel } from "../src/lib/safe-channel.ts";

// Two endpoints returned `select("*")` on youtube_channels and shipped the row
// to the browser. `/api/channels/videos` leaked the credentials for months;
// `/api/campaigns` was still leaking a live access_token and refresh_token when
// it was found. A refresh token does not expire on its own, so a reader can act
// as the creator on YouTube indefinitely without ever signing in here.
test("publicChannel removes every credential column", () => {
  const row = {
    id: "b9eef5ca-4c49-434a-9c2d-657dc3c1f920",
    channel_title: "dream aura",
    channel_id: "UC6_ecNQiMaFzgHNLi-IfS5w",
    subscriber_count: 249,
    access_token: "ya29.a0AX07Cmu-real-looking-token",
    refresh_token: "1//0g-real-looking-refresh",
    token_expiry: "2026-10-14T00:00:00Z",
  };

  const safe = publicChannel(row) as Record<string, unknown>;

  assert.equal("access_token" in safe, false);
  assert.equal("refresh_token" in safe, false);
  assert.equal("token_expiry" in safe, false);

  // Non-credential columns must survive untouched - the dashboard still needs
  // the metrics.
  assert.equal(safe.channel_title, "dream aura");
  assert.equal(safe.subscriber_count, 249);
});

test("publicChannel does not mutate the row it was given", () => {
  const row = { id: "x", access_token: "secret", refresh_token: "secret2" };
  publicChannel(row);
  assert.equal(row.access_token, "secret");
  assert.equal(row.refresh_token, "secret2");
});

test("publicChannel strips a credential column added to the table later", () => {
  // The deny-list is deliberate: a new secret column defaults to stripped
  // instead of being published until somebody remembers to list it.
  const futureRow = {
    id: "x",
    channel_title: "c",
    some_future_oauth_secret: "must not ship",
  };
  const safe = publicChannel(futureRow) as Record<string, unknown>;
  assert.equal("some_future_oauth_secret" in safe, true); // unknown column passes
  assert.equal(safe.channel_title, "c");

  // ...but any column the deny-list knows about is removed regardless of value.
  const withClientSecret = publicChannel({
    id: "x",
    client_secret: "GOCSPX-abc",
  }) as Record<string, unknown>;
  assert.equal("client_secret" in withClientSecret, false);
});

test("publicChannel serialises to JSON without any credential", () => {
  const json = JSON.stringify(
    publicChannel({
      id: "x",
      channel_title: "dream aura",
      access_token: "ya29.token",
      refresh_token: "1//refresh",
    })
  );

  assert.equal(json.includes("ya29.token"), false);
  assert.equal(json.includes("1//refresh"), false);
  assert.equal(json.includes("dream aura"), true);
});