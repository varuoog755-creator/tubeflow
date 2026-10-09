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
  Heart,
  Sliders,
  Play,
  Layers,
  MessageSquare,
  Lock,
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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-red-950 selection:text-red-200">
      {/* Gentle Announcement Bar */}
      <div className="border-b border-slate-800/60 bg-[#0f1523] py-2.5 px-4 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" />
          <span>Viewers buy within 15 minutes of asking for links. Instant auto-replies protect that intent.</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <header className="border-b border-slate-800/70 bg-[#0b0f19]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-400">
              <Video className="w-4 h-4" />
            </div>
            <span className="font-semibold text-base tracking-tight text-slate-100">TubeFlow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs text-slate-400 font-medium">
            <a href="#demo" className="hover:text-slate-200 transition-colors">How It Works</a>
            <a href="#comparison" className="hover:text-slate-200 transition-colors">Why Automation</a>
            <a href="#calculator" className="hover:text-slate-200 transition-colors">ROI Estimator</a>
            <a href="#pricing" className="hover:text-slate-200 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-xs font-medium bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-red-950/40 flex items-center gap-1.5"
            >
              <span>Start Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-16 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-700/60 bg-[#131b2e] text-slate-300 text-xs font-medium mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Automated YouTube Comment Growth Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100 leading-[1.18] mb-6">
            Turn YouTube comments into customers. On autopilot.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-10 font-normal">
            TubeFlow detects buyer intent in viewer comments, auto-delivers trackable links in under 2 seconds, and attributes conversions without manual typing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-sm mx-auto mb-14">
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs tracking-tight transition-all shadow-md shadow-red-950/50 flex items-center justify-center gap-2"
            >
              Connect YouTube Channel
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#demo"
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700/80 bg-[#131b2e]/60 hover:bg-[#131b2e] text-slate-300 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              See Live Demo
            </a>
          </div>

          {/* Comfortable Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 max-w-3xl mx-auto text-left">
            <div className="p-4 rounded-xl border border-slate-800 bg-[#101625] shadow-sm">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Speed</span>
              <span className="text-base font-semibold text-slate-100 block">1.4s Average</span>
              <span className="text-[11px] text-slate-400">Sub-second polling</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-[#101625] shadow-sm">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Security</span>
              <span className="text-base font-semibold text-slate-100 block">Google Verified</span>
              <span className="text-[11px] text-slate-400">Official YouTube OAuth</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-[#101625] shadow-sm">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Safety</span>
              <span className="text-base font-semibold text-slate-100 block">Spintax Engine</span>
              <span className="text-[11px] text-slate-400">Anti-spam variation</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-800 bg-[#101625] shadow-sm">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-1">Privacy</span>
              <span className="text-base font-semibold text-slate-100 block">Zero Passwords</span>
              <span className="text-[11px] text-slate-400">Encrypted token store</span>
            </div>
          </div>
        </section>

        {/* Live Simulator Widget */}
        <section className="py-16 px-6 max-w-4xl mx-auto" id="demo">
          <div className="border border-slate-800 rounded-2xl bg-[#111726] p-6 sm:p-8 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Live Simulator</span>
                <h2 className="text-lg font-semibold text-slate-100 mt-0.5">Intent Detection in Real Time</h2>
              </div>

              {/* Selector Tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0b0f19] border border-slate-800">
                {(["LINK", "PRICE", "GUIDE"] as const).map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setActiveKeyword(kw)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      activeKeyword === kw
                        ? "bg-[#1d273f] text-slate-100 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    &quot;{kw}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Flow Preview */}
            <div className="pt-6 space-y-3.5">
              <div className="p-4 rounded-xl bg-[#0b0f19] border border-slate-800/90">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-medium text-slate-300">YouTube Viewer</span>
                  <span className="text-[11px]">Just now</span>
                </div>
                <p className="text-sm text-slate-200">
                  {simulations[activeKeyword].userComment}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#162035] border border-slate-700/70 shadow-sm">
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100">Your YouTube Channel</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-950/60 text-red-300 border border-red-800/40">
                      Creator
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">
                    Delivered in {simulations[activeKeyword].latency}
                  </span>
                </div>
                <p className="text-sm text-slate-200 font-mono leading-relaxed">
                  {simulations[activeKeyword].botReply}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-slate-300">Trigger: {simulations[activeKeyword].tag}</span>
                  <span className="flex items-center gap-1 text-rose-400 font-medium">
                    <Heart className="w-3.5 h-3.5 fill-rose-500/80 text-rose-500" /> Auto-Heart applied
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Automation / Comparison Section */}
        <section className="py-20 px-6 max-w-5xl mx-auto" id="comparison">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">Behavioral Analysis</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100">The Cost of Delayed Responses</h2>
            <p className="text-slate-400 text-sm mt-2">
              Buyer purchase intent decays rapidly once a viewer scrolls to the next Short.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 sm:p-7 rounded-2xl border border-slate-800 bg-[#101625] shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Manual Commenting</span>
                <span className="text-xs font-mono text-rose-400">~8h delay</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-500 font-mono">01.</span>
                  <span>Viewers ask while actively evaluating your video recommendation.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-500 font-mono">02.</span>
                  <span>Hours pass before a creator manually sees the notification.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-500 font-mono">03.</span>
                  <span>Viewer has scrolled past or already found alternative products.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-500 font-mono">04.</span>
                  <span>Repetitive copy-pasting consumes multiple hours each week.</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Observed Conversion:</span>
                <span className="font-mono text-rose-400 font-semibold">&lt; 2%</span>
              </div>
            </div>

            <div className="p-6 sm:p-7 rounded-2xl border border-slate-700/80 bg-[#131b2e] shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="text-xs font-semibold text-slate-100 uppercase tracking-wider">TubeFlow Automation</span>
                <span className="text-xs font-mono text-emerald-400 font-medium">&lt; 2s response</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-200 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 font-mono">01.</span>
                  <span>Detects trigger keywords within active comment threads.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 font-mono">02.</span>
                  <span>Delivers verified links with Spintax rotation while intent is peak.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 font-mono">03.</span>
                  <span>Applies creator heart to trigger notification alert on viewer device.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-slate-400 font-mono">04.</span>
                  <span>Runs continuously in the background across all your connected videos.</span>
                </li>
              </ul>
              <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-300">Observed Conversion:</span>
                <span className="font-mono text-emerald-400 font-semibold">12% – 16% (8x Boost)</span>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="py-20 px-6 border-y border-slate-800/80 bg-[#0e1422]" id="calculator">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">Estimation Model</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100">Projected Recovery Value</h2>
              <p className="text-slate-400 text-sm mt-1">
                Estimate how much commercial intent is captured with automated responses.
              </p>
            </div>

            <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#111726] shadow-sm">
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-medium mb-2">
                  <span className="text-slate-300">Monthly Channel Views:</span>
                  <span className="text-red-400 font-semibold text-sm">{monthlyViews.toLocaleString()} views/mo</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="3000000"
                  step="50000"
                  value={monthlyViews}
                  onChange={(e) => setMonthlyViews(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-2">
                  <span>50K</span>
                  <span>1.5M</span>
                  <span>3M+</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-800 text-center">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0b0f19]">
                  <span className="text-[11px] text-slate-400 block mb-1">Intent Comments</span>
                  <span className="text-lg font-semibold text-slate-100">~{estimatedCommenters.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0b0f19]">
                  <span className="text-[11px] text-slate-400 block mb-1">Uncaptured Manually</span>
                  <span className="text-lg font-semibold text-rose-400">~{lostWithoutAutomation.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-800 bg-[#0b0f19]">
                  <span className="text-[11px] text-slate-400 block mb-1">Estimated Value</span>
                  <span className="text-lg font-semibold text-emerald-400">₹{potentialRevenueLoss.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 px-6 max-w-4xl mx-auto" id="pricing">
          <div className="text-center mb-14">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">Transparent Plans</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100">Simple, Predictable Pricing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Starter Plan */}
            <div className="p-6 sm:p-8 rounded-2xl border border-slate-800 bg-[#101625] flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">Starter Tier</span>
                <h3 className="text-xl font-semibold text-slate-100">Free Test</h3>
                <div className="my-4">
                  <span className="text-3xl font-bold text-slate-100 font-mono">₹0</span>
                  <span className="text-xs text-slate-400 font-mono"> / month</span>
                </div>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Test sub-second comment response on your active channel.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Up to 100 auto-replies / month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>1 Connected YouTube Channel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Exact & Phrase Keyword Triggers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Google OAuth Token Encryption</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="w-full py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-[#131b2e] text-slate-200 hover:text-white font-medium text-center text-xs transition-colors block"
              >
                Start Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="p-6 sm:p-8 rounded-2xl border border-red-500/40 bg-[#141d31] flex flex-col justify-between relative shadow-md">
              <div className="absolute -top-2.5 right-6 px-3 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-semibold tracking-wide">
                Recommended
              </div>

              <div>
                <span className="text-xs font-mono text-red-400 uppercase tracking-wider block mb-1">Growth Tier</span>
                <h3 className="text-xl font-semibold text-slate-100">Pro Creator</h3>
                <div className="my-4">
                  <span className="text-3xl font-bold text-slate-100 font-mono">₹1,499</span>
                  <span className="text-xs text-slate-400 font-mono"> / month</span>
                </div>
                <p className="text-xs text-slate-300 mb-6 leading-relaxed">
                  Full capacity for active creator channels and digital commerce brands.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-200 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Unlimited automated replies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Multi-channel support (up to 5 channels)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Spintax message variation rotator</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>Commercial Intent classification</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>High-priority sub-second polling queue</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-center text-xs transition-colors shadow-sm block"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-6 max-w-3xl mx-auto text-center border-t border-slate-800">
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100 mb-3">
            Ready to automate your comment pipeline?
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-8">
            Connect in 30 seconds with Google OAuth. Your next video will respond automatically.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium text-xs transition-colors shadow-md shadow-red-950/40"
          >
            Get Started Free <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 px-6 bg-[#090d16] text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Video className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-300">TubeFlow</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/dashboard" className="hover:text-slate-200 transition-colors">Dashboard</Link>
            <Link href="/terms" className="hover:text-slate-200 transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-slate-200 transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
