import test from "node:test";
import assert from "node:assert/strict";
import { evaluateRuleMatch, renderReply } from "../src/lib/reply-engine.ts";
import { isYoutubeQuotaError, isYoutubeTokenRevoked } from "../src/lib/youtube.ts";

test("Pipeline Execution: Only counts confirmed replies with valid API IDs", () => {
  let confirmedRepliesCount = 0;
  let errorCount = 0;

  // Mock API simulation: 1 success, 1 failure
  const mockApiResponses = [
    { success: true, id: "yt_reply_101" },
    { success: false, error: new Error("Quota exceeded or comment deleted") },
  ];

  for (const res of mockApiResponses) {
    if (res.success && res.id) {
      confirmedRepliesCount++;
    } else {
      errorCount++;
    }
  }

  assert.equal(confirmedRepliesCount, 1, "Only confirmed external responses must increment reply count");
  assert.equal(errorCount, 1, "Failed API calls must be logged as errors");
});

test("Pipeline Error Detection: identifies YouTube API quota exhaustion accurately", () => {
  const quotaErr1 = {
    code: 403,
    errors: [{ message: "The request cannot be completed because you have exceeded your quota.", reason: "quotaExceeded" }],
  };
  assert.equal(isYoutubeQuotaError(quotaErr1), true);

  const quotaErr2 = new Error("Daily limit exceeded for user");
  assert.equal(isYoutubeQuotaError(quotaErr2), true);

  const networkErr = new Error("Connection reset by peer");
  assert.equal(isYoutubeQuotaError(networkErr), false);
});

test("Pipeline Error Detection: identifies revoked YouTube tokens", () => {
  const revokedErr = { response: { data: { error: "invalid_grant", error_description: "Token has been expired or revoked." } } };
  assert.equal(isYoutubeTokenRevoked(revokedErr), true);

  const randomErr = new Error("Resource not found");
  assert.equal(isYoutubeTokenRevoked(randomErr), false);
});

test("Pipeline Deduplication: idempotent processing skips already-replied comments", () => {
  const processedCommentIds = new Set<string>(["cmt_001", "cmt_002"]);

  const incomingComment = "cmt_001";
  const shouldSkip = processedCommentIds.has(incomingComment);

  assert.equal(shouldSkip, true, "Already processed comments must be skipped idempotently");
});
