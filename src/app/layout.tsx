import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
    "BigRedHub monitors YouTube Shorts comments, detects high buyer intent in sub-2 seconds, and auto-delivers tracked product, affiliate, and course links with anti-spam Spintax variations.",
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
    title: "BigRedHub — Turn YouTube Shorts Comments Into Instant Sales & Leads",
    // No response-time figure here on purpose. The dashboard's "Avg Speed: 1.4s"
    // was removed in #8 for having no data source, and a share card is the one
    // place that text outlives the tab it was read in.
    description:
      "Automated comment-to-link engine for creators and brands. Detect buyer intent, reply automatically, and send every comment to a trackable product link.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BigRedHub — Turn YouTube Shorts Comments Into Instant Sales & Leads",
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
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "BigRedHub monitors YouTube Shorts comments, detects buyer intent in sub-2 seconds, and delivers trackable product links with automated Spintax variations.",
  featureList: [
    "Sub-2s automated comment response",
    "Commercial buyer intent classification",
    "Anti-spam Spintax variations",
    "Official YouTube Data API compliance",
    "Real-time conversion tracking",
  ],
};

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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
