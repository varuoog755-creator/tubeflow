"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Video,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Zap,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  Users,
  Sparkles,
  Check,
  X,
  Star,
  Lock,
  Play,
  ChevronRight,
  Eye,
} from "lucide-react";

export default function Home() {
  // Interactive Simulation State
  const [activeKeyword, setActiveKeyword] = useState<"LINK" | "PRICE" | "GUIDE">("LINK");
  
  // Interactive Calculator State
  const [monthlyViews, setMonthlyViews] = useState<number>(300000);

  // Calculations for ROI
  const estimatedCommenters = Math.round((monthlyViews * 0.012));
  const lostWithoutAutomation = Math.round(estimatedCommenters * 0.82);
  const potentialRevenueLoss = Math.round(lostWithoutAutomation * 85); // approx INR 85 per lost conversion value

  const simulations = {
    LINK: {
      userComment: "Bro where can I buy this setup? Drop LINK pls!!",
      botReply: "Hey Vikram! Grab the exact gear with 35% discount here: https://tubeflow.in/gear-setup",
      tag: "Affiliate Link Trigger",
      badge: "Converted in 1.4s",
    },
    PRICE: {
      userComment: "Price kitna hai is course ka? Interested to join.",
      botReply: "Hey Ananya! The complete masterclass is just ₹999 today. Enrollment link: https://tubeflow.in/masterclass",
      tag: "Direct Sale Trigger",
      badge: "Order Placed ₹999",
    },
    GUIDE: {
      userComment: "Can you share the free PDF cheat sheet please?",
      botReply: "Sent! Download your free high-resolution cheat sheet here: https://tubeflow.in/free-pdf",
      tag: "Lead Magnet Trigger",
      badge: "Lead Captured",
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Psychological Urgency Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 py-2.5 px-4 text-center text-xs sm:text-sm font-semibold text-white tracking-wide flex items-center justify-center gap-2 shadow-inner">
        <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
        <span>84% of viewers who ask for links buy from competitors if you take over 15 minutes to reply.</span>
      </div>

      {/* Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-red-600 p-2.5 rounded-xl text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-2xl tracking-tight text-white block">TubeFlow</span>
              <span className="text-[10px] text-slate-400 -mt-1 block font-medium">YouTube Comment Automation</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-300 font-medium">
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#calculator" className="hover:text-white transition-colors">ROI Calculator</a>
            <a href="#comparison" className="hover:text-white transition-colors">The Cost of Delay</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Log In
            </Link>
            <Link
              href="/login"
              className="text-sm font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-xl shadow-red-600/25 hover:shadow-red-600/40"
            >
              Start Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-16 max-w-7xl mx-auto overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 blur-[140px] pointer-events-none rounded-full" />
          
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold mb-6 tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> Stop Losing Sales While You Sleep
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
              Turn Viral Shorts Comments Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-300">
                Instant Cash & Leads
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 leading-relaxed mb-10 font-normal">
              When viewers comment &quot;LINK&quot; or &quot;PRICE&quot;, their purchase intent peaks for 120 seconds. 
              TubeFlow auto-replies with your product link in 1.4 seconds, pins a creator heart, and locks the sale on autopilot.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-10">
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-base transition-all shadow-2xl shadow-red-600/30 flex items-center justify-center gap-2 group"
              >
                Connect YouTube Channel Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-400 text-xs sm:text-sm font-medium border-t border-slate-800/80 pt-8 max-w-3xl mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Google Cloud Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Zero Password Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>1.4s Average Reply Speed</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Auto-Heart & Algorithm Booster</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Interactive Simulation Widget */}
        <section className="py-12 px-6 max-w-6xl mx-auto relative z-10" id="how-it-works">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-red-400 text-xs font-bold uppercase tracking-widest block mb-2">Live Demonstration</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                See How Viewers Convert In Under 2 Seconds
              </h2>
              <p className="text-slate-400 text-sm mt-2">
                Click a trigger keyword below to see how TubeFlow grabs the customer before they scroll to the next Short.
              </p>

              {/* Trigger Buttons */}
              <div className="flex items-center justify-center gap-3 mt-6">
                {(["LINK", "PRICE", "GUIDE"] as const).map((kw) => (
                  <button
                    key={kw}
                    onClick={() => setActiveKeyword(kw)}
                    className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      activeKeyword === kw
                        ? "bg-red-600 text-white shadow-lg shadow-red-600/30 scale-105"
                        : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    Viewer comments &quot;{kw}&quot;
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Comment Flow Mockup */}
            <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-800/80 rounded-2xl p-6 shadow-inner space-y-4">
              {/* Viewer Comment */}
              <div className="flex items-start gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/50">
                <div className="w-9 h-9 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                  U
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-200">YouTube Viewer</span>
                    <span className="text-[11px] text-slate-500">3 seconds ago</span>
                  </div>
                  <p className="text-sm text-slate-300 mt-1 font-medium">
                    {simulations[activeKeyword].userComment}
                  </p>
                </div>
              </div>

              {/* TubeFlow Instant Bot Reply */}
              <div className="flex items-start gap-3 bg-red-950/20 p-4 rounded-xl border border-red-500/30 relative overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  <Zap className="w-3 h-3" /> {simulations[activeKeyword].badge}
                </div>
                <div className="w-9 h-9 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-md shadow-red-600/30">
                  TF
                </div>
                <div className="flex-1 pr-24">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">Your YouTube Channel</span>
                    <span className="bg-red-600 text-[10px] font-extrabold px-1.5 py-0.2 rounded text-white uppercase">Creator</span>
                  </div>
                  <p className="text-sm text-red-200 mt-1 font-medium leading-relaxed">
                    {simulations[activeKeyword].botReply}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-rose-400 font-semibold">
                      <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> Loved by creator
                    </span>
                    <span>•</span>
                    <span className="text-slate-400 font-medium">Auto-replied in 1.4s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Brutal Reality: The Cost of Delay */}
        <section className="py-20 px-6 max-w-7xl mx-auto" id="comparison">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-rose-500 text-xs font-bold uppercase tracking-widest block mb-2">Neuro-Behavior Fact</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
              Why Manual Replying Destroys 80%+ Of Your Income
            </h2>
            <p className="text-slate-400 text-base mt-4">
              Consumer neuroscience proves that impulse buying drops by 90% once a viewer leaves your video. Here is what happens every day on your channel:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* The Hard Way */}
            <div className="rounded-3xl border border-rose-900/40 bg-gradient-to-b from-rose-950/20 to-slate-900 p-8 relative">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
                  The Old Manual Way
                </span>
                <X className="w-6 h-6 text-rose-500" />
              </div>

              <h3 className="text-xl font-bold text-white mb-4">You Sleep, Leads Vanish</h3>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">✕</span>
                  <span><strong>Viewer asks at 11 PM:</strong> You are asleep or filming your next video.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">✕</span>
                  <span><strong>8 Hours Delay:</strong> You manually reply at 9 AM the next morning.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">✕</span>
                  <span><strong>Dead Interest:</strong> The customer has already purchased from a competitor or forgot why they cared.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">✕</span>
                  <span><strong>Founder Burnout:</strong> Wasting 3 hours daily typing repetitive links manually.</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-rose-950/60 text-center">
                <span className="text-xs text-rose-400 font-semibold block">Average Conversion</span>
                <span className="text-2xl font-extrabold text-rose-300">Under 1.8%</span>
              </div>
            </div>

            {/* The TubeFlow Way */}
            <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 to-slate-900 p-8 relative shadow-2xl shadow-emerald-950/20">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                  The TubeFlow Autopilot
                </span>
                <Check className="w-6 h-6 text-emerald-400" />
              </div>

              <h3 className="text-xl font-bold text-white mb-4">Instant Strike While Intent Is 100%</h3>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <span><strong>Instant 1.4s Delivery:</strong> The link appears right below their comment before they scroll away.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <span><strong>Dopamine Heart:</strong> Instant creator heart gives viewers a VIP feeling, driving loyalty.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <span><strong>Spintax Link Rotation:</strong> Cycles text variations so YouTube sees 100% genuine creator engagement.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <span><strong>Zero Effort:</strong> Runs 24/7/365 without touching your phone.</span>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-emerald-950/60 text-center">
                <span className="text-xs text-emerald-400 font-semibold block">Average Conversion</span>
                <span className="text-2xl font-extrabold text-emerald-300">14.6% (8.1x Boost)</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Loss Calculator */}
        <section className="py-20 px-6 bg-slate-900/40 border-y border-slate-800" id="calculator">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">Revenue Leakage Calculator</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How Much Money Are You Leaving On The Table?
            </h2>
            <p className="text-slate-400 text-sm mt-3">
              Slide to your monthly YouTube views to calculate your lost revenue from unreplied comments.
            </p>
          </div>

          <div className="max-w-3xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-300">Your Monthly YouTube Views:</span>
                <span className="text-red-400 font-extrabold text-lg">{monthlyViews.toLocaleString()} views/mo</span>
              </div>
              <input
                type="range"
                min="50000"
                max="3000000"
                step="50000"
                value={monthlyViews}
                onChange={(e) => setMonthlyViews(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>50,000 views</span>
                <span>1,500,000 views</span>
                <span>3,000,000+ views</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 text-center">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs text-slate-400 block font-medium">Comments Wanting Links</span>
                <span className="text-2xl font-bold text-white mt-1 block">~{estimatedCommenters.toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20">
                <span className="text-xs text-rose-300 block font-medium">Lost To Slow Replies</span>
                <span className="text-2xl font-bold text-rose-400 mt-1 block">{lostWithoutAutomation.toLocaleString()}</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20">
                <span className="text-xs text-amber-300 block font-medium">Estimated Lost Revenue</span>
                <span className="text-2xl font-extrabold text-amber-400 mt-1 block">₹{potentialRevenueLoss.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-8 text-center bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-xs text-slate-400 font-semibold block">The Solution</span>
                <span className="text-sm text-slate-200">TubeFlow Pro costs only <strong>₹1,499/mo</strong> and recovers this revenue automatically.</span>
              </div>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm whitespace-nowrap shadow-lg shadow-red-600/30"
              >
                Start Recovering Lost Sales
              </Link>
            </div>
          </div>
        </section>

        {/* Personas: Tailored for Influencers & Business Leaders */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-red-500 text-xs font-bold uppercase tracking-widest block mb-2">Designed For Professionals</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              Who Uses TubeFlow To Scale?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* E-Commerce / D2C Brands */}
            <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg mb-6">
                  🛍️
                </div>
                <h3 className="text-xl font-bold text-white mb-2">D2C & E-Commerce Brands</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Post unboxings and outfit try-on Shorts. Viewers asking &quot;Where can I buy this?&quot; get your exact Shopify product link with an exclusive discount code in seconds.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-300 font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Average 4.2x increase in checkout conversions</span>
              </div>
            </div>

            {/* Course Creators & Coaches */}
            <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg mb-6">
                  🎓
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Course Creators & Coaches</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Offer free roadmaps, PDF cheat sheets, or webinar entries in your Shorts. TubeFlow delivers your landing page link directly in the reply, filling your email list on autopilot.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-300 font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>350+ fresh student leads captured per viral video</span>
              </div>
            </div>

            {/* Tech & Affiliate Influencers */}
            <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/60 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg mb-6">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Affiliate & Tech Creators</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Review gadgets, software, or finance tools. When viewers ask &quot;Which app is this?&quot;, send your trackable affiliate link instantly and earn commissions while you rest.
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800 text-xs text-slate-300 font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>Monetize peak curiosity with zero manual typing</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 px-6 bg-slate-900/30 border-t border-slate-800" id="pricing">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest block mb-2">Simple Transparent Investment</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white">
              One Converted Sale Pays For An Entire Year
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Starter Plan */}
            <div className="p-8 rounded-3xl border border-slate-800 bg-slate-950 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Starter Test</span>
                <h3 className="text-2xl font-bold text-white">Free Forever</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-white">₹0</span>
                  <span className="text-slate-500 text-sm font-medium"> / month</span>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                  Test comment automation on your channel and verify the speed firsthand.
                </p>

                <ul className="space-y-3 text-sm text-slate-300 mb-8">
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Up to 100 auto-replies / month</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>1 Active Trigger Rule</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Auto-Heart & Auto-Like</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Google Cloud OAuth Security</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="w-full py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 text-white font-bold text-center text-sm transition-colors block"
              >
                Try Free Now
              </Link>
            </div>

            {/* Creator Growth Plan */}
            <div className="p-8 rounded-3xl border-2 border-red-500 bg-gradient-to-b from-red-950/20 to-slate-950 flex flex-col justify-between relative shadow-2xl shadow-red-950/30">
              <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                Most Popular for Creators
              </div>

              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest block mb-2">Unlimited Growth</span>
                <h3 className="text-2xl font-bold text-white">Pro Creator</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-extrabold text-white">₹1,499</span>
                  <span className="text-slate-400 text-sm font-medium"> / month</span>
                </div>
                <p className="text-sm text-slate-400 mb-6">
                  Full automatic revenue engine for active channels and businesses.
                </p>

                <ul className="space-y-3 text-sm text-slate-200 mb-8">
                  <li className="flex items-center gap-2.5 font-medium">
                    <Check className="w-4 h-4 text-red-400" />
                    <span><strong>Unlimited Auto-Replies</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium">
                    <Check className="w-4 h-4 text-red-400" />
                    <span><strong>Unlimited Trigger Campaigns</strong></span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium">
                    <Check className="w-4 h-4 text-red-400" />
                    <span><strong>Spintax Link Rotator</strong> (anti-spam protection)</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium">
                    <Check className="w-4 h-4 text-red-400" />
                    <span><strong>Instant Polling Priority</strong> (sub-second triggers)</span>
                  </li>
                  <li className="flex items-center gap-2.5 font-medium">
                    <Check className="w-4 h-4 text-red-400" />
                    <span><strong>Spam & Competitor Comment Filter</strong></span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-center text-sm transition-all shadow-xl shadow-red-600/30 block"
              >
                Upgrade To Pro
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6 max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-10 sm:p-14 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 blur-[100px] pointer-events-none rounded-full" />
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6">
              Your Next Viral Short Drops Soon. Are You Ready?
            </h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto mb-8">
              Connect your YouTube channel in 30 seconds. Put link distribution on autopilot before you post your next video.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-base transition-all shadow-xl shadow-red-600/30"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-10 px-6 bg-slate-950 text-slate-500 text-xs text-center">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-red-500" />
            <span className="font-bold text-slate-300">TubeFlow</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-300">Dashboard</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-slate-300">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
