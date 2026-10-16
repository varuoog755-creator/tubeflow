import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PLAN_CONFIGS } from "@/lib/plan-limits";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bigredhub.info"),
  title: {
    default: "BigRedHub — Automated YouTube Comments to Sales & Conversions",
    template: "%s | BigRedHub",
  },
  description:
    "BigRedHub monitors YouTube Shorts comments, detects commercial buyer intent, and delivers trackable product links with automated Spintax variations.",
  keywords: [
    "YouTube comment automation",
    "YouTube Shorts sales tool",
    "YouTube auto reply software",
    "comment to link YouTube",
    "creator monetization software",
    "BigRedHub YouTube automation",
    "YouTube affiliate link automation",
    "YouTube buyer intent AI",
    "YouTube Spintax replies",
  ],
  authors: [{ name: "BigRedHub Team" }],
  creator: "BigRedHub",
  publisher: "BigRedHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bigredhub.info",
    siteName: "BigRedHub",
    title: "BigRedHub — Turn YouTube Shorts Comments Into Trackable Sales & Leads",
    // No response-time figure here on purpose, and none in the page description or
    // the JSON-LD either. The dashboard's "Avg Speed: 1.4s" was removed in #8 for
    // having no data source, and the poll cron is scheduled once a day
    // (vercel.json "0 0 * * *"), so a reply can wait nearly 24 hours to be seen.
    // The word "Instant" was removed from this title for the same reason: the
    // speed claims were stripped from the body copy and then missed here, which
    // left the social share card - the one piece of copy everyone actually reads
    // - as the last place still promising a speed the product cannot keep.
    description:
      "Automated comment-to-link engine for creators and brands. Detect buyer intent, reply automatically, and send every comment to a trackable product link.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BigRedHub — Turn YouTube Shorts Comments Into Trackable Sales & Leads",
    description:
      "Automated comment-to-link engine for creators and brands. Detect buyer intent and reply with tracked links.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://bigredhub.info",
  },
};

// Deep red sampled from brand/bigredhub-mark-512.png so the mobile browser
// chrome matches the icon rather than defaulting to black.
export const viewport: Viewport = {
  themeColor: "#CC213F",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BigRedHub",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  // Derived from PLAN_CONFIGS rather than typed out. This block advertised a
  // single ₹0 offer while the page sold three tiers, so search results could
  // never show the paid plans. Hard-coding prices here is how the two drifted
  // apart the first time; taking them from the catalogue makes that impossible.
  offers: [PLAN_CONFIGS.free, PLAN_CONFIGS.growth, PLAN_CONFIGS.scale].map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    description: `${plan.name} plan: ${plan.monthlyRepliesLimit.toLocaleString("en-IN")} replies per month, up to ${plan.channelLimit} YouTube channel${plan.channelLimit === 1 ? "" : "s"}.`,
    price: String(plan.priceMonthlyInr),
    priceCurrency: "INR",
  })),
  description:
    "BigRedHub monitors YouTube Shorts comments, classifies commercial buyer intent, and delivers trackable product links with automated Spintax variations.",
  featureList: [
    "Automated comment-to-reply workflow",
    "Commercial buyer intent classification",
    "Anti-spam Spintax variations",
    "Official YouTube Data API compliance",
    "Conversion tracking for replies",
  ],
};

import { VisitorTracker } from "@/components/VisitorTracker";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
