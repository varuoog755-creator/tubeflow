// Administrators are configured through the environment, never in source.
// Previously this file hardcoded two email addresses. Because the repository is
// public, those addresses were readable by anyone, which turned `isAdmin` into
// a role that anyone who knew the repo could obtain.
//
// Configure with either:
//   ADMIN_EMAIL=you@example.com            (single admin, preferred)
//   ADMIN_EMAILS=you@example.com,other@x.com (comma separated, multiple)
//
// If neither is set, `isAdmin` always returns false and the admin surface is
// closed rather than falling open.
function getAdminEmails(): string[] {
  const single = process.env.ADMIN_EMAIL?.trim();
  const multiple = process.env.ADMIN_EMAILS?.split(",");
  const list = [single, ...(multiple || [])]
    .map((value) => value?.trim().toLowerCase())
    .filter((value): value is string => Boolean(value));
  return [...new Set(list)];
}

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  return getAdminEmails().includes(cleanEmail);
}

// Plan catalogue.
//
// The numbers here were completely different from the pricing page for as long
// as both existed: the page sold Free / Pro / Business at 0 / 499 / 1499 with
// 1 / 5 / 10 channels, while this file declared "Starter Free" / "Pro Growth" /
// "Agency Scale" at 0 / 1499 / 3999 with 1 / 3 / 10. Nothing rendered this file
// so the disagreement stayed invisible until it was read side by side with the
// live page. The marketing figures are now the ones of record and this file
// matches them.
//
// Two things worth knowing:
//
//   - `id` is stored in `workspaces.plan`, so these strings are data, not
//     display names. Renaming a plan's `name` is safe; changing its `id` is not.
//   - `monthlyRepliesLimit` counts replies BigRedHub posts, which is what
//     /api/subscription measures by counting processed_comments rows with
//     reply_status = 'replied'. It does not count comments merely seen.
//
// Note: nothing enforces these limits yet (issue #13). They are the advertised
// allowance and are reported back to the dashboard, not a gate.
export interface PlanConfig {
  id: "free" | "growth" | "scale";
  name: string;
  tagline: string;
  priceMonthlyInr: number;
  priceMonthlyInrYearly: number;
  channelLimit: number;
  monthlyRepliesLimit: number;
  features: string[];
  popular?: boolean;
}

export const PLAN_CONFIGS: Record<string, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    tagline: "For small creators",
    priceMonthlyInr: 0,
    priceMonthlyInrYearly: 0,
    channelLimit: 1,
    monthlyRepliesLimit: 100,
    features: [
      "100 replies / month",
      "1 YouTube channel",
      "Keyword and intent filters",
      "Official YouTube API compliance",
      "Community support",
    ],
  },
  growth: {
    id: "growth",
    name: "Pro",
    tagline: "For growing creators",
    priceMonthlyInr: 499,
    priceMonthlyInrYearly: 399,
    channelLimit: 5,
    monthlyRepliesLimit: 5000,
    popular: true,
    features: [
      "5,000 replies / month",
      "Up to 5 YouTube channels",
      "AI buyer-intent classification",
      "Anti-spam Spintax variations",
      "Tracked shortlinks and conversion attribution",
      "Target specific videos and Shorts",
      "Human reply delays (0s to 30s)",
    ],
  },
  scale: {
    id: "scale",
    name: "Business",
    tagline: "For large channels",
    priceMonthlyInr: 1499,
    priceMonthlyInrYearly: 1199,
    channelLimit: 10,
    monthlyRepliesLimit: 20000,
    features: [
      "20,000 replies / month",
      "Up to 10 YouTube channels",
      "Everything in Pro",
      "Multi-creator workspace management",
      "Custom branded shortlink domain",
      "High-frequency polling cycle",
      "Priority support",
    ],
  },
};
