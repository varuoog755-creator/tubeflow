export interface ReplyContext {
  authorName: string;
  channelTitle: string;
  videoTitle?: string;
  ctaUrl?: string;
  discountCode?: string;
}

export function parseSpintax(text: string): string {
  const matches = text.match(/{([^{}]+)}/g);
  if (!matches) return text;
  let result = text;
  matches.forEach((match) => {
    const choices = match.slice(1, -1).split("|");
    const choice = choices[Math.floor(Math.random() * choices.length)];
    result = result.replace(match, choice);
  });
  return result;
}

export function renderReply(template: string, context: ReplyContext): string {
  let reply = parseSpintax(template);

  // Extract first name from author name (e.g., "Rohit Sharma" -> "Rohit")
  const firstName = context.authorName.split(/[\s_.]+/)[0] || "Friend";

  reply = reply.replace(/{{first_name}}/gi, firstName);
  reply = reply.replace(/{{channel_name}}/gi, context.channelTitle);
  reply = reply.replace(/{{video_title}}/gi, context.videoTitle || "");
  reply = reply.replace(/{{cta_url}}/gi, context.ctaUrl || "");
  reply = reply.replace(/{{discount_code}}/gi, context.discountCode || "VIP20");

  return reply.trim();
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
