import test from "node:test";
import assert from "node:assert/strict";
import { createSessionToken, verifySessionToken, type UserSession } from "../src/lib/session.ts";

test("Session Authentication: signs and verifies JWT session token", async () => {
  const sessionData: UserSession = {
    userId: "usr_998877",
    email: "creator@example.com",
    fullName: "Rohit Verma",
    avatarUrl: "https://example.com/avatar.jpg",
    workspaceId: "ws_443322",
  };

  const token = await createSessionToken(sessionData);
  assert.ok(typeof token === "string" && token.length > 20);

  const verified = await verifySessionToken(token);
  assert.ok(verified !== null);
  assert.equal(verified.userId, sessionData.userId);
  assert.equal(verified.email, sessionData.email);
  assert.equal(verified.workspaceId, sessionData.workspaceId);
});

test("Session Authentication: rejects tampered or malformed tokens", async () => {
  const invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature";
  const verified = await verifySessionToken(invalidToken);
  assert.equal(verified, null);
});
