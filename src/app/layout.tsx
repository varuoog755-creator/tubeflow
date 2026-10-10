import type { Metadata } from "next";
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
  metadataBase: new URL("https://tubeflow-nine.vercel.app"),
  title: {
    default: "TubeFlow — Automated YouTube Comments to Sales & Conversions",
    template: "%s | TubeFlow",
  },
  description:
    "TubeFlow monitors YouTube Shorts comments, detects high buyer intent in sub-2 seconds, and auto-delivers tracked product, affiliate, and course links with anti-spam Spintax variations.",
  keywords: [
    "YouTube comment automation",
    "YouTube Shorts sales tool",
    "YouTube auto reply software",
    "comment to link YouTube",
    "creator monetization software",
    "GramFlow YouTube alternative",
    "YouTube affiliate link automation",
    "YouTube buyer intent AI",
    "YouTube Spintax replies",
  ],
  authors: [{ name: "TubeFlow Team" }],
  creator: "TubeFlow",
  publisher: "TubeFlow",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tubeflow-nine.vercel.app",
    siteName: "TubeFlow",
    title: "TubeFlow — Turn YouTube Shorts Comments Into Instant Sales & Leads",
    description:
      "Automated comment-to-link engine for creators and brands. Auto-reply in 1.4 seconds with trackable product links and AI buyer intent detection.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TubeFlow — Turn YouTube Shorts Comments Into Instant Sales & Leads",
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
    canonical: "https://tubeflow-nine.vercel.app",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "TubeFlow",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "TubeFlow monitors YouTube Shorts comments, detects buyer intent in sub-2 seconds, and delivers trackable product links with automated Spintax variations.",
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
