import test from "node:test";
import assert from "node:assert/strict";
import {
  evaluateRuleMatch,
  renderReply,
  validateCtaUrl,
  validateReplyTemplate,
  parseSpintax,
} from "../src/lib/reply-engine.ts";

test("Rule Evaluation: Negative keyword has absolute precedence", () => {
  const rule = {
    keywords: ["LINK", "PRICE"],
    negativeKeywords: ["SCAM", "FAKE"],
    matchType: "contains",
    keywordMatchOperator: "ANY",
    intentCategory: "ALL",
  };

  const result = evaluateRuleMatch(rule, "Where is the LINK to this? Hope it's not a SCAM", "LINK_REQUEST");
  assert.equal(result.matched, false);
  assert.match(result.reason, /negative keyword "scam"/i);
  assert.equal(result.negativeKeywordHit, "scam");
});

test("Rule Evaluation: Match ANY operator succeeds if at least one keyword matches", () => {
  const rule = {
    keywords: ["DISCOUNT", "COUPON", "CODE"],
    negativeKeywords: ["FAKE"],
    matchType: "contains",
    keywordMatchOperator: "ANY",
    intentCategory: "ALL",
  };

  const result = evaluateRuleMatch(rule, "Do you have any DISCOUNT code for this course?", "PRICE_REQUEST");
  assert.equal(result.matched, true);
  assert.deepEqual(result.matchedKeywords, ["discount", "code"]);
});

test("Rule Evaluation: Match ANY operator fails if no keywords match", () => {
  const rule = {
    keywords: ["DISCOUNT", "COUPON"],
    negativeKeywords: [],
    matchType: "contains",
    keywordMatchOperator: "ANY",
    intentCategory: "ALL",
  };

  const result = evaluateRuleMatch(rule, "Great video brother loved the editing!", "POSITIVE");
  assert.equal(result.matched, false);
  assert.match(result.reason, /none of the trigger keywords matched/i);
});

test("Rule Evaluation: Match ALL operator requires all keywords to be present", () => {
  const rule = {
    keywords: ["BUY", "SETUP"],
    negativeKeywords: [],
    matchType: "contains",
    keywordMatchOperator: "ALL",
    intentCategory: "ALL",
  };

  // Only "BUY" is present
  const result1 = evaluateRuleMatch(rule, "I want to BUY this right now!", "BUYING_INTENT");
  assert.equal(result1.matched, false);
  assert.match(result1.reason, /Missing keyword\(s\): "setup"/);

  // Both "BUY" and "SETUP" are present
  const result2 = evaluateRuleMatch(rule, "Where to BUY this camera SETUP?", "BUYING_INTENT");
  assert.equal(result2.matched, true);
  assert.deepEqual(result2.matchedKeywords, ["buy", "setup"]);
});

test("Rule Evaluation: Match type 'exact' matches only full string", () => {
  const rule = {
    keywords: ["LINK"],
    negativeKeywords: [],
    matchType: "exact",
    keywordMatchOperator: "ANY",
    intentCategory: "ALL",
  };

  const failResult = evaluateRuleMatch(rule, "Send link please", "LINK_REQUEST");
  assert.equal(failResult.matched, false);

  const passResult = evaluateRuleMatch(rule, "LINK", "LINK_REQUEST");
  assert.equal(passResult.matched, true);
});

test("Rule Evaluation: Match type 'phrase' matches word boundaries without substrings", () => {
  const rule = {
    keywords: ["MIC"],
    negativeKeywords: [],
    matchType: "phrase",
    keywordMatchOperator: "ANY",
    intentCategory: "ALL",
  };

  // "COMIC" contains "mic" as a substring, but phrase match boundary must reject it
  const rejectResult = evaluateRuleMatch(rule, "This is a great comic book", "ALL");
  assert.equal(rejectResult.matched, false);

  // Standalone word "MIC" must match
  const matchResult = evaluateRuleMatch(rule, "What MIC are you using here?", "ALL");
  assert.equal(matchResult.matched, true);
});

test("Template Validation: catches unbalanced Spintax braces", () => {
  assert.equal(validateReplyTemplate("Hello {friend|mate").valid, false);
  assert.equal(validateReplyTemplate("Hello friend|mate}").valid, false);
  assert.equal(validateReplyTemplate("Hello {friend|mate}! Grab: {{cta_url}}").valid, true);
});

test("CTA URL Validation: enforces valid HTTP/HTTPS protocol", () => {
  assert.equal(validateCtaUrl("javascript:alert(1)").valid, false);
  assert.equal(validateCtaUrl("not-a-valid-url").valid, false);
  assert.equal(validateCtaUrl("https://tubeflow.in/gear").valid, true);
  assert.equal(validateCtaUrl("http://localhost:3000/deal").valid, true);
  assert.equal(validateCtaUrl("").valid, true);
});

test("Reply Renderer: safely substitutes Spintax and context variables", () => {
  const template = "{Hey|Hi} {{first_name}}! Here is {{video_title}} link: {{cta_url}}";
  const reply = renderReply(template, {
    authorName: "Aman Gupta",
    channelTitle: "Tech Daily",
    videoTitle: "Best Laptops 2026",
    ctaUrl: "https://tubeflow.in/deals",
  });

  assert.match(reply, /^(Hey|Hi) Aman! Here is Best Laptops 2026 link: https:\/\/tubeflow\.in\/deals$/);
});
