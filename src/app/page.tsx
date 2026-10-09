"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import Link from "next/link";
import {
  Video,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Shield,
  Heart,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MessageCircle,
  Eye,
  Check,
} from "lucide-react";

interface Scenario {
  id: string;
  label: string;
  viewerName: string;
  comment: string;
  detectedIntent: string;
  intentConfidence: string;
  replyText: string;
  trackedUrl: string;
  latency: string;
  revenue: string;
  conversionTime: string;
}

const DEMO_SCENARIOS: Scenario[] = [
  {
    id: "gear",
    label: "Product Inquiry",
    viewerName: "Vikram Malhotra",
    comment: "Bro where can I buy this camera setup? Drop the link please!",
    detectedIntent: "High Buyer Intent: Product Link",
    intentConfidence: "99.4%",
    replyText: "Hey Vikram! Grab the exact camera and mic setup here:",
    trackedUrl: "tubeflow.in/gear-setup",
    latency: "1.4s",
    revenue: "₹2,450 Sale",
    conversionTime: "4 mins later",
  },
  {
    id: "course",
    label: "Course Enrollment",
    viewerName: "Ananya Sharma",
    comment: "Is enrollment still open for the video editing cohort?",
    detectedIntent: "High Buyer Intent: Course Purchase",
    intentConfidence: "98.8%",
    replyText: "Hey Ananya! Enrollment closes tonight. View curriculum here:",
    trackedUrl: "tubeflow.in/edit-cohort",
    latency: "1.2s",
    revenue: "₹4,999 Sale",
    conversionTime: "7 mins later",
  },
  {
    id: "coupon",
    label: "Discount Code",
    viewerName: "Rohan Patel",
    comment: "Do you have any active discount code for this software?",
    detectedIntent: "Purchase Inquiry: Promo Code",
    intentConfidence: "97.9%",
    replyText: "Hey Rohan! Code TUBEFLOW saves 20% right now:",
    trackedUrl: "tubeflow.in/save20",
    latency: "1.1s",
    revenue: "₹1,200 Sale",
    conversionTime: "2 mins later",
  },
];

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>("gear");
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const scenario =
    DEMO_SCENARIOS.find((s) => s.id === activeScenarioId) ?? DEMO_SCENARIOS[0];

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 7;
    const rotateY = ((x - centerX) / centerX) * 7;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-red-100 selection:text-red-700 antialiased">
      {/* Top Banner */}
      <div className="border-b border-zinc-100 bg-zinc-50/70 px-4 py-2 text-center text-xs font-medium text-zinc-600">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 inline-block animate-pulse" />
          <span>
            Connect YouTube Data API v3 to auto-reply to viewers while buyer intent peaks.
          </span>
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-zinc-950">
              Tube<span className="text-red-600">Flow</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600">
            <a
              href="#demo"
              className="hover:text-zinc-950 transition-colors"
            >
              Interactive Demo
            </a>
            <a
              href="#workflow"
              className="hover:text-zinc-950 transition-colors"
            >
              How It Works
            </a>
            <a
              href="#benefits"
              className="hover:text-zinc-950 transition-colors"
            >
              Conversion Benefits
            </a>
            <a
              href="#faq"
              className="hover:text-zinc-950 transition-colors"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-950 px-3 py-1.5 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-red-600/20 hover:shadow-red-600/30 flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative px-6 pt-16 pb-20 md:pt-24 md:pb-28 max-w-6xl mx-auto overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-6 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-200/80 bg-red-50/80 text-red-700 text-xs font-semibold mb-6 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span>YouTube Creator Conversion Engine</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-zinc-950 leading-[1.1] mb-6">
              Turn YouTube comments into customers. On autopilot.
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-8 max-w-xl">
              TubeFlow detects buyer intent in viewer comments, auto-delivers trackable links in under 2 seconds, and attributes conversions without manual typing.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-10">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all shadow-lg shadow-red-600/25 hover:shadow-red-600/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Connect Your YouTube Channel</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 font-semibold text-sm transition-all shadow-xs"
              >
                <span>View Live Demo Flow</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </a>
            </div>

            {/* Credibility metrics without inflated claims */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-zinc-100 w-full max-w-lg">
              <div>
                <p className="text-xl font-heading font-bold text-zinc-950">&lt; 2.0s</p>
                <p className="text-xs text-zinc-500 mt-0.5">Average Reply Speed</p>
              </div>
              <div>
                <p className="text-xl font-heading font-bold text-zinc-950">100%</p>
                <p className="text-xs text-zinc-500 mt-0.5">Tracked Link Attribution</p>
              </div>
              <div>
                <p className="text-xl font-heading font-bold text-zinc-950">Zero</p>
                <p className="text-xs text-zinc-500 mt-0.5">Manual Copy-Pasting</p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D/4D Animated Product Demo */}
          <div
            id="demo"
            className="lg:col-span-6 relative perspective-1200 flex justify-center items-center py-6"
          >
            {/* Ambient Breathing Glow */}
            <div className="absolute w-72 h-72 rounded-full bg-red-500/15 blur-3xl pointer-events-none animate-pulse-subtle" />

            {/* Orbiting Glass Spheres */}
            <div className="absolute w-8 h-8 rounded-full bg-red-600/20 border border-red-400/40 backdrop-blur-sm pointer-events-none animate-orbit hidden sm:block" />
            <div className="absolute w-5 h-5 rounded-full bg-red-500/30 border border-red-300/50 backdrop-blur-sm pointer-events-none animate-orbit-delayed hidden sm:block" />

            {/* 3D Container with Mouse-Follow Tilt */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: isHovered
                  ? "transform 0.1s ease-out"
                  : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
              }}
              className="relative w-full max-w-lg bg-white rounded-3xl border border-zinc-200/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08),0_0_1px_1px_rgba(0,0,0,0.04)] p-6 sm:p-7 transform-style-3d cursor-default"
            >
              {/* Glossy Red YouTube Play Tile badge */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/40 border border-red-400/30 animate-float">
                <Video className="w-6 h-6 fill-white text-white drop-shadow-sm" />
              </div>

              {/* Demo Mode Notice */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                    Pipeline Simulation
                  </span>
                </div>
                <span className="text-[11px] font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">
                  Illustrative interactive model
                </span>
              </div>

              {/* Scenario Switcher Tabs */}
              <div className="mt-4 flex gap-1.5 p-1 bg-zinc-100/80 rounded-xl">
                {DEMO_SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveScenarioId(s.id)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                      activeScenarioId === s.id
                        ? "bg-white text-zinc-900 shadow-xs"
                        : "text-zinc-600 hover:text-zinc-900"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Four-Stage Animated Demo Stream */}
              <div className="mt-5 space-y-3.5">
                {/* 1. Viewer Comment */}
                <div className="bg-zinc-50 border border-zinc-200/70 rounded-2xl p-3.5 transition-all">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-[10px]">
                        {scenario.viewerName.charAt(0)}
                      </div>
                      <span className="font-semibold text-zinc-900">
                        {scenario.viewerName}
                      </span>
                      <span className="text-zinc-600">• on YouTube Shorts</span>
                    </div>
                    <span className="text-[11px] text-zinc-600">Just now</span>
                  </div>
                  <p className="text-xs font-medium text-zinc-800 leading-snug">
                    &ldquo;{scenario.comment}&rdquo;
                  </p>
                </div>

                {/* 2. Intent Detection Step */}
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50/90 border border-red-200/80 rounded-xl text-xs">
                  <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="font-semibold text-red-950">
                      {scenario.detectedIntent}
                    </span>
                    <span className="text-[11px] font-bold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-md">
                      {scenario.intentConfidence} match
                    </span>
                  </div>
                </div>

                {/* 3. Automatic Tracked Link Reply */}
                <div className="bg-zinc-900 text-white rounded-2xl p-3.5 shadow-md border border-zinc-800">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">
                        <Video className="w-3 h-3 fill-white" />
                      </div>
                      <span className="font-semibold text-zinc-100">
                        TubeFlow Bot
                      </span>
                      <span className="text-emerald-400 font-medium text-[11px] flex items-center gap-1">
                        <Check className="w-3 h-3" /> Auto-Replied ({scenario.latency})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-red-400 text-[11px] font-medium">
                      <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                      <span>Hearted</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {scenario.replyText}{" "}
                    <span className="text-red-400 font-semibold underline underline-offset-2">
                      {scenario.trackedUrl}
                    </span>
                  </p>
                </div>

                {/* 4. Attributed Conversion Outcome */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-emerald-50 border border-emerald-200/90 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-semibold text-emerald-950">
                        Attributed Conversion:{" "}
                      </span>
                      <span className="font-bold text-emerald-700">
                        {scenario.revenue}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700">
                    {scenario.conversionTime}
                  </span>
                </div>
              </div>

              {/* Floating Layer 3D Badge: Reply Speed */}
              <div className="absolute -bottom-3 -left-3 bg-white border border-zinc-200 rounded-xl px-3 py-2 shadow-lg shadow-zinc-900/5 hidden sm:flex items-center gap-2 animate-float-reverse">
                <div className="w-6 h-6 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-zinc-900 leading-none">
                    Under 2 Seconds
                  </p>
                  <p className="text-[10px] text-zinc-500 leading-none mt-0.5">
                    Fastest buyer response
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE-STEP WORKFLOW SECTION */}
      <section
        id="workflow"
        className="py-20 bg-zinc-50 border-y border-zinc-100 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold mb-3">
              <Target className="w-3.5 h-3.5 text-red-600" />
              <span>Three-Step Workflow</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
              From viewer inquiry to verified revenue
            </h2>
            <p className="text-base text-zinc-600">
              TubeFlow replaces manual typing with an intelligent intent pipeline that captures sales when interest is fresh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-heading font-bold text-lg mb-6">
                01
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-3">
                Detect Buyer Intent
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                TubeFlow continuously monitors new comments on your videos and Shorts. The intent engine distinguishes buyers asking for links and prices from casual noise and spam.
              </p>
              <ul className="space-y-2 text-xs font-medium text-zinc-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Keyword and intent matching rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Negative word filtering to eliminate spam</span>
                </li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-heading font-bold text-lg mb-6">
                02
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-3">
                Deliver Trackable Links
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                When a viewer asks for gear, pricing, or product recommendations, TubeFlow posts a personalized reply with an attributed short URL in under 2 seconds.
              </p>
              <ul className="space-y-2 text-xs font-medium text-zinc-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Spintax natural response rotation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Automatic creator heart for high visibility</span>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-heading font-bold text-lg mb-6">
                03
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-3">
                Attribute Conversions
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                Track clicks and orders tied back to exact videos. Gain clarity on which content drives customers and which replies produce high click-through rates.
              </p>
              <ul className="space-y-2 text-xs font-medium text-zinc-700">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Video-level attribution analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  <span>Webhook and conversion webhook support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CONVERSION-TRACKING BENEFITS SECTION */}
      <section id="benefits" className="py-20 px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-red-600" />
            <span>Conversion Architecture</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
            Engineered for creators who sell
          </h2>
          <p className="text-base text-zinc-600">
            Viewers asking for links in comments intend to purchase immediately. TubeFlow locks in that moment before attention wanders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Benefit Card 1 */}
          <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <Zap className="w-5 h-5 fill-red-600" />
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-2">
                Sub-2-Second Response Window
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Most viewers close YouTube within minutes of posting a query. TubeFlow monitors your channel and answers while they are still holding their phones.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center gap-3 text-xs font-semibold text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Capture intent while purchase readiness is highest</span>
            </div>
          </div>

          {/* Benefit Card 2 */}
          <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-2">
                Clean UTM and Link Attribution
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Stop guessing which YouTube Short brought sales. Every automated reply embeds specific campaign parameters so your analytics dashboard reflects actual revenue.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center gap-3 text-xs font-semibold text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Direct link to order data and lead forms</span>
            </div>
          </div>

          {/* Benefit Card 3 */}
          <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <Heart className="w-5 h-5 fill-red-600" />
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-2">
                Automatic Heart for Algorithm Lift
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Replying and giving creator hearts sends push notifications back to commenters. This action brings viewers back to your channel and boosts engagement signals.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center gap-3 text-xs font-semibold text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Pushes notifications to viewer notification inboxes</span>
            </div>
          </div>

          {/* Benefit Card 4 */}
          <div className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between">
            <div>
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-2">
                Spam and Trolling Shields
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                TubeFlow checks negative words, scam patterns, and duplicate comments. Your automations never trigger on trolls or send links to toxic remarks.
              </p>
            </div>
            <div className="mt-6 pt-6 border-t border-zinc-100 flex items-center gap-3 text-xs font-semibold text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Protect channel reputation and account safety</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 bg-zinc-50 border-t border-zinc-100 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold text-zinc-950 mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-zinc-600">
              Clear answers on YouTube API compliance, reply speeds, and account setup.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h3 className="font-heading font-semibold text-base text-zinc-950 mb-2">
                Does TubeFlow comply with YouTube terms of service?
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Yes. TubeFlow connects via official Google OAuth2 and uses the official YouTube Data API v3. Replies occur through authorized API scopes granted by channel owners.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h3 className="font-heading font-semibold text-base text-zinc-950 mb-2">
                How does TubeFlow prevent looking like a spam bot?
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                You configure Spintax variations so replies rotate naturally. You set custom keyword conditions, negative filters, and cooldown delays to prevent duplicate replies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h3 className="font-heading font-semibold text-base text-zinc-950 mb-2">
                Can I test rules before running them on live comments?
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Yes. The TubeFlow dashboard includes a Dry Run Simulator where you can test any sample comment text against your trigger rules before enabling live polling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING CTA SECTION */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center">
        <div className="relative rounded-3xl bg-zinc-950 text-white p-10 sm:p-16 overflow-hidden border border-zinc-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mb-6 shadow-lg shadow-red-600/30">
              <Video className="w-6 h-6 fill-white" />
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Turn YouTube comments into customers. On autopilot.
            </h2>

            <p className="text-base text-zinc-400 mb-8 max-w-xl">
              Connect your channel, define trigger keywords, and start routing viewer intent into tracked sales.
            </p>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-all shadow-xl shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Get Started with TubeFlow</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-zinc-500 mt-4">
              Sign in with your Google account • YouTube Data API authorized
            </p>
          </div>
        </div>
      </section>

      {/* SIMPLE FOOTER */}
      <footer className="border-t border-zinc-100 py-10 px-6 bg-white text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center">
              <Video className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-heading font-bold text-sm text-zinc-900">
              Tube<span className="text-red-600">Flow</span>
            </span>
            <span className="text-zinc-400 ml-2">
              © {new Date().getFullYear()} TubeFlow. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#demo" className="hover:text-zinc-900 transition-colors">
              Simulation Demo
            </a>
            <a href="#workflow" className="hover:text-zinc-900 transition-colors">
              Workflow
            </a>
            <a href="#benefits" className="hover:text-zinc-900 transition-colors">
              Benefits
            </a>
            <Link href="/login" className="hover:text-zinc-900 transition-colors">
              Dashboard Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
