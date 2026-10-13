"use client";

import { useState, useRef, MouseEvent } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  ChevronDown,
  Check,
  Users,
  ShieldCheck,
  Layers,
  Menu,
  X,
  Play,
  TrendingUp,
  Search,
  Filter,
  Ban,
  FileText,
  Sliders,
  Send,
  Clock,
  Smile,
  Bell,
  MoreVertical,
  ExternalLink,
} from "lucide-react";

/**
 * Footer social profiles.
 *
 * These used to be hardcoded to the platform homepages (youtube.com,
 * twitter.com, instagram.com, linkedin.com), so every visitor who clicked one
 * landed on someone else's front page. A brand profile URL is not derivable,
 * so it is configured instead of guessed: set the variable and the icon
 * appears; leave it unset and the icon is not rendered at all.
 */
function socialProfile(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return undefined;
  }
  // Anything other than http(s) in a footer link is a mistake, not a profile.
  return parsed.protocol === "http:" || parsed.protocol === "https:"
    ? parsed.toString()
    : undefined;
}

const SOCIAL_LINKS = [
  {
    label: "YouTube",
    href: socialProfile(process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE),
    hoverClass: "hover:text-red-500 transition-colors",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: socialProfile(process.env.NEXT_PUBLIC_SOCIAL_X),
    hoverClass: "hover:text-white transition-colors",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: socialProfile(process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM),
    hoverClass: "hover:text-pink-500 transition-colors",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-2.618 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: socialProfile(process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN),
    hoverClass: "hover:text-blue-500 transition-colors",
    icon: (
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
];


export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "replied" | "filtered">("all");
  const [automationActive, setAutomationActive] = useState(true);
  const [pricingPeriod, setPricingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // 3D tilt tracking for Hero Mockup
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Comments dataset for the dashboard mockup
  const comments = [
    {
      id: 1,
      author: "@TravelVibesIndia",
      time: "2 minutes ago",
      text: "Amazing video! Which camera do you use?",
      tags: ["camera", "gear"],
      status: "replied",
      statusLabel: "Replied",
      avatarBg: "bg-amber-600",
      avatarText: "T",
    },
    {
      id: 2,
      author: "@RohanTech",
      time: "5 minutes ago",
      text: "Is this good for beginners?",
      tags: ["beginner"],
      status: "pending",
      statusLabel: "Pending",
      avatarBg: "bg-blue-600",
      avatarText: "R",
    },
    {
      id: 3,
      author: "@CreativeGirl",
      time: "12 minutes ago",
      text: "Can you make a tutorial on this? ❤️",
      tags: ["tutorial"],
      status: "replied",
      statusLabel: "Replied",
      avatarBg: "bg-rose-500",
      avatarText: "C",
    },
    {
      id: 4,
      author: "@DesiExplorer",
      time: "18 minutes ago",
      text: "Link please 🙏",
      tags: ["link"],
      status: "replied",
      statusLabel: "Replied",
      avatarBg: "bg-purple-600",
      avatarText: "D",
    },
    {
      id: 5,
      author: "@FilmMakerPro",
      time: "25 minutes ago",
      text: "This is next level content! 🔥",
      tags: ["appreciation", "support"],
      status: "pending",
      statusLabel: "Pending",
      avatarBg: "bg-emerald-600",
      avatarText: "F",
    },
  ];

  const filteredComments =
    activeTab === "all"
      ? comments
      : activeTab === "pending"
      ? comments.filter((c) => c.status === "pending")
      : activeTab === "replied"
      ? comments.filter((c) => c.status === "replied")
      : [];

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-red-500 selection:text-white antialiased">
      {/* ========================================================= */}
      {/* 1. TOP NAVBAR (Dark themed as shown in reference)         */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 bg-[#070a12]/95 backdrop-blur-md border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 group-hover:scale-105 transition-transform"
              >
                <path
                  d="M4 8L16 2L28 8L28 24L16 30L4 24L4 8Z"
                  fill="url(#redBrandGrad)"
                />
                <path
                  d="M13 11L21 16L13 21V11Z"
                  fill="white"
                />
                <defs>
                  <linearGradient
                    id="redBrandGrad"
                    x1="4"
                    y1="2"
                    x2="28"
                    y2="30"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#EF4444" />
                    <stop offset="0.5" stopColor="#E11D48" />
                    <stop offset="1" stopColor="#F97316" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="font-heading font-extrabold text-xl tracking-tight text-white">
              Big<span className="text-red-500">Red</span>Hub
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
            <a
              href="#features"
              className="hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-white transition-colors"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </a>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex items-center gap-1 hover:text-white transition-colors focus:outline-none py-2 cursor-pointer"
              >
                <span>Resources</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    resourcesOpen ? "rotate-180 text-white" : "text-zinc-400"
                  }`}
                />
              </button>

              {resourcesOpen && (
                <div className="absolute top-full left-0 pt-1 w-56 z-50">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-2 text-xs">
                    <a
                      href="#action"
                      onClick={() => setResourcesOpen(false)}
                      className="block px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                    >
                      Demo Video & Tour
                    </a>
                    <a
                      href="#example-replies"
                      onClick={() => setResourcesOpen(false)}
                      className="block px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                    >
                      Creator Case Studies
                    </a>
                    <a
                      href="#pricing"
                      onClick={() => setResourcesOpen(false)}
                      className="block px-3 py-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors"
                    >
                      Channel ROI Calculator
                    </a>
                  </div>
                </div>
              )}
            </div>

<a
href="#example-replies"
className="hover:text-white transition-colors"
>
Example Replies
</a>
</nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-5">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Start free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 bg-[#070a12] px-4 pt-3 pb-6 space-y-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-200 hover:bg-zinc-800"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-200 hover:bg-zinc-800"
            >
              How it works
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-200 hover:bg-zinc-800"
            >
              Pricing
            </a>
<a
href="#example-replies"
onClick={() => setMobileMenuOpen(false)}
className="block px-3 py-2 rounded-lg text-base font-medium text-zinc-200 hover:bg-zinc-800"
>
Example Replies
</a>
            <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-zinc-200 font-medium hover:bg-zinc-800"
              >
                Sign in
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full text-white font-semibold bg-gradient-to-r from-red-600 to-rose-600 shadow-md shadow-red-600/30"
              >
                Start free ➔
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================= */}
      {/* 2. HERO SECTION (Dark theme with glowing ambient lights)  */}
      {/* ========================================================= */}
      <section className="relative bg-[#070a12] text-white pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Hero Column: Copy & CTAs */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Top Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-xs sm:text-sm text-zinc-300 shadow-inner mb-6 backdrop-blur-sm">
                <span className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                  <Play className="w-2.5 h-2.5 fill-white" />
                </span>
                <span className="font-medium text-white">YouTube Comment Automation</span>
                <span className="text-zinc-600">|</span>
                <span className="text-zinc-400">Save time. Grow faster.</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-heading font-extrabold tracking-tight text-white leading-[1.08] mb-6">
                Turn YouTube <br />
                Comments Into <br />
                <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
                  Real Conversations
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl mb-8 font-normal">
                Automate replies, engage your audience, and grow your channel with AI-powered, rule-based YouTube comment automation — while you stay in control.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 shadow-xl shadow-red-600/35 hover:scale-[1.03] active:scale-[0.98] transition-all"
                >
                  <span>Start free</span>
                  <ArrowRight className="w-4.5 h-4.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-medium text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800/90 border border-white/15 hover:border-white/30 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-zinc-200 text-zinc-200" />
                  <span>Watch demo</span>
                </button>
              </div>

              {/* Trust Checkmarks */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Official YouTube Data API</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Secure Google OAuth</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>No spam. You stay in control</span>
                </div>
              </div>
            </div>

            {/* Right Hero Column: 3D Isometric BigRedHub Dashboard Mockup */}
            <div className="lg:col-span-6 relative perspective-2000">
              {/* Floating 3D Red YouTube Icon */}
              <div className="absolute -top-7 right-14 z-30 animate-float pointer-events-none">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 shadow-xl shadow-red-600/50 flex items-center justify-center transform rotate-12 border border-red-400/40">
                  <Play className="w-7 h-7 fill-white text-white ml-0.5" />
                </div>
              </div>

              {/* Hand-drawn curved glow arrow */}
              <div className="absolute -top-3 right-36 z-20 hidden sm:block pointer-events-none">
                <svg width="70" height="50" viewBox="0 0 70 50" fill="none" className="text-red-500/80 stroke-current">
                  <path d="M10 40 C 25 15, 50 10, 65 30" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
                  <path d="M58 32 L65 30 L64 22" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Interactive 3D Perspective Card Container */}
              <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: isHovered
                    ? `perspective(2000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`
                    : "perspective(2000px) rotateY(-10deg) rotateX(6deg)",
                  transition: isHovered ? "transform 0.1s ease-out" : "transform 0.6s ease-in-out",
                }}
                className="relative bg-white rounded-2xl shadow-[0_30px_90px_rgba(0,0,0,0.6)] border border-zinc-200/90 overflow-hidden text-zinc-900 select-none"
              >
                {/* Dashboard Top Application Bar */}
                <div className="border-b border-zinc-200 bg-zinc-50/90 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-red-600 flex items-center justify-center text-white">
                      <Play className="w-2.5 h-2.5 fill-white" />
                    </div>
                    <span className="font-heading font-bold text-xs tracking-tight text-zinc-900">
                      Big<span className="text-red-600">Red</span>Hub
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-zinc-200 text-[11px] text-zinc-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-red-600" />
                      <span>My Channel</span>
                      <ChevronDown className="w-3 h-3 text-zinc-400" />
                    </div>
                    <button className="text-zinc-400 hover:text-zinc-600 p-1">
                      <Bell className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-6 h-6 rounded-full bg-zinc-800 text-white text-[10px] font-bold flex items-center justify-center">
                      G
                    </div>
                  </div>
                </div>

                {/* Dashboard Inner Layout */}
                <div className="grid grid-cols-12 min-h-[340px]">
                  {/* Left Sidebar */}
                  <div className="col-span-3 border-r border-zinc-200 bg-zinc-50/60 p-2.5 space-y-1 text-[11px] font-medium text-zinc-600">
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100">
                      <span>Dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-red-50 text-red-600 font-semibold">
                      <span>Comments</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100">
                      <span>Auto Reply</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100">
                      <span>Keyword Rules</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100">
                      <span>Templates</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100">
                      <span>Analytics</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100">
                      <span>Channels</span>
                    </div>
                    <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100">
                      <span>Settings</span>
                    </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="col-span-9 p-3.5 flex flex-col justify-between">
                    <div>
                      {/* Sub-header & Controls */}
                      <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 mb-2.5">
                        <div>
                          <h4 className="text-sm font-bold text-zinc-950">Comments</h4>
                          {/* Segmented Filter Pills */}
                          <div className="flex items-center gap-1 mt-1.5">
                            <button
                              onClick={() => setActiveTab("all")}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors ${
                                activeTab === "all"
                                  ? "bg-zinc-900 text-white"
                                  : "text-zinc-600 hover:bg-zinc-100"
                              }`}
                            >
                              All (348)
                            </button>
                            <button
                              onClick={() => setActiveTab("pending")}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors ${
                                activeTab === "pending"
                                  ? "bg-zinc-900 text-white"
                                  : "text-zinc-600 hover:bg-zinc-100"
                              }`}
                            >
                              Pending (59)
                            </button>
                            <button
                              onClick={() => setActiveTab("replied")}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors ${
                                activeTab === "replied"
                                  ? "bg-zinc-900 text-white"
                                  : "text-zinc-600 hover:bg-zinc-100"
                              }`}
                            >
                              Replied (289)
                            </button>
                            <button
                              onClick={() => setActiveTab("filtered")}
                              className={`px-2 py-0.5 rounded text-[10px] font-medium cursor-pointer transition-colors ${
                                activeTab === "filtered"
                                  ? "bg-zinc-900 text-white"
                                  : "text-zinc-600 hover:bg-zinc-100"
                              }`}
                            >
                              Filtered (12)
                            </button>
                          </div>
                        </div>

                        {/* Automation Toggle Switch */}
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] text-zinc-500 font-medium">Automation</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-zinc-600 font-semibold hidden sm:inline">
                              Auto replies active
                            </span>
                            <button
                              type="button"
                              onClick={() => setAutomationActive(!automationActive)}
                              className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                                automationActive ? "bg-emerald-500" : "bg-zinc-300"
                              }`}
                            >
                              <span
                                className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                                  automationActive ? "left-3.5" : "left-0.5"
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Search Bar Input */}
                      <div className="relative mb-2.5">
                        <Search className="w-3 h-3 text-zinc-400 absolute left-2.5 top-2" />
                        <input
                          type="text"
                          readOnly
                          value=""
                          placeholder="Search comments..."
                          className="w-full pl-7 pr-3 py-1 bg-zinc-50 border border-zinc-200 rounded-md text-[11px] text-zinc-800 placeholder-zinc-400 focus:outline-none"
                        />
                      </div>

                      {/* Comment Rows */}
                      <div className="space-y-1.5">
                        {filteredComments.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="p-2 rounded-lg border border-zinc-100 hover:border-zinc-200 bg-white hover:bg-zinc-50/60 transition-all flex items-start justify-between gap-2"
                          >
                            <div className="flex items-start gap-2">
                              <div
                                className={`w-5 h-5 rounded-full ${item.avatarBg} text-white font-bold text-[9px] flex items-center justify-center shrink-0 mt-0.5`}
                              >
                                {item.avatarText}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-[11px] text-zinc-900 leading-tight">
                                    {item.author}
                                  </span>
                                  <span className="text-[10px] text-zinc-400">• {item.time}</span>
                                </div>
                                <p className="text-[11px] text-zinc-700 leading-tight mt-0.5">
                                  {item.text}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  {item.tags.map((t) => (
                                    <span
                                      key={t}
                                      className="px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 text-[9px] font-medium"
                                    >
                                      {t}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0 flex items-center gap-1">
                              {item.status === "replied" ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[9px] font-semibold">
                                  <Check className="w-2.5 h-2.5" />
                                  Replied
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 text-[9px] font-semibold">
                                  <Clock className="w-2.5 h-2.5" />
                                  Pending
                                </span>
                              )}
                              <button className="text-zinc-300 hover:text-zinc-600">
                                <MoreVertical className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Metric Badge 1: 348 Total Comments (Top Overlap) */}
              <div className="absolute -top-4 -left-4 sm:-left-6 z-30 animate-float bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl p-2.5 shadow-2xl text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-extrabold text-base leading-none">348</span>
                    <span className="text-[10px] font-semibold text-emerald-400">↑ 12%</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">Total Comments</span>
                </div>
              </div>

              {/* Floating Metric Badge 2: 289 Replied (Middle Left Overlap) */}
              <div className="absolute top-1/2 -left-4 sm:-left-8 -translate-y-1/2 z-30 animate-float-reverse bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl p-2.5 shadow-2xl text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-extrabold text-base leading-none">289</span>
                    <span className="text-[10px] font-semibold text-emerald-400">↑ 70%</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">Replied</span>
                </div>
              </div>

              {/* Floating Metric Badge 3: 59 Pending (Bottom Right Overlap) */}
              <div className="absolute -bottom-4 right-6 z-30 animate-float bg-zinc-900/95 backdrop-blur-md border border-zinc-700/80 rounded-xl p-2.5 shadow-2xl text-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-heading font-extrabold text-base leading-none">59</span>
                  <span className="block text-[10px] text-zinc-400 font-medium">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. TRUST STRIP (4 White Highlight Cards)                  */}
      {/* ========================================================= */}
      <section className="relative z-20 -mt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          {/* Item 1: Official YouTube Data API */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Play className="w-5 h-5 fill-red-600 text-red-600 ml-0.5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-zinc-900 leading-tight">
                Official YouTube Data API
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">100% Compliant</p>
            </div>
          </div>

          {/* Item 2: Secure Google OAuth */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-zinc-900 leading-tight">
                Secure Google OAuth
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Your account stays safe</p>
            </div>
          </div>

          {/* Item 3: You Control Everything */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-zinc-900 leading-tight">
                You Control Everything
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">Set rules, filters and limits</p>
            </div>
          </div>

          {/* Item 4: was "Trusted by Creators" with no evidence behind it */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-zinc-900 leading-tight">
                Made for creators
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">You stay in control of every rule</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. HOW IT WORKS ("Get Started in 3 Simple Steps")         */}
      {/* ========================================================= */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase text-red-600 mb-2 block">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-zinc-950 tracking-tight">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base mt-3">
              Connect, set your rules, and let BigRedHub handle the rest.
            </p>
          </div>

          {/* 3 Step Cards Connected with Arrows */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-stretch">
            {/* Step 01 */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-7 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-heading font-black text-2xl text-red-600/90">01</span>
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <Play className="w-5 h-5 fill-red-600" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-lg text-zinc-950 mb-2">
                  Connect Your Channel
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                  Securely connect using Google OAuth. We only use official YouTube API.
                </p>
              </div>

              {/* Desktop arrow connector */}
              <div className="hidden md:block absolute -right-4.5 top-1/2 -translate-y-1/2 z-10 text-zinc-300">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* Step 02 */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-7 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-heading font-black text-2xl text-red-600/90">02</span>
                  <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                    <Sliders className="w-5 h-5 text-red-600" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-lg text-zinc-950 mb-2">
                  Set Your Rules
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                  Choose keywords, filters and reply templates. Use spintax for natural replies.
                </p>
              </div>

              {/* Desktop arrow connector */}
              <div className="hidden md:block absolute -right-4.5 top-1/2 -translate-y-1/2 z-10 text-zinc-300">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* Step 03 */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="font-heading font-black text-2xl text-red-600/90">03</span>
                  <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Send className="w-5 h-5 text-indigo-600 ml-0.5" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-lg text-zinc-950 mb-2">
                  Auto Reply & Grow
                </h3>
                <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                  We reply to matching comments automatically while you stay in control.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. POWERFUL FEATURES FOR YOUTUBE CREATORS (2x4 Grid)      */}
      {/* ========================================================= */}
      <section id="features" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with "View all features" pill button */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-zinc-950 tracking-tight">
                Powerful Features for YouTube Creators
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base mt-2">
                Everything you need to save time, increase engagement and grow your channel.
              </p>
            </div>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-300 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 font-medium text-xs sm:text-sm transition-colors self-start md:self-auto"
            >
              <span>View all features</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 8 Feature Cards Grid (4 columns x 2 rows) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1: Keyword Rules */}
            <div className="p-6 rounded-2xl border border-zinc-200/70 hover:border-red-200 bg-white hover:bg-red-50/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-zinc-950 mb-1.5">
                Keyword Rules
              </h4>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                Reply based on keywords, filters and custom conditions.
              </p>
            </div>

            {/* Feature 2: Spintax Templates */}
            <div className="p-6 rounded-2xl border border-zinc-200/70 hover:border-red-200 bg-white hover:bg-red-50/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-zinc-950 mb-1.5">
                Spintax Templates
              </h4>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                Create multiple variations to keep replies natural.
              </p>
            </div>

            {/* Feature 3: Negative Filters */}
            <div className="p-6 rounded-2xl border border-zinc-200/70 hover:border-red-200 bg-white hover:bg-red-50/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Ban className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-zinc-950 mb-1.5">
                Negative Filters
              </h4>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                Prevent unwanted or sensitive replies.
              </p>
            </div>

            {/* Feature 4: Multi-Channel Support */}
            <div className="p-6 rounded-2xl border border-zinc-200/70 hover:border-blue-200 bg-white hover:bg-blue-50/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-zinc-950 mb-1.5">
                Multi-Channel Support
              </h4>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                Manage multiple channels from one dashboard.
              </p>
            </div>

            {/* Feature 5: Analytics & Insights */}
            <div className="p-6 rounded-2xl border border-zinc-200/70 hover:border-emerald-200 bg-white hover:bg-emerald-50/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-zinc-950 mb-1.5">
                Analytics & Insights
              </h4>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                Track replies, engagement and keyword performance.
              </p>
            </div>

            {/* Feature 6: Human-Like Replies */}
            <div className="p-6 rounded-2xl border border-zinc-200/70 hover:border-sky-200 bg-white hover:bg-sky-50/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Smile className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-zinc-950 mb-1.5">
                Human-Like Replies
              </h4>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                Keep conversations natural and avoid looking like a bot.
              </p>
            </div>

            {/* Feature 7: Safe & Compliant */}
            <div className="p-6 rounded-2xl border border-zinc-200/70 hover:border-emerald-200 bg-white hover:bg-emerald-50/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-zinc-950 mb-1.5">
                Safe & Compliant
              </h4>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                Built on official YouTube API with transparent permissions.
              </p>
            </div>

            {/* Feature 8: Easy to Use */}
            <div className="p-6 rounded-2xl border border-zinc-200/70 hover:border-rose-200 bg-white hover:bg-rose-50/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-zinc-950 mb-1.5">
                Easy to Use
              </h4>
              <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
                Simple and clean interface designed for creators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. SEE BIGREDHUB IN ACTION (Composite Showcase Section)   */}
      {/* ========================================================= */}
      <section id="action" className="py-16 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-[#080d19] text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-zinc-800 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left 4 cols: Video Player Mockup with doodle note */}
            <div className="lg:col-span-4 relative group">
              <div
                onClick={() => setVideoModalOpen(true)}
                className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-900 border border-zinc-700/80 shadow-2xl cursor-pointer"
              >
                {/* Simulated creator video frame */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center relative">
                  {/* YouTube Brand badge */}
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-red-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                    <Play className="w-2.5 h-2.5 fill-white" />
                    <span>DEMO</span>
                  </div>

                  {/* Creator Photo Silhouette / Visual */}
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-zinc-400">
                    <Smile className="w-16 h-16 text-zinc-400" />
                  </div>

                  {/* Pulsing Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/50 group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 z-20">
                  <h4 className="font-heading font-bold text-sm text-white">
                    See BigRedHub in Action
                  </h4>
                </div>
              </div>

              {/* Hand-drawn doodle note: "Watch demo 2 min" */}
              <div className="absolute -bottom-6 left-12 flex items-center gap-2 pointer-events-none">
                <svg width="35" height="25" viewBox="0 0 35 25" fill="none" className="text-zinc-400 stroke-current transform rotate-12">
                  <path d="M5 20 C 12 10, 20 8, 30 15" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M25 8 L30 15 L22 17" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="font-mono text-xs text-zinc-400 italic">
                  Watch demo 2 min
                </span>
              </div>
            </div>

            {/* Middle 4 cols: Live YouTube Auto-Reply Simulation (White card) */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-4 sm:p-5 text-zinc-900 shadow-xl space-y-4">
              {/* Comment 1 */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                    T
                  </div>
                  <span className="font-semibold text-xs text-zinc-900">@TechLover</span>
                  <span className="text-[10px] text-zinc-400">2m ago</span>
                </div>
                <p className="text-xs text-zinc-800 pl-8">
                  Great video! Can you share the settings?
                </p>

                {/* Indented Auto-Reply Bubble */}
                <div className="ml-8 mt-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-3.5 h-3.5 rounded bg-red-600 flex items-center justify-center text-white">
                      <Play className="w-2 h-2 fill-white" />
                    </span>
                    <span className="font-bold text-[10px] text-red-600">Auto Reply (BigRedHub)</span>
                  </div>
                  <p className="text-[11px] text-zinc-800 leading-snug">
                    Thanks! I&apos;ll share a detailed tutorial soon. Stay tuned! 🚀
                  </p>
                </div>
              </div>

              {/* Comment 2 */}
              <div className="pt-2 border-t border-zinc-100">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                    A
                  </div>
                  <span className="font-semibold text-xs text-zinc-900">@AnkitSharma</span>
                  <span className="text-[10px] text-zinc-400">10m ago</span>
                </div>
                <p className="text-xs text-zinc-800 pl-8">
                  Which mic do you use?
                </p>

                {/* Indented Auto-Reply Bubble */}
                <div className="ml-8 mt-2 p-2.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-3.5 h-3.5 rounded bg-red-600 flex items-center justify-center text-white">
                      <Play className="w-2 h-2 fill-white" />
                    </span>
                    <span className="font-bold text-[10px] text-red-600">Auto Reply (BigRedHub)</span>
                  </div>
                  <p className="text-[11px] text-zinc-800 leading-snug">
                    I use the Rode NT-USB. It&apos;s great for beginners too! 🎙️
                  </p>
                </div>
              </div>
            </div>

            {/* Right 4 cols: Value Pitch & Growth Stats */}
            <div className="lg:col-span-4 flex flex-col justify-between h-full">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
                  <span>⚡ FOR CREATORS & TEAMS</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white leading-tight mb-4">
                  Save Time. Engage More. <br />
                  <span className="text-red-500">Grow Faster.</span>
                </h3>

                <ul className="space-y-2.5 text-xs sm:text-sm text-zinc-300 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Respond instantly to common questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Build a stronger community</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Increase watch time and engagement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span>Stay compliant with YouTube policies</span>
                  </li>
                </ul>

                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 transition-all text-sm mb-6"
                >
                  <span>Start free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Hand-drawn red arrow + ascending bar chart graphic */}
              <div className="relative pt-2 flex items-end justify-between border-t border-zinc-800/80">
                <div className="flex items-center gap-1.5 text-red-400 font-mono text-[11px] font-semibold italic">
                  <span>More engagement More growth!</span>
                  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" className="stroke-current">
                    <path d="M2 18 C 8 10, 16 12, 22 2" strokeWidth="2" strokeLinecap="round" />
                    <path d="M16 2 L22 2 L22 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* 3D red bar chart ascending graphic */}
                <div className="flex items-end gap-1.5 h-10">
                  <div className="w-2.5 h-3 bg-red-600/40 rounded-t" />
                  <div className="w-2.5 h-5 bg-red-600/60 rounded-t" />
                  <div className="w-2.5 h-7 bg-red-600/80 rounded-t" />
                  <div className="w-2.5 h-10 bg-gradient-to-t from-red-600 to-rose-500 rounded-t shadow-md shadow-red-600/40" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. EXAMPLE REPLIES (illustrative, not customer quotes)    */}
      {/* ========================================================= */}
      {/* This used to be a testimonials section under the heading
          "Loved by Creators" with the line "Join hundreds of creators".
          It carried three invented people - Tech With Rohan (120K
          subscribers), Travel Vibes India (80K) and Creative Girl (95K) -
          each with a five star row and a first person quote. No such
          creators exist; they were placeholder personas that shipped to
          production. Reframed as example replies so the cards do real work:
          they now show the comment-to-reply shape the product produces and
          claim nothing about who is using it. */}
      <section id="example-replies" className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-zinc-950 tracking-tight">
              What an Automated Reply Looks Like
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base mt-2">
              Example comments and the replies BigRedHub would post for them.
              Illustrative samples, not customer testimonials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Example 1 - price request */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    R
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-zinc-950">Example viewer</h4>
                    <p className="text-xs text-zinc-500">Comment on your Shorts</p>
                  </div>
                </div>

                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-3">
                  &quot;How much is this curtain set? Is it in stock?&quot;
                </p>

                <div className="border-l-2 border-red-500 pl-3">
                  <p className="text-zinc-900 text-xs sm:text-sm leading-relaxed">
                    &quot;Thanks for asking! It is in stock and the set ships
                    nationwide. Here is the full listing: {`{your tracked link}`}&quot;
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1.5">
                    Matched: price request &middot; Spintax variation
                  </p>
                </div>
              </div>
            </div>

            {/* Example 2 - explicit link request */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    T
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-zinc-950">Example viewer</h4>
                    <p className="text-xs text-zinc-500">Comment on your Shorts</p>
                  </div>
                </div>

                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-3">
                  &quot;link plz&quot;
                </p>

                <div className="border-l-2 border-red-500 pl-3">
                  <p className="text-zinc-900 text-xs sm:text-sm leading-relaxed">
                    &quot;Here you go: {`{your tracked link}`} &mdash; it tracks which
                    replies turn into visits.&quot;
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1.5">
                    Matched: link request &middot; Reply delay applied
                  </p>
                </div>
              </div>
            </div>

            {/* Example 3 - filtered out */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    C
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-sm text-zinc-950">Example viewer</h4>
                    <p className="text-xs text-zinc-500">Comment on your Shorts</p>
                  </div>
                </div>

                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed mb-3">
                  &quot;first!! love this&quot;
                </p>

                <div className="border-l-2 border-zinc-300 pl-3">
                  <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed italic">
                    No reply posted &mdash; the comment matched a negative keyword.
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1.5">
                    Matched: negative filter &middot; Silence is the point
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. SIMPLE & TRANSPARENT PRICING                           */}
      {/* ========================================================= */}
      <section id="pricing" className="py-20 lg:py-28 bg-zinc-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header & Monthly / Yearly Toggle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-zinc-950 tracking-tight">
                Simple & Transparent Pricing
              </h2>
              <p className="text-zinc-500 text-sm sm:text-base mt-2">
                Choose the plan that fits your channel.
              </p>
            </div>

            {/* Monthly / Yearly 20% off Toggle */}
            <div className="inline-flex items-center p-1 rounded-full bg-zinc-200/80 border border-zinc-300/80 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setPricingPeriod("monthly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  pricingPeriod === "monthly"
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setPricingPeriod("yearly")}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                  pricingPeriod === "yearly"
                    ? "bg-zinc-950 text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <span>Yearly</span>
                <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded-full">
                  20% off
                </span>
              </button>
            </div>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Plan 1: Free */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-7 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-zinc-950">Free</h3>
                <p className="text-xs text-zinc-500 mt-0.5 mb-5">For small creators</p>

                <div className="mb-6 flex items-baseline">
                  <span className="font-heading font-extrabold text-4xl text-zinc-950">₹0</span>
                  <span className="text-xs text-zinc-500 ml-1">/month</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-600 shrink-0" />
                    <span>100 replies/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-600 shrink-0" />
                    <span>1 channel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Basic features</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-xl border border-zinc-300 hover:border-zinc-400 font-semibold text-xs sm:text-sm text-zinc-800 hover:bg-zinc-50 transition-colors"
              >
                Get started
              </Link>
            </div>

            {/* Plan 2: Pro (Most popular highlighted) */}
            <div className="bg-white rounded-2xl border-2 border-red-500 p-7 shadow-xl shadow-red-500/10 flex flex-col justify-between relative">
              {/* Most Popular Badge */}
              <div className="absolute -top-3.5 right-6 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                Most popular
              </div>

              <div>
                <h3 className="font-heading font-bold text-lg text-zinc-950">Pro</h3>
                <p className="text-xs text-zinc-500 mt-0.5 mb-5">For growing creators</p>

                <div className="mb-6 flex items-baseline">
                  <span className="font-heading font-extrabold text-4xl text-zinc-950">
                    {pricingPeriod === "monthly" ? "₹499" : "₹399"}
                  </span>
                  <span className="text-xs text-zinc-500 ml-1">/month</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-medium text-zinc-900">5,000 replies/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-medium text-zinc-900">5 channels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="font-medium text-zinc-900">Advanced features</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 font-semibold text-xs sm:text-sm text-white shadow-lg shadow-red-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Start free
              </Link>
            </div>

            {/* Plan 3: Business */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-7 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-bold text-lg text-zinc-950">Business</h3>
                <p className="text-xs text-zinc-500 mt-0.5 mb-5">For large channels</p>

                <div className="mb-6 flex items-baseline">
                  <span className="font-heading font-extrabold text-4xl text-zinc-950">
                    {pricingPeriod === "monthly" ? "₹1,499" : "₹1,199"}
                  </span>
                  <span className="text-xs text-zinc-500 ml-1">/month</span>
                </div>

                <ul className="space-y-3 text-xs sm:text-sm text-zinc-600 mb-8">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-600 shrink-0" />
                    <span>20,000 replies/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-600 shrink-0" />
                    <span>10 channels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-xl border border-zinc-300 hover:border-zinc-400 font-semibold text-xs sm:text-sm text-zinc-800 hover:bg-zinc-50 transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. FOOTER (Dark theme as shown in reference)              */}
      {/* ========================================================= */}
      <footer className="bg-[#070a12] text-zinc-400 border-t border-zinc-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Col 1: Brand & Tagline */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 flex items-center justify-center">
                  <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                    <path
                      d="M4 8L16 2L28 8L28 24L16 30L4 24L4 8Z"
                      fill="url(#redFootGrad)"
                    />
                    <path d="M13 11L21 16L13 21V11Z" fill="white" />
                    <defs>
                      <linearGradient
                        id="redFootGrad"
                        x1="4"
                        y1="2"
                        x2="28"
                        y2="30"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#EF4444" />
                        <stop offset="1" stopColor="#E11D48" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="font-heading font-extrabold text-lg tracking-tight text-white">
                  Big<span className="text-red-500">Red</span>Hub
                </span>
              </Link>
              <p className="text-xs text-zinc-400 font-medium">
                Automate. Engage. Grow. 🚀
              </p>
            </div>

            {/* Col 2: Product */}
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-zinc-200 mb-3">
                Product
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-white transition-colors">
                    How it works
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Resources */}
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-zinc-200 mb-3">
                Resources
              </h5>
<ul className="space-y-2 text-xs">
<li>
<a href="#action" className="hover:text-white transition-colors">
Product Tour
</a>
</li>
<li>
<a href="#how-it-works" className="hover:text-white transition-colors">
YouTube Guide
</a>
</li>
</ul>
            </div>

            {/* Col 4: Company */}
            <div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-zinc-200 mb-3">
                Company
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#example-replies" className="hover:text-white transition-colors">
                    Example Replies
                  </a>
                </li>
<li>
<a href="/privacy" className="hover:text-white transition-colors">
Privacy Policy
</a>
</li>
<li>
<a href="/terms" className="hover:text-white transition-colors">
Terms of Service
</a>
</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Social Media Icons */}
          <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <p className="text-zinc-500">
              © {new Date().getFullYear()} BigRedHub. Built for YouTube creators.
            </p>

            {/* Social Icons (YouTube, X/Twitter, Instagram, LinkedIn) */}
            {SOCIAL_LINKS.some((s) => s.href) && (
              <div className="flex items-center gap-4 text-zinc-400">
                {SOCIAL_LINKS.filter((s) => s.href).map((social) => (
                  <a
                    key={social.label}
                    href={social.href!}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className={social.hoverClass}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* 10. INTERACTIVE VIDEO DEMO MODAL                          */}
      {/* ========================================================= */}
      {videoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="relative bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                <h3 className="font-heading font-bold text-lg text-white">
                  BigRedHub Product Walkthrough
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setVideoModalOpen(false)}
                className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Interactive Mockup */}
            <div className="aspect-video bg-zinc-900 rounded-2xl border border-zinc-800 p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-mono">YouTube API v3 Status: Connected</span>
                <span className="text-emerald-400 font-semibold">● 100% Automated</span>
              </div>

              <div className="space-y-3 max-w-lg mx-auto w-full my-auto">
                <div className="p-3 bg-zinc-800/90 rounded-xl border border-zinc-700">
                  <p className="text-xs text-zinc-300">
                    Viewer: <span className="text-white font-medium">&quot;Where did you buy that microphone?&quot;</span>
                  </p>
                </div>
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl ml-4">
                  <p className="text-xs text-red-200">
                    Auto-Replied in 1.2s:{" "}
                    <span className="text-white font-medium">
                      &quot;Hey! I use the Rode NT-USB. Check the gear link in my description! 🎙️&quot;
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-800 text-xs">
                <span className="text-zinc-500">BigRedHub Engine: Active</span>
                <Link
                  href="/login"
                  onClick={() => setVideoModalOpen(false)}
                  className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 font-semibold text-white shadow-md shadow-red-600/30 transition-all"
                >
                  Start free trial ➔
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
