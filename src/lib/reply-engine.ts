export interface ReplyContext {
  authorName: string;
  channelTitle: string;
  videoTitle?: string;
  ctaUrl?: string;
  discountCode?: string;
}

export interface RuleEvaluationInput {
  keywords: string[];
  negativeKeywords?: string[];
  matchType?: "contains" | "exact" | "phrase" | string;
  keywordMatchOperator?: "ANY" | "ALL" | string;
  intentCategory?: string;
}

export interface RuleEvaluationResult {
  matched: boolean;
  reason: string;
  matchedKeywords: string[];
  negativeKeywordHit?: string;
}

export function validateCtaUrl(url?: string | null): { valid: boolean; error?: string } {
  if (!url || url.trim() === "") return { valid: true };
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return { valid: false, error: "CTA URL must start with http:// or https://" };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: "Invalid URL format" };
  }
}

export function validateReplyTemplate(template: string): { valid: boolean; error?: string } {
  if (!template || template.trim() === "") {
    return { valid: false, error: "Reply template cannot be empty" };
  }

  // Check balanced Spintax braces { and }
  let openBraces = 0;
  for (let i = 0; i < template.length; i++) {
    if (template[i] === "{") {
      // Check if it's a variable {{variable}}
      if (template[i + 1] === "{") {
        i++; // skip next brace
        continue;
      }
      openBraces++;
    } else if (template[i] === "}") {
      if (template[i + 1] === "}") {
        i++;
        continue;
      }
      openBraces--;
      if (openBraces < 0) {
        return { valid: false, error: "Unbalanced Spintax closing brace '}' found in template" };
      }
    }
  }

  if (openBraces !== 0) {
    return { valid: false, error: "Unclosed Spintax opening brace '{' found in template" };
  }

  // Catch the known-variable typo that produces literal placeholder text in
  // public comments: `{cta_url}` instead of `{{cta_url}}`. Brace balance alone
  // cannot see the difference, so it used to pass validation and post as-is.
  for (const name of KNOWN_VARIABLE_NAMES) {
    // Lookarounds keep the check off the inner braces of a correct {{name}}.
    const singleBrace = new RegExp(`(?<!\\{)\\{\\s*${name}\\s*\\}(?!\\})`, "i");
    if (singleBrace.test(template)) {
      return {
        valid: false,
        error: `"${name}" must be written as {{${name}}} with double braces. The single-brace form {${name}} is not substituted and would be published literally.`,
      };
    }
  }

  return { valid: true };
}

// Every placeholder the renderer knows how to fill. Anything else is left
// untouched so a typo stays visible in the preview instead of silently
// becoming an empty string.
const KNOWN_VARIABLE_NAMES = [
  "first_name",
  "channel_name",
  "video_title",
  "cta_url",
  "discount_code",
] as const;

export type VariableName = (typeof KNOWN_VARIABLE_NAMES)[number];

// Matches {{name}} and {name}. Whitespace inside the braces is tolerated.
const VARIABLE_PATTERN = /\{\{\s*([a-z0-9_]+)\s*\}\}|\{\s*([a-z0-9_]+)\s*\}/gi;

export function parseSpintax(text: string): string {
  // Replace spintax {option1|option2} requiring a pipe symbol '|' so {{variable}} is preserved
  let result = text;
  let iteration = 0;
  // Handle nested or multiple Spintax blocks up to 5 passes.
  // The regex is rebuilt each pass: a /g regex carries `lastIndex` between
  // `.test()` calls, which makes the loop condition depend on how far the
  // previous probe advanced instead of on the text.
  while (iteration < 5) {
    const probe = /\{([^{}|]+\|[^{}]+)\}/.exec(result);
    if (!probe) break;
    result = result.replace(/\{([^{}|]+\|[^{}]+)\}/g, (_match, contents: string) => {
      const choices = contents.split("|");
      return choices[Math.floor(Math.random() * choices.length)];
    });
    iteration++;
  }
  return result;
}

/**
 * Returns any placeholder-looking token still present in a rendered reply.
 *
 * A template written as `{first_name}` rather than `{{first_name}}` passes the
 * brace-balance check but is never substituted, so the literal text used to be
 * posted to a real viewer's public comment. Callers use this to refuse to
 * publish instead.
 */
export function findUnresolvedPlaceholders(text: string): string[] {
  const found = new Set<string>();
  const re = new RegExp(VARIABLE_PATTERN.source, VARIABLE_PATTERN.flags);
  let match: RegExpExecArray | null;
  while ((match = re.exec(text)) !== null) {
    found.add((match[1] || match[2] || "").toLowerCase());
  }
  return Array.from(found);
}

export function renderReply(template: string, context: ReplyContext): string {
  let reply = parseSpintax(template);

  // Extract clean first name from author name (e.g., "Rohit Sharma" -> "Rohit")
  const rawAuthor = (context.authorName || "").trim();
  const firstName = rawAuthor.split(/[\s_.]+/)[0] || "Friend";

  // Both {{name}} and {name} are accepted. Single-brace templates were the
  // original documented style and already exist in saved rules, so they keep
  // rendering rather than leaking into public comments.
  const values: Record<string, string> = {
    first_name: firstName,
    channel_name: context.channelTitle || "our channel",
    video_title: context.videoTitle || "this video",
    cta_url: context.ctaUrl || "",
    discount_code: context.discountCode || "VIP20",
  };

  reply = reply.replace(
    new RegExp(VARIABLE_PATTERN.source, VARIABLE_PATTERN.flags),
    (token, doubled: string | undefined, single: string | undefined) => {
      const key = (doubled || single || "").toLowerCase();
      return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : token;
    }
  );

  // Clean extra spaces if cta_url or video_title was omitted
  return reply.replace(/[ \t]+/g, " ").trim();
}

/**
 * Deterministic rule matcher with explicit Match ANY / Match ALL semantics,
 * negative keyword exclusions, and case-insensitive precision.
 */
export function evaluateRuleMatch(
  rule: RuleEvaluationInput,
  commentText: string,
  detectedIntent: string = "ALL"
): RuleEvaluationResult {
  const normalizedComment = (commentText || "").trim().toLowerCase();
  if (!normalizedComment) {
    return { matched: false, reason: "Comment text is empty", matchedKeywords: [] };
  }

  // 1. Negative keywords exclusion check (takes absolute precedence)
  const negativeList = (rule.negativeKeywords || [])
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  for (const neg of negativeList) {
    if (normalizedComment.includes(neg)) {
      return {
        matched: false,
        reason: `Skipped: comment contains negative keyword "${neg}"`,
        matchedKeywords: [],
        negativeKeywordHit: neg,
      };
    }
  }

  // 2. Keyword matching evaluation
  const keywords = (rule.keywords || [])
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);

  if (keywords.length === 0) {
    return { matched: false, reason: "Rule has no keywords defined", matchedKeywords: [] };
  }

  const matchType = (rule.matchType || "contains").toLowerCase();
  const operator = (rule.keywordMatchOperator || "ANY").toUpperCase();

  const isKeywordMatched = (kw: string): boolean => {
    if (matchType === "exact") {
      return normalizedComment === kw;
    }
    if (matchType === "phrase") {
      // Escape special regex characters in keyword for safe phrase boundary match
      const escaped = kw.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      const phraseRegex = new RegExp(`(^|\\b|\\s)${escaped}(\\b|\\s|$)`, "i");
      return phraseRegex.test(normalizedComment);
    }
    // Default 'contains'
    return normalizedComment.includes(kw);
  };

  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of keywords) {
    if (isKeywordMatched(kw)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  }

  if (operator === "ALL") {
    if (missingKeywords.length > 0) {
      return {
        matched: false,
        reason: `Skipped: Match ALL failed. Missing keyword(s): "${missingKeywords.join('", "')}"`,
        matchedKeywords,
      };
    }
  } else {
    // Operator is ANY
    if (matchedKeywords.length === 0) {
      return {
        matched: false,
        reason: `Skipped: none of the trigger keywords matched (Match ANY)`,
        matchedKeywords: [],
      };
    }
  }

  // 3. Intent category verification (simple keyword rules do not depend on AI model when intent is ALL)
  const ruleIntent = (rule.intentCategory || "ALL").toUpperCase();
  if (ruleIntent !== "ALL" && detectedIntent.toUpperCase() !== ruleIntent) {
    return {
      matched: false,
      reason: `Skipped: intent mismatch. Expected "${ruleIntent}", detected "${detectedIntent}"`,
      matchedKeywords,
    };
  }

  return {
    matched: true,
    reason: `Matched: found keyword(s) [${matchedKeywords.join(", ")}] with intent "${ruleIntent}"`,
    matchedKeywords,
  };
}

export const PRESET_TEMPLATES = [
  {
    category: "Product / Ecommerce",
    name: "Direct Product Link",
    template: "{Hey|Hello} {{first_name}}! {Here is the official product link|Grab it right here} 👇 {{cta_url}}",
  },
  {
    category: "Lead Magnet",
    name: "Free Guide / PDF Download",
    template: "{Awesome question|Glad you asked} {{first_name}}! {Download the complete free PDF guide here|Access the free resource now}: {{cta_url}}",
  },
  {
    category: "Affiliate / Tech Review",
    name: "Gear & Tools Link",
    template: "Hey {{first_name}} 👋 The exact gear used in this video is linked here: {{cta_url}} {Hope this helps!|Check it out!}",
  },
  {
    category: "Course / Coaching",
    name: "Course Enrollment CTA",
    template: "{Welcome|Hey} {{first_name}}! All curriculum details and enrollment bonuses are waiting for you here: {{cta_url}}",
  },
  {
    category: "Discount Offer",
    name: "Exclusive Viewer Coupon",
    template: "Hey {{first_name}}! Use code {{discount_code}} for an exclusive discount here: {{cta_url}} 🎉",
  },
];
