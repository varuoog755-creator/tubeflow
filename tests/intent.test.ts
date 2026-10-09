import test from "node:test";
import assert from "node:assert/strict";
import { detectIntent } from "../src/lib/intent.ts";

test("Intent Detection: flags Telegram and crypto spam accurately", () => {
  const spam1 = detectIntent("DM Telegram @investment_guru for 10x returns guaranteed!");
  assert.equal(spam1.category, "SPAM");
  assert.ok(spam1.confidence >= 0.9);

  const spam2 = detectIntent("Message my WhatsApp +1 800 234 5678 for crypto signals");
  assert.equal(spam2.category, "SPAM");

  const spam3 = detectIntent("sub4sub visit my channel and subscribe!");
  assert.equal(spam3.category, "SPAM");
});

test("Intent Detection: classifies Link Requests", () => {
  const result1 = detectIntent("Bhai link please kaha milega ye gadget?");
  assert.equal(result1.category, "LINK_REQUEST");

  const result2 = detectIntent("Where can I download the free pdf cheat sheet?");
  assert.equal(result2.category, "LINK_REQUEST");
});

test("Intent Detection: classifies Buying Intent", () => {
  const result = detectIntent("I want to buy this right now, how to enroll in masterclass?");
  assert.equal(result.category, "BUYING_INTENT");
});

test("Intent Detection: classifies Price Requests", () => {
  const result = detectIntent("Kitne ka hai ye course? What is the pricing and discount?");
  assert.equal(result.category, "PRICE_REQUEST");
});

test("Intent Detection: falls back safely to OTHER on ambiguous or general comments", () => {
  const result = detectIntent("Watching this from Mumbai, great camera angles today.");
  assert.ok(result.category === "OTHER" || result.category === "POSITIVE");
});
