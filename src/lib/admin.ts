export const ADMIN_EMAILS: string[] = [
  "varuoog755@gmail.com",
  "govinda755rock755@gmail.com",
];

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  const envAdmin = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  if (envAdmin && cleanEmail === envAdmin) return true;
  return ADMIN_EMAILS.includes(cleanEmail);
}

export interface PlanConfig {
  id: "free" | "growth" | "scale";
  name: string;
  priceMonthlyInr: number;
  priceMonthlyUsd: number;
  channelLimit: number;
  monthlyRepliesLimit: number;
  features: string[];
  popular?: boolean;
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  free: {
    id: "free",
    name: "Starter Free",
    priceMonthlyInr: 0,
    priceMonthlyUsd: 0,
    channelLimit: 1,
    monthlyRepliesLimit: 50,
    features: [
      "1 YouTube Channel connection",
      "50 automated replies / month",
      "Basic keyword & trigger rules",
      "Standard comment polling",
      "Community support",
    ],
  },
  growth: {
    id: "growth",
    name: "Pro Growth",
    priceMonthlyInr: 1499,
    priceMonthlyUsd: 19,
    channelLimit: 3,
    monthlyRepliesLimit: 10000,
    popular: true,
    features: [
      "Up to 3 YouTube Channels",
      "Unlimited automated replies",
      "AI Buyer-Intent Classification",
      "Anti-Spam Spintax natural variations",
      "Tracked Shortlinks & Conversion Attribution",
      "Target specific videos & Shorts only",
      "Safe human reply delays (< 2s to 30s)",
      "Priority email & chat support",
    ],
  },
  scale: {
    id: "scale",
    name: "Agency Scale",
    priceMonthlyInr: 3999,
    priceMonthlyUsd: 49,
    channelLimit: 10,
    monthlyRepliesLimit: 100000,
    features: [
      "Up to 10 YouTube Channels",
      "Everything in Pro Growth",
      "Multi-creator workspace management",
      "Custom branded shortlink domain",
      "Dedicated high-speed polling cycle",
      "Direct API & webhook access",
      "1-on-1 Strategy & Setup Assistance",
      "24/7 Priority SLA support",
    ],
  },
};
