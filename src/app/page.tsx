"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Video,
  ArrowRight,
  Check,
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Sliders,
  Play,
  Layers,
} from "lucide-react";

export default function Home() {
  const [activeKeyword, setActiveKeyword] = useState<"LINK" | "PRICE" | "GUIDE">("LINK");
  const [monthlyViews, setMonthlyViews] = useState<number>(300000);

  const estimatedCommenters = Math.round(monthlyViews * 0.012);
  const lostWithoutAutomation = Math.round(estimatedCommenters * 0.82);
  const potentialRevenueLoss = Math.round(lostWithoutAutomation * 85);

  const simulations = {
    LINK: {
      userComment: "Bro where can I buy this setup? Drop link please!",
      botReply: "Hey Vikram! Grab the exact gear here: https://tubeflow.in/gear-setup",
      tag: "AFFILIATE_INTENT",
      latency: "1.2s",
    },
    PRICE: {
      userComment: "What is the price of this masterclass? Interested.",
      botReply: "Hey Ananya! The complete curriculum is ₹999 today: https://tubeflow.in/masterclass",
      tag: "PRICE_INQUIRY",
      latency: "1.4s",
    },
    GUIDE: {
      userComment: "Can you share the free PDF cheat sheet?",
      botReply: "Sent! Download the full reference guide: https://tubeflow.in/free-pdf",
      tag: "LEAD_MAGNET",
      latency: "0.9s",
    },
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Minimal Announcement Bar */}
      <div className="border-b border-zinc-900 bg-zinc-950/90 py-2 px-4 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          <span>84% of viewers who ask for links buy within 15 minutes. Instant replies protect that intent.</span>
        </div>
      </div>

      {/* Navigation */}
      <header className="border-b border-zinc-900/90 bg-black/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Video className="w-4 h-4 text-red-500" />
            </div>
            <span className="font-semibold text-base tracking-tight text-white">TubeFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs text-zinc-400 font-medium">
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            <a href="#comparison" className="hover:text-white transition-colors">Why Automation</a>
            <a href="#calculator" className="hover:text-white transition-colors">ROI Calculator</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="text-xs font-medium bg-white text-black hover:bg-zinc-200 px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-20 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-zinc-400 text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <span>YouTube Comment Conversion Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-white leading-[1.12] mb-6">
            Turn YouTube comments into customers. On autopilot.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400 leading-relaxed mb-10 font-normal">
            TubeFlow detects commercial intent in viewer comments, auto-delivers trackable links in sub-2 seconds, and tracks conversions without manual typing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto mb-14">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs tracking-tight transition-colors flex items-center justify-center gap-2"
            >
              Connect YouTube Channel
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 text-zinc-300 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              See Live Demo
            </a>
          </div>

          {/* Minimal Key Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Latency</span>
              <span className="text-base font-semibold text-white block">1.4s Average</span>
              <span className="text-[11px] text-zinc-500">Sub-second polling</span>
            </div>
            <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Auth</span>
              <span className="text-base font-semibold text-white block">Google Verified</span>
              <span className="text-[11px] text-zinc-500">Official YouTube OAuth</span>
            </div>
            <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Safety</span>
              <span className="text-base font-semibold text-white block">Spintax Engine</span>
              <span className="text-[11px] text-zinc-500">Prevents repetitive spam</span>
            </div>
            <div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">Privacy</span>
              <span className="text-base font-semibold text-white block">Zero Passwords</span>
              <span className="text-[11px] text-zinc-500">Encrypted token store</span>
            </div>
          </div>
        </section>

        {/* Minimal Interactive Demo Widget */}
        <section className="py-16 px-6 max-w-4xl mx-auto" id="demo">
          <div className="border border-zinc-800 rounded-2xl bg-zinc-950 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-900">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block">Simulator</span>
                <h2 className="text-lg font-semibold text-white mt-0.5">Intent Detection in Real Time</h2>
              </div>

              {/* Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-lg bg-zinc-900 border border-zinc-800">
                {(["LINK", "PRICE", "GUIDE"] as const).map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setActiveKeyword(kw)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors ${
                      activeKeyword === kw
                        ? "bg-zinc-800 text-white font-medium"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    &quot;{kw}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Comment Pipeline */}
            <div className="pt-6 space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-900">
                <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                  <span className="font-medium text-zinc-300">YouTube Viewer</span>
                  <span className="font-mono text-[11px]">Just now</span>
                </div>
                <p className="text-sm text-zinc-200">
                  {simulations[activeKeyword].userComment}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">Your YouTube Channel</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400 border border-zinc-700">
                      Creator
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-emerald-400">
                    Delivered in {simulations[activeKeyword].latency}
                  </span>
                </div>
                <p className="text-sm text-zinc-300 font-mono leading-relaxed">
                  {simulations[activeKeyword].botReply}
                </p>
                <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-500">
                  <span className="font-mono text-zinc-400">Trigger: {simulations[activeKeyword].tag}</span>
                  <span>Creator heart applied automatically</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Minimal Comparison: The Cost of Delay */}
        <section className="py-20 px-6 max-w-5xl mx-auto" id="comparison">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2">Behavioral Analysis</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">The Cost of Delayed Responses</h2>
            <p className="text-zinc-400 text-sm mt-2">
              Buyer purchase intent decays rapidly once a viewer moves to the next video.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-4">
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Manual Commenting</span>
                <span className="text-xs font-mono text-zinc-500">~8h delay</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-400 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-600 font-mono">01.</span>
                  <span>Viewers ask while actively evaluating your video recommendation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-600 font-mono">02.</span>
                  <span>Hours pass before a creator manually sees the notification.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-600 font-mono">03.</span>
                  <span>Viewer has scrolled past or already found alternative products.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-600 font-mono">04.</span>
                  <span>Repetitive copy-pasting consumes multiple hours each week.</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
                <span className="text-zinc-500">Observed Conversion:</span>
                <span className="font-mono text-zinc-400">&lt; 2%</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-950">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-4">
                <span className="text-xs font-mono text-white uppercase tracking-wider font-medium">TubeFlow Automation</span>
                <span className="text-xs font-mono text-emerald-400">&lt; 2s response</span>
              </div>
              <ul className="space-y-3 text-xs text-zinc-300 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-500 font-mono">01.</span>
                  <span>Detects trigger keywords within active comment threads.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-500 font-mono">02.</span>
                  <span>Delivers verified links with Spintax rotation while intent is peak.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-500 font-mono">03.</span>
                  <span>Applies creator heart to trigger notification alert on the viewer&apos;s device.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-zinc-500 font-mono">04.</span>
                  <span>Runs continuously in the background across all your connected videos.</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-xs">
                <span className="text-zinc-400">Observed Conversion:</span>
                <span className="font-mono text-white font-semibold">12% – 16%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Minimal ROI Calculator */}
        <section className="py-20 px-6 border-y border-zinc-900 bg-zinc-950/40" id="calculator">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2">Estimation Model</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">Projected Recovery Value</h2>
              <p className="text-zinc-400 text-sm mt-1">
                Estimate how much commercial intent is captured with automated responses.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-black">
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-zinc-400">Monthly Channel Views:</span>
                  <span className="text-white font-semibold">{monthlyViews.toLocaleString()} views</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="3000000"
                  step="50000"
                  value={monthlyViews}
                  onChange={(e) => setMonthlyViews(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-600 mt-2">
                  <span>50K</span>
                  <span>1.5M</span>
                  <span>3M+</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-zinc-900 text-center">
                <div className="p-3 rounded-xl border border-zinc-900 bg-zinc-950">
                  <span className="text-[11px] text-zinc-500 block mb-1">Intent Comments</span>
                  <span className="text-lg font-mono font-semibold text-white">~{estimatedCommenters.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl border border-zinc-900 bg-zinc-950">
                  <span className="text-[11px] text-zinc-500 block mb-1">Uncaptured Manually</span>
                  <span className="text-lg font-mono font-semibold text-zinc-400">~{lostWithoutAutomation.toLocaleString()}</span>
                </div>
                <div className="p-3 rounded-xl border border-zinc-900 bg-zinc-950">
                  <span className="text-[11px] text-zinc-500 block mb-1">Estimated Value</span>
                  <span className="text-lg font-mono font-semibold text-emerald-400">₹{potentialRevenueLoss.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Minimal Pricing Section */}
        <section className="py-24 px-6 max-w-4xl mx-auto" id="pricing">
          <div className="text-center mb-14">
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2">Transparent Plans</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white">Simple, Predictable Pricing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Starter */}
            <div className="p-6 sm:p-8 rounded-2xl border border-zinc-800 bg-zinc-950 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-1">Starter</span>
                <h3 className="text-xl font-semibold text-white">Free Test</h3>
                <div className="my-4">
                  <span className="text-3xl font-bold text-white font-mono">₹0</span>
                  <span className="text-xs text-zinc-500 font-mono"> / month</span>
                </div>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Test sub-second comment response on your active channel.
                </p>

                <ul className="space-y-2.5 text-xs text-zinc-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Up to 100 auto-replies / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>1 Connected YouTube Channel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Exact & Phrase Keyword Triggers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>Google OAuth Token Encryption</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="w-full py-2.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/40 text-zinc-200 hover:text-white font-medium text-center text-xs transition-colors block"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-6 sm:p-8 rounded-2xl border border-zinc-700 bg-zinc-950 flex flex-col justify-between relative">
              <div className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full bg-white text-black text-[10px] font-mono font-medium">
                Recommended
              </div>

              <div>
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">Growth Tier</span>
                <h3 className="text-xl font-semibold text-white">Pro Creator</h3>
                <div className="my-4">
                  <span className="text-3xl font-bold text-white font-mono">₹1,499</span>
                  <span className="text-xs text-zinc-500 font-mono"> / month</span>
                </div>
                <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                  Full capacity for active creator channels and digital commerce brands.
                </p>

                <ul className="space-y-2.5 text-xs text-zinc-200 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>Unlimited automated replies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>Multi-channel support (up to 5 channels)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>Spintax message variation rotator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>Commercial Intent classification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-white shrink-0" />
                    <span>High-priority sub-second polling queue</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="w-full py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-center text-xs transition-colors block"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </section>

        {/* Minimal Final CTA */}
        <section className="py-20 px-6 max-w-3xl mx-auto text-center border-t border-zinc-900">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
            Ready to automate your comment pipeline?
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto mb-8">
            Connect in 30 seconds with Google OAuth. Your next video will respond automatically.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-zinc-200 text-black font-semibold text-xs transition-colors"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-zinc-900 py-8 px-6 bg-black text-zinc-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Video className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-medium text-zinc-300">TubeFlow</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-zinc-500">
            <Link href="/dashboard" className="hover:text-zinc-300 transition-colors">Dashboard</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
