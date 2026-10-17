import Link from "next/link";
import { ArrowLeft, BookOpen, MessageCircle } from "lucide-react";
import GuideContent from "@/components/GuideContent";

export const metadata = {
  title: "Complete Guide — Setup, Plans & Your Own Google Quota",
  description:
    "BigRedHub complete guide: connect your YouTube channel, create automation rules, understand plans and billing, and learn how the free trial uses BigRedHub's shared Google quota while paid plans run on your own Google Cloud client ID & key.",
  openGraph: {
    title: "BigRedHub Complete Guide",
    description:
      "Step-by-step setup, dashboard tour, plan limits, billing via support, and how to switch to your own Google Cloud quota on paid plans.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "BigRedHub — YouTube Shorts comments, turned into tracked sales.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BigRedHub Complete Guide",
    description:
      "Setup, dashboard tour, plans, and the free-trial vs paid Google quota model — explained in one page.",
    images: ["/opengraph-image"],
  },
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/85 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-600/30">
              BR
            </div>
            <span className="font-heading font-extrabold text-lg tracking-tight text-zinc-950">
              BigRed<span className="text-red-600">Hub</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-600/25 transition-all"
            >
              Start free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-[11px] font-bold mb-4">
            <BookOpen className="w-3.5 h-3.5 text-red-600" />
            <span>Complete Setup Guide</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl tracking-tight text-zinc-950">
            Everything you need to run BigRedHub
          </h1>
          <p className="text-zinc-500 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            From your first automated reply to your own private Google quota — one page,
            step by step. This is the same guide you&apos;ll find inside the customer
            dashboard under <strong className="text-zinc-700">Guide &amp; Help</strong>.
          </p>
        </div>
      </div>

      {/* Guide body */}
      <main className="flex-1 w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <GuideContent />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} BigRedHub. Built for YouTube creators.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/919896374239"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-zinc-900 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp support
            </a>
            <Link href="/privacy" className="hover:text-zinc-900 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-900 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
