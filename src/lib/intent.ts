export type IntentCategory =
  | "BUYING_INTENT"
  | "PRICE_REQUEST"
  | "LINK_REQUEST"
  | "PRODUCT_QUESTION"
  | "INFO_REQUEST"
  | "POSITIVE"
  | "NEGATIVE"
  | "SPAM"
  | "SUPPORT"
  | "OTHER";

export interface IntentResult {
  category: IntentCategory;
  confidence: number;
  matchedSignals: string[];
}

const INTENT_PATTERNS: Record<IntentCategory, RegExp[]> = {
  LINK_REQUEST: [
    /\b(link|kaha se|kaha milega|where to buy|send link|drop link|link please|share link|pdf link|resource link|download link|source code|pdf|cheat sheet|freebie|template|download)\b/i,
  ],
  PRICE_REQUEST: [
    /\b(price|cost|kitne ka hai|rate|how much|pricing|fees|discount|coupon)\b/i,
  ],
  BUYING_INTENT: [
    /\b(want to buy|kharidna hai|order|interested|purchase|how to enroll|sign up|book now|take my money)\b/i,
  ],
  PRODUCT_QUESTION: [
    /\b(is this available|specifications|features|quality|size|color|warranty|review)\b/i,
  ],
  INFO_REQUEST: [
    /\b(guide|how to|tutorial|details|explain|kya hai|kaise kare)\b/i,
  ],
  SUPPORT: [
    /\b(help|issue|error|not working|problem|kuch nahi chal raha|refund)\b/i,
  ],
  POSITIVE: [
    /\b(great|awesome|love this|superb|best video|helpful|fire|bhai mast)\b/i,
  ],
  NEGATIVE: [
    /\b(worst|fake|bad|waste of time|clickbait|dislike)\b/i,
  ],
  SPAM: [
    /\b(telegram @|whatsapp \+|crypto|invest now|sub4sub|check my channel|free money)\b/i,
  ],
  OTHER: [],
};

export function detectIntent(text: string): IntentResult {
  const normalized = text.toLowerCase().trim();

  // 1. Check Spam first
  for (const regex of INTENT_PATTERNS.SPAM) {
    if (regex.test(normalized)) {
      return { category: "SPAM", confidence: 0.95, matchedSignals: ["spam_filter"] };
    }
  }

  // 2. High commercial intents
  for (const regex of INTENT_PATTERNS.LINK_REQUEST) {
    if (regex.test(normalized)) {
      return { category: "LINK_REQUEST", confidence: 0.92, matchedSignals: ["link_intent"] };
    }
  }

  for (const regex of INTENT_PATTERNS.BUYING_INTENT) {
    if (regex.test(normalized)) {
      return { category: "BUYING_INTENT", confidence: 0.90, matchedSignals: ["buy_intent"] };
    }
  }

  for (const regex of INTENT_PATTERNS.PRICE_REQUEST) {
    if (regex.test(normalized)) {
      return { category: "PRICE_REQUEST", confidence: 0.88, matchedSignals: ["price_intent"] };
    }
  }

  for (const regex of INTENT_PATTERNS.PRODUCT_QUESTION) {
    if (regex.test(normalized)) {
      return { category: "PRODUCT_QUESTION", confidence: 0.82, matchedSignals: ["product_question"] };
    }
  }

  for (const regex of INTENT_PATTERNS.INFO_REQUEST) {
    if (regex.test(normalized)) {
      return { category: "INFO_REQUEST", confidence: 0.80, matchedSignals: ["info_request"] };
    }
  }

  for (const regex of INTENT_PATTERNS.SUPPORT) {
    if (regex.test(normalized)) {
      return { category: "SUPPORT", confidence: 0.85, matchedSignals: ["support_request"] };
    }
  }

  return { category: "OTHER", confidence: 0.50, matchedSignals: [] };
}
