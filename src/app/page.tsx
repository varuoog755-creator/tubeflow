"use client";

import { useState, useRef, MouseEvent } from "react";
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
  ChevronRight,
  ChevronDown,
  Check,
  ShoppingCart,
  Users,
  Briefcase,
  ShieldCheck,
  MousePointerClick,
  Layers,
  Menu,
  X,
  Monitor,
  Tag,
  Bot,
  ScrollText,
  Smartphone,
  ShieldAlert,
  MessageSquare,
  Activity,
  Sliders,
  Play,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Mail,
  Send,
  UserCheck,
  TrendingUp,
  Clock,
  Sparkle,
  Radio,
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
    trackedUrl: "BigRedHub.in/gear-setup",
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
    trackedUrl: "BigRedHub.in/edit-cohort",
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
    replyText: "Hey Rohan! Code BigRedHub saves 20% right now:",
    trackedUrl: "BigRedHub.in/save20",
    latency: "1.1s",
    revenue: "₹1,200 Sale",
    conversionTime: "2 mins later",
  },
];

export default function Home() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>("gear");
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [solutionsOpen, setSolutionsOpen] = useState<boolean>(false);
  const [functionsOpen, setFunctionsOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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
      <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-zinc-950">
              BigRed<span className="text-red-600">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-sm font-medium text-zinc-600">
            {/* 1. FUNCTIONS DROPDOWN */}
            <div
              className="relative py-2"
              onMouseEnter={() => {
                setFunctionsOpen(true);
                setSolutionsOpen(false);
              }}
              onMouseLeave={() => setFunctionsOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setFunctionsOpen((prev) => !prev);
                  setSolutionsOpen(false);
                }}
                className="flex items-center gap-1 hover:text-zinc-950 transition-colors py-1 focus:outline-none cursor-pointer"
              >
                <span>Functions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    functionsOpen ? "rotate-180 text-zinc-950" : "text-zinc-400"
                  }`}
                />
              </button>

              {/* Mega-menu dropdown for 8 core product functions */}
              {functionsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="w-[660px] bg-white rounded-2xl border border-zinc-200 shadow-2xl p-5 grid grid-cols-2 gap-4">
                    {/* Item 1: Central Dashboard */}
                    <a
                      href="#functions-dashboard"
                      onClick={() => setFunctionsOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Monitor className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                          Central Dashboard
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                          Manage all YouTube comments in one centralized three-panel inbox.
                        </p>
                      </div>
                    </a>

                    {/* Item 2: DM & Comment Funnels */}
                    <a
                      href="#functions-funnels"
                      onClick={() => setFunctionsOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                          Comment Lead Funnels
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                          Turn comments and trigger keywords into tracked checkout links.
                        </p>
                      </div>
                    </a>

                    {/* Item 3: Intelligent Intent Tagging */}
                    <a
                      href="#functions-tagging"
                      onClick={() => setFunctionsOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                          Intelligent Intent Tagging
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                          Automated AI classification of buyer intent and price queries.
                        </p>
                      </div>
                    </a>

                    {/* Item 4: AI-Powered Answers */}
                    <a
                      href="#functions-answers"
                      onClick={() => setFunctionsOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                          AI-Powered Answers
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                          Brand-compliant answers with 1-click or autopilot Spintax.
                        </p>
                      </div>
                    </a>

                    {/* Item 5: Activity Logs */}
                    <a
                      href="#functions-logs"
                      onClick={() => setFunctionsOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <ScrollText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                          Activity Logs & Traces
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                          Track delivery status, YouTube comment IDs, and click attribution.
                        </p>
                      </div>
                    </a>

                    {/* Item 6: Custom Automations */}
                    <a
                      href="#functions-automations"
                      onClick={() => setFunctionsOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                          Custom Automations
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                          Create rule-based workflows with ANY/ALL keyword matching.
                        </p>
                      </div>
                    </a>

                    {/* Item 7: Mobile Web App */}
                    <a
                      href="#functions-mobile"
                      onClick={() => setFunctionsOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                          Mobile Responsive App
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                          Triage comments and review automations seamlessly on the go.
                        </p>
                      </div>
                    </a>

                    {/* Item 8: Automatic Spam Hiding */}
                    <a
                      href="#functions-spam-shield"
                      onClick={() => setFunctionsOpen(false)}
                      className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                        <ShieldAlert className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                          Automatic Spam Shields
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                          Filter phishing bots, crypto scams, and toxic remarks automatically.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* 2. SOLUTIONS DROPDOWN */}
            <div
              className="relative py-2"
              onMouseEnter={() => {
                setSolutionsOpen(true);
                setFunctionsOpen(false);
              }}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setSolutionsOpen((prev) => !prev);
                  setFunctionsOpen(false);
                }}
                className="flex items-center gap-1 hover:text-zinc-950 transition-colors py-1 focus:outline-none cursor-pointer"
              >
                <span>Solutions</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    solutionsOpen ? "rotate-180 text-zinc-950" : "text-zinc-400"
                  }`}
                />
              </button>

              {/* Mega-menu dropdown for Solutions */}
              {solutionsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50">
                  <div className="w-[620px] bg-white rounded-2xl border border-zinc-200 shadow-2xl p-5 grid grid-cols-2 gap-5 animate-in fade-in zoom-in-95 duration-150">
                    {/* Column 1: Industries */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pb-2 mb-2 border-b border-zinc-100 flex items-center gap-1.5">
                        <Layers className="w-3 h-3 text-red-600" />
                        <span>Industries</span>
                      </div>
                      <div className="space-y-1">
                        <a
                          href="#solutions-ecommerce"
                          onClick={() => setSolutionsOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <ShoppingCart className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                              For E-Commerce & D2C
                            </p>
                            <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                              Protect your brand and increase ROAS on YouTube traffic.
                            </p>
                          </div>
                        </a>

                        <a
                          href="#solutions-creators"
                          onClick={() => setSolutionsOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                              For Creators & Influencers
                            </p>
                            <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                              Community growth and monetized interaction on autopilot.
                            </p>
                          </div>
                        </a>

                        <a
                          href="#solutions-agencies"
                          onClick={() => setSolutionsOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <Briefcase className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                              For Marketing Agencies
                            </p>
                            <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                              Deliver 24/7 comment response coverage for client channels.
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>

                    {/* Column 2: Use Cases */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pb-2 mb-2 border-b border-zinc-100 flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-red-600" />
                        <span>Use Cases</span>
                      </div>
                      <div className="space-y-1">
                        <a
                          href="#usecases-moderation"
                          onClick={() => setSolutionsOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <ShieldCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                              Filter Negative & Spam
                            </p>
                            <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                              Protect your customers and brand reputation from scams.
                            </p>
                          </div>
                        </a>

                        <a
                          href="#usecases-replies"
                          onClick={() => setSolutionsOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <MousePointerClick className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                              1-Click Smart Replies
                            </p>
                            <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                              Save 80% of time spent answering repetitive questions.
                            </p>
                          </div>
                        </a>

                        <a
                          href="#usecases-funnels"
                          onClick={() => setSolutionsOpen(false)}
                          className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-zinc-50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                            <Target className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-zinc-950 group-hover:text-red-600 transition-colors">
                              Comment Lead Funnels
                            </p>
                            <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">
                              Turn viewer comments into automated conversion funnels.
                            </p>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <a href="#features" className="hover:text-zinc-950 transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-zinc-950 transition-colors font-medium">
              How it Works
            </a>
            <a href="#use-cases" className="hover:text-zinc-950 transition-colors font-medium">
              Use Cases
            </a>
            <a href="#pricing" className="hover:text-zinc-950 transition-colors font-medium">
              Pricing
            </a>
            <a href="#faq" className="hover:text-zinc-950 transition-colors font-medium">
              FAQ
            </a>
          </nav>

          {/* Action buttons + Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-full transition-all shadow-xs"
            >
              Login
            </Link>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white px-5 py-2.5 rounded-full transition-all shadow-md shadow-indigo-600/25 flex items-center gap-1.5 group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-xl border border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50 transition-colors ml-1 cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-zinc-900" />
              ) : (
                <Menu className="w-5 h-5 text-zinc-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 bg-white px-5 py-4 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto">
            {/* Functions Group */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block px-1 mb-1">
                Core Functions
              </span>
              <a
                href="#functions-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <Monitor className="w-4 h-4 text-red-600 shrink-0" />
                <span>Central Dashboard</span>
              </a>
              <a
                href="#functions-funnels"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <MessageSquare className="w-4 h-4 text-red-600 shrink-0" />
                <span>Comment Lead Funnels</span>
              </a>
              <a
                href="#functions-tagging"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <Tag className="w-4 h-4 text-red-600 shrink-0" />
                <span>Intelligent Intent Tagging</span>
              </a>
              <a
                href="#functions-answers"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <Bot className="w-4 h-4 text-red-600 shrink-0" />
                <span>AI-Powered Answers</span>
              </a>
              <a
                href="#functions-logs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <ScrollText className="w-4 h-4 text-red-600 shrink-0" />
                <span>Activity Logs & Attribution</span>
              </a>
              <a
                href="#functions-automations"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <Zap className="w-4 h-4 text-red-600 shrink-0" />
                <span>Custom Automations</span>
              </a>
              <a
                href="#functions-mobile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <Smartphone className="w-4 h-4 text-red-600 shrink-0" />
                <span>Mobile Web App</span>
              </a>
              <a
                href="#functions-spam-shield"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>Automatic Spam Shields</span>
              </a>
            </div>

            {/* Industries Group */}
            <div className="space-y-1 pt-2 border-t border-zinc-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block px-1 mb-1">
                Industries
              </span>
              <a
                href="#solutions-ecommerce"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <ShoppingCart className="w-4 h-4 text-red-600 shrink-0" />
                <span>For E-Commerce & D2C</span>
              </a>
              <a
                href="#solutions-creators"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <Users className="w-4 h-4 text-red-600 shrink-0" />
                <span>For Creators & Influencers</span>
              </a>
              <a
                href="#solutions-agencies"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                <Briefcase className="w-4 h-4 text-red-600 shrink-0" />
                <span>For Marketing Agencies</span>
              </a>
            </div>

            {/* Direct Login Links */}
            <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
              >
                Sign In to Dashboard
              </Link>
              <Link
                href="/login"
                className="w-full text-center py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold shadow-md shadow-red-600/20"
              >
                Connect YouTube Channel
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION — EXACT DESIGN MATCH */}
      <section className="relative px-4 sm:px-6 pt-12 pb-16 md:pt-16 md:pb-24 max-w-7xl mx-auto overflow-hidden">
        {/* Soft background radial glows */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-purple-200/30 via-pink-200/25 to-orange-100/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines, Bullet checks & CTAs */}
          <div className="lg:col-span-5 flex flex-col items-start text-left z-10">
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-100 text-pink-700 text-xs font-semibold mb-6 shadow-xs">
              <span className="text-sm">🚀</span>
              <span>Turn YouTube Comments into Customers</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.4rem] font-black tracking-tight text-zinc-950 leading-[1.08] mb-6">
              Convert YouTube Comments into{" "}
              <span className="relative inline-block mt-1">
                <span className="bg-gradient-to-r from-indigo-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                  Leads &amp; Sales
                </span>
                {/* Hand-drawn style decorative underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-orange-400 overflow-visible"
                  viewBox="0 0 250 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8.5C65 2.5 185 2 247 9.5"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-zinc-600 leading-relaxed mb-6 max-w-lg font-normal">
              Automatically detect interested comments, reply with auto DM or pinned message, and turn viewers into real customers — on autopilot.
            </p>

            {/* 3 Inline Check Features */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 text-xs sm:text-sm font-semibold text-zinc-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />
                <span>AI detects intent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />
                <span>Auto reply &amp; DM</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 fill-blue-50" />
                <span>More leads &amp; sales</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto mb-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#demo"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-900 font-bold text-sm shadow-sm transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-white text-white ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </a>
            </div>

            {/* Micro assurance copy */}
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 pl-1">
              <span>No credit card required</span>
              <span className="text-zinc-600">•</span>
              <span>Setup in 2 minutes</span>
            </div>
          </div>

          {/* Right Column: Visual Composite (YouTube Card + Flow Engine) */}
          <div className="lg:col-span-7 relative flex items-center justify-center pt-6 lg:pt-0">
            {/* Doodle Note 1: Real Comments */}
            <div className="absolute -top-4 left-6 sm:left-14 z-20 hidden sm:flex items-start gap-1">
              <div className="text-pink-600 font-cursive text-sm sm:text-base font-bold -rotate-6 tracking-wide">
                Real Comments
              </div>
              <svg className="w-6 h-6 text-pink-500 -rotate-12 mt-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4c4 10 12 12 16 14m0 0l-5-1m5 1l-1-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Doodle Note 2: Automate your growth! */}
            <div className="absolute -top-6 right-4 sm:right-10 z-20 hidden sm:flex flex-col items-center">
              <div className="text-indigo-600 font-cursive text-sm sm:text-base font-bold rotate-6 tracking-wide text-center">
                Automate<br />your growth!
              </div>
              <svg className="w-6 h-7 text-indigo-500 rotate-12 mt-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3c2 9 8 13 12 15m0 0l-5-1m5 1l-1-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="relative w-full max-w-2xl flex flex-col md:flex-row items-center gap-4 lg:gap-6">
              {/* Tilted Center YouTube Card */}
              <div className="w-full md:w-[62%] bg-white rounded-3xl border border-zinc-200/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.12)] p-4 sm:p-5 transform -rotate-1 hover:rotate-0 transition-transform duration-300 z-10">
                {/* Embedded Video Mockup */}
                <div className="relative rounded-2xl overflow-hidden bg-zinc-950 aspect-[16/10] shadow-inner group">
                  {/* Video Background Image (Creator pointing at product) */}
                  <div
                    className="absolute inset-0 bg-cover bg-center brightness-95"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80')",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* YouTube Red Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/50 group-hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    </div>
                  </div>

                  {/* YouTube Player Controls Bar */}
                  <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <Play className="w-3 h-3 fill-white" />
                      <span>0:10 / 3:24</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-80">
                      <span className="text-[10px] font-bold border border-white/60 px-1 rounded">CC</span>
                      <Sliders className="w-3 h-3" />
                      <div className="w-3 h-3 border border-white/80 rounded-xs" />
                    </div>
                  </div>
                </div>

                {/* Comments Header */}
                <div className="flex items-center justify-between mt-4 pb-2 border-b border-zinc-100">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-zinc-900">Comments</span>
                    <span className="text-xs font-semibold text-zinc-400">842</span>
                  </div>
                  <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                </div>

                {/* Live Comments Stream */}
                <div className="mt-3 space-y-3.5">
                  {/* Comment 1 */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full bg-cover bg-center shrink-0 border border-zinc-200"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80')",
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900">Priya Sharma</span>
                        <span className="text-[10px] text-zinc-400">2 hours ago</span>
                      </div>
                      <p className="text-xs text-zinc-800 font-medium mt-0.5">Price kya hai? 😍</p>
                      <div className="flex items-center gap-3 text-zinc-400 text-[11px] mt-1.5">
                        <ThumbsUp className="w-3 h-3 hover:text-zinc-600 cursor-pointer" />
                        <ThumbsDown className="w-3 h-3 hover:text-zinc-600 cursor-pointer" />
                        <span className="hover:text-zinc-600 cursor-pointer font-semibold text-[10px]">Reply</span>
                      </div>
                    </div>
                  </div>

                  {/* Comment 2 */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full bg-cover bg-center shrink-0 border border-zinc-200"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80')",
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900">Rohit Verma</span>
                        <span className="text-[10px] text-zinc-400">4 hours ago</span>
                      </div>
                      <p className="text-xs text-zinc-800 font-medium mt-0.5">Link please 🙏</p>
                      <div className="flex items-center gap-3 text-zinc-400 text-[11px] mt-1.5">
                        <ThumbsUp className="w-3 h-3 hover:text-zinc-600 cursor-pointer" />
                        <ThumbsDown className="w-3 h-3 hover:text-zinc-600 cursor-pointer" />
                        <span className="hover:text-zinc-600 cursor-pointer font-semibold text-[10px]">Reply</span>
                      </div>
                    </div>
                  </div>

                  {/* Comment 3 */}
                  <div className="flex items-start gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full bg-cover bg-center shrink-0 border border-zinc-200"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80')",
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900">Neha Singh</span>
                        <span className="text-[10px] text-zinc-400">6 hours ago</span>
                      </div>
                      <p className="text-xs text-zinc-800 font-medium mt-0.5">Is this available on Amazon?</p>
                      <div className="flex items-center gap-3 text-zinc-400 text-[11px] mt-1.5">
                        <ThumbsUp className="w-3 h-3 hover:text-zinc-600 cursor-pointer" />
                        <ThumbsDown className="w-3 h-3 hover:text-zinc-600 cursor-pointer" />
                        <span className="hover:text-zinc-600 cursor-pointer font-semibold text-[10px]">Reply</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side Automation Flow Stack */}
              <div className="w-full md:w-[38%] flex flex-col gap-2.5 z-10">
                {/* AI Detection Banner */}
                <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/30">
                  <Bot className="w-4 h-4 text-purple-200" />
                  <span>AI Detects Interest</span>
                </div>

                {/* Step 1: Auto Reply */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-md p-3 flex items-center gap-3 hover:border-blue-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-5 h-5 fill-white text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-950">Auto Reply</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">Send intelligent reply</p>
                  </div>
                </div>

                {/* Step 2: Send DM */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-md p-3 flex items-center gap-3 hover:border-pink-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Send className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-950">Send DM</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">Share product link</p>
                  </div>
                </div>

                {/* Step 3: Capture Lead */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-md p-3 flex items-center gap-3 hover:border-blue-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-950">Capture Lead</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">Save to dashboard</p>
                  </div>
                </div>

                {/* Step 4: More Sales */}
                <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 shadow-md p-3 flex items-center gap-3 hover:border-emerald-300 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-zinc-950">More Sales</h4>
                    <p className="text-[11px] text-zinc-500 font-medium">Grow your business</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM FEATURE BAR (5 Rounded Capability Cards from mockup) */}
        <div className="mt-14 sm:mt-16 bg-white/90 backdrop-blur-md rounded-3xl border border-zinc-200/80 shadow-lg p-5 sm:p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {/* Item 1: AI-Powered */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 fill-pink-600 text-pink-600" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-zinc-950">AI-Powered</h4>
              <p className="text-[11px] text-zinc-500 font-normal leading-snug mt-0.5">
                Understands intent using advanced AI
              </p>
            </div>
          </div>

          {/* Item 2: Multiple Actions */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-zinc-950">Multiple Actions</h4>
              <p className="text-[11px] text-zinc-500 font-normal leading-snug mt-0.5">
                Reply, DM, Pin, or Add to CRM
              </p>
            </div>
          </div>

          {/* Item 3: Works with Any Channel */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-zinc-950">Works with Any Channel</h4>
              <p className="text-[11px] text-zinc-500 font-normal leading-snug mt-0.5">
                Your YouTube channel or client channels
              </p>
            </div>
          </div>

          {/* Item 4: Saves Time */}
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-zinc-950">Saves Time</h4>
              <p className="text-[11px] text-zinc-500 font-normal leading-snug mt-0.5">
                100x faster than manual work
              </p>
            </div>
          </div>

          {/* Item 5: Boosts Revenue */}
          <div className="flex items-start gap-3 col-span-2 md:col-span-1">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-zinc-950">Boosts Revenue</h4>
              <p className="text-[11px] text-zinc-500 font-normal leading-snug mt-0.5">
                Turn engagement into real sales
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: 8 CORE FUNCTIONS */}
      <section id="functions" className="py-20 bg-white border-t border-zinc-100 px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 bg-zinc-50 text-zinc-700 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-red-600" />
              <span>Core Platform Functions</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
              Everything Needed to Monetize YouTube Comments
            </h2>
            <p className="text-base text-zinc-600">
              Eight powerful modules designed to manage, filter, automate, and attribute viewer conversations at scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Function 1: Central Dashboard */}
            <div
              id="functions-dashboard"
              className="p-6 rounded-3xl border border-zinc-200/90 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <Monitor className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-zinc-950 mb-2">
                  Central Dashboard
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Manage all YouTube comments in one place. Three-panel inbox with saved views, instant search, and real-time reply workspace.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 pt-2 border-t border-zinc-100"
              >
                <span>Launch Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Function 2: DM & Comment Funnels */}
            <div
              id="functions-funnels"
              className="p-6 rounded-3xl border border-zinc-200/90 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-zinc-950 mb-2">
                  Comment Lead Funnels
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Turn viewer comments and keywords into attributed leads and orders. Delivers unique shortlinks like ManyChat for YouTube.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 pt-2 border-t border-zinc-100"
              >
                <span>Setup Tracked Links</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Function 3: Intelligent Tagging */}
            <div
              id="functions-tagging"
              className="p-6 rounded-3xl border border-zinc-200/90 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <Tag className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-zinc-950 mb-2">
                  Intelligent Intent Tagging
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Automatic AI classification of comments. Tags Buying Intent, Price Inquiries, and Link Requests with confidence scores.
                </p>
              </div>
              <a
                href="#demo"
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 pt-2 border-t border-zinc-100"
              >
                <span>Test Classification</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Function 4: AI-Powered Answers */}
            <div
              id="functions-answers"
              className="p-6 rounded-3xl border border-zinc-200/90 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-zinc-950 mb-2">
                  AI-Powered Answers
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Brand-compliant answers with just one click. Natural Spintax message rotation prevents duplicate bot detection.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 pt-2 border-t border-zinc-100"
              >
                <span>Configure Templates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Function 5: Activity Logs */}
            <div
              id="functions-logs"
              className="p-6 rounded-3xl border border-zinc-200/90 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <ScrollText className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-zinc-950 mb-2">
                  Activity Logs & Traces
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Audit trail of all comment activity. View real YouTube comment reply IDs, delivery timestamps, and API status codes.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 pt-2 border-t border-zinc-100"
              >
                <span>View Activity Feed</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Function 6: Custom Automations */}
            <div
              id="functions-automations"
              className="p-6 rounded-3xl border border-zinc-200/90 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-zinc-950 mb-2">
                  Custom Automations
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Create rule-based workflows with ANY or ALL keyword matching, negative exclusion lists, and custom response cooldowns.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 pt-2 border-t border-zinc-100"
              >
                <span>Create Rules</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Function 7: Mobile Web App */}
            <div
              id="functions-mobile"
              className="p-6 rounded-3xl border border-zinc-200/90 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-zinc-950 mb-2">
                  Mobile Responsive App
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Reply to viewer inquiries on the go. Complete lightweight web app accessible from phones, tablets, and desktop workstations.
                </p>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 pt-2 border-t border-zinc-100"
              >
                <span>Open Mobile App</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Function 8: Automatic Spam Shields */}
            <div
              id="functions-spam-shield"
              className="p-6 rounded-3xl border border-zinc-200/90 bg-white shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-zinc-950 mb-2">
                  Automatic Spam Shields
                </h3>
                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  No bots, no nonsense. Automatically filter phishing, WhatsApp contact scams, and hate comments without sending replies.
                </p>
              </div>
              <a
                href="#benefits"
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 pt-2 border-t border-zinc-100"
              >
                <span>View Security Specs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: INDUSTRIES (SOLUTIONS) */}
      <section id="industries" className="py-20 bg-zinc-50/60 border-t border-zinc-100 px-6 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold mb-3">
              <Layers className="w-3.5 h-3.5 text-red-600" />
              <span>Industries</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
              Tailored Solutions for Every Growth Model
            </h2>
            <p className="text-base text-zinc-600">
              BigRedHub replaces manual typing with intelligent comment response pipelines adapted to your specific business model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Industry 1: E-commerce */}
            <div
              id="solutions-ecommerce"
              className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-zinc-950 mb-2">
                  For E-Commerce & D2C Brands
                </h3>
                <p className="text-sm font-semibold text-red-600 mb-3">
                  Protect your brand and increase ROAS
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Viewers asking &quot;where to buy&quot; or &quot;price&quot; on your YouTube product videos are ready to buy. BigRedHub auto-replies with direct product links in under 2 seconds, preventing lost sales and lifting paid ad ROAS.
                </p>

                <ul className="space-y-2 text-xs text-zinc-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Auto-deliver tracked checkout and cart links</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Attribute real sales revenue to specific videos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Block scam bots targeting your customers</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                <span>Deploy for E-Commerce</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>

            {/* Industry 2: Creators & Influencers */}
            <div
              id="solutions-creators"
              className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-zinc-950 mb-2">
                  For Creators & Influencers
                </h3>
                <p className="text-sm font-semibold text-red-600 mb-3">
                  Community growth and monetized interactions
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Stop copy-pasting gear links, course discounts, or newsletter invitations 500 times per upload. BigRedHub gives automatic creator hearts and delivers your links without burnout.
                </p>

                <ul className="space-y-2 text-xs text-zinc-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Deliver affiliate gear and sponsor links</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Auto-heart to send phone notifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Spintax natural response rotation</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                <span>Deploy for Creators</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>

            {/* Industry 3: Agencies */}
            <div
              id="solutions-agencies"
              className="bg-white rounded-3xl p-8 border border-zinc-200/90 shadow-xs hover:border-zinc-300 hover:shadow-md transition-all flex flex-col justify-between scroll-mt-24"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="font-heading text-xl font-bold text-zinc-950 mb-2">
                  For Marketing Agencies
                </h3>
                <p className="text-sm font-semibold text-red-600 mb-3">
                  Deliver full-coverage response systems for clients
                </p>
                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Manage YouTube comment pipelines for multiple client brands under one dashboard. Guarantee response coverage and prove attribution return with verified client conversion reporting.
                </p>

                <ul className="space-y-2 text-xs text-zinc-700 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Multi-tenant channel workspace management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Auditable client conversion reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>Brand voice customization per channel</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-900 hover:bg-zinc-50 transition-colors"
              >
                <span>Deploy for Agencies</span>
                <ChevronRight className="w-4 h-4 text-zinc-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION: USE CASES */}
      <section id="use-cases" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5 text-red-600" />
            <span>Use Cases</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
            Proven Automation Capabilities
          </h2>
          <p className="text-base text-zinc-600">
            Engineered around YouTube algorithms and viewer behavior to maximize customer conversion and audience retention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Use Case 1: Hide Negative & Spam */}
          <div
            id="usecases-moderation"
            className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between scroll-mt-24"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-2">
                Filter Negative & Spam Comments
              </h3>
              <p className="text-sm font-semibold text-zinc-800 mb-3">
                Protect your customers and brand reputation
              </p>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Crypto bots, WhatsApp scams, and malicious links erode trust. BigRedHub identifies spam patterns and negative comments, withholding replies so toxic remarks never receive links or creator hearts.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-semibold text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Zero links dispatched to toxic comments</span>
            </div>
          </div>

          {/* Use Case 2: 1-Click Smart Replies */}
          <div
            id="usecases-replies"
            className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between scroll-mt-24"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-2">
                1-Click Smart Replies
              </h3>
              <p className="text-sm font-semibold text-zinc-800 mb-3">
                Save 80% of time spent answering comments
              </p>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Manage all incoming comments from a central three-panel inbox. Approve suggested answers with one click, or configure autopilot rules to reply within seconds while viewers remain on YouTube.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-semibold text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Sub-2-second response latency window</span>
            </div>
          </div>

          {/* Use Case 3: DM / Comment Funnels */}
          <div
            id="usecases-funnels"
            className="p-8 rounded-3xl border border-zinc-200 bg-white shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between scroll-mt-24"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-2">
                Comment Lead Funnels (Like ManyChat)
              </h3>
              <p className="text-sm font-semibold text-zinc-800 mb-3">
                Turn viewer comments into automated lead funnels
              </p>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                Ask viewers to comment &quot;LINK&quot;, &quot;GUIDE&quot;, or &quot;DEAL&quot;. BigRedHub recognizes the keyword trigger, replies with an attributed shortlink, and tracks conversion events through to checkout.
              </p>
            </div>
            <div className="pt-4 border-t border-zinc-100 flex items-center gap-2 text-xs font-semibold text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Full-funnel attribution from comment to sale</span>
            </div>
          </div>
        </div>
      </section>

      {/* THREE-STEP WORKFLOW SECTION */}
      <section
        id="workflow"
        className="py-20 bg-zinc-50 border-y border-zinc-100 px-6 scroll-mt-16"
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
              BigRedHub replaces manual typing with an intelligent intent pipeline that captures sales when interest is fresh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-xs hover:border-zinc-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-heading font-bold text-lg mb-6">
                01
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-3">
                Detect Buyer Intent
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                BigRedHub continuously monitors new comments on your videos and Shorts. The intent engine distinguishes buyers asking for links and prices from casual noise and spam.
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
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-xs hover:border-zinc-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center font-heading font-bold text-lg mb-6">
                02
              </div>
              <h3 className="font-heading text-xl font-bold text-zinc-950 mb-3">
                Deliver Trackable Links
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                When a viewer asks for gear, pricing, or product recommendations, BigRedHub posts a personalized reply with an attributed short URL in under 2 seconds.
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
            <div className="bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-xs hover:border-zinc-300 hover:shadow-md transition-all">
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
                  <span>Webhook and conversion tracking support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL YOUTUBE & GOOGLE TRUST VERIFICATION SECTION */}
      <section className="py-14 bg-zinc-950 text-white border-y border-zinc-800 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-zinc-900/80 border border-zinc-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Platform Safety Guarantee</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Official YouTube Data API v3 Architecture. Zero Bots. Zero Account Risk.
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                BigRedHub never asks for your password or runs illegal browser scrapers that trigger YouTube strikes. All authentication happens via encrypted Google OAuth2 tokens with strict rate-limiting and human-paced delivery delays.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">Google OAuth2</span>
                </div>
                <p className="text-[11px] text-zinc-400">Encrypted token sessions. Passwords stay private.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">Spintax Engine</span>
                </div>
                <p className="text-[11px] text-zinc-400">Rotates dynamic phrasing to avoid repeat penalties.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">Official API v3</span>
                </div>
                <p className="text-[11px] text-zinc-400">Zero unofficial headless scrapers or bot networks.</p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-bold text-white">Human Delay</span>
                </div>
                <p className="text-[11px] text-zinc-400">Safety cooldown pacing complies with Google terms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONVERSION-TRACKING BENEFITS SECTION */}
      <section id="benefits" className="py-20 px-6 max-w-6xl mx-auto scroll-mt-16">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 bg-white text-zinc-700 text-xs font-semibold mb-3">
            <BarChart3 className="w-3.5 h-3.5 text-red-600" />
            <span>Conversion Architecture</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 mb-4">
            Engineered for creators who sell
          </h2>
          <p className="text-base text-zinc-600">
            Viewers asking for links in comments intend to purchase immediately. BigRedHub locks in that moment before attention wanders.
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
                Most viewers close YouTube within minutes of posting a query. BigRedHub monitors your channel and answers while they are still holding their phones.
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
                BigRedHub checks negative words, scam patterns, and duplicate comments. Your automations never trigger on trolls or send links to toxic remarks.
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
      <section id="faq" className="py-20 bg-zinc-50 border-t border-zinc-100 px-6 scroll-mt-16">
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
                Does BigRedHub comply with YouTube terms of service?
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Yes. BigRedHub connects via official Google OAuth2 and uses the official YouTube Data API v3. Replies occur through authorized API scopes granted by channel owners.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h3 className="font-heading font-semibold text-base text-zinc-950 mb-2">
                How does BigRedHub prevent looking like a spam bot?
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
                Yes. The BigRedHub dashboard includes a Dry Run Simulator where you can test any sample comment text against your trigger rules before enabling live polling.
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
              <span>Get Started with BigRedHub</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <p className="text-xs text-zinc-500 mt-4">
              Sign in with your Google account • YouTube Data API authorized
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-100 py-12 px-6 bg-white text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10 text-left">
            <div>
              <p className="font-bold text-zinc-900 mb-3 text-xs uppercase tracking-wider">
                Platform Functions
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="#functions-dashboard" className="hover:text-zinc-900 transition-colors">
                    Central Dashboard
                  </a>
                </li>
                <li>
                  <a href="#functions-funnels" className="hover:text-zinc-900 transition-colors">
                    Comment Lead Funnels
                  </a>
                </li>
                <li>
                  <a href="#functions-tagging" className="hover:text-zinc-900 transition-colors">
                    Intelligent Intent Tagging
                  </a>
                </li>
                <li>
                  <a href="#functions-answers" className="hover:text-zinc-900 transition-colors">
                    AI-Powered Answers
                  </a>
                </li>
                <li>
                  <a href="#functions-automations" className="hover:text-zinc-900 transition-colors">
                    Custom Automations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-zinc-900 mb-3 text-xs uppercase tracking-wider">
                Solutions
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="#solutions-ecommerce" className="hover:text-zinc-900 transition-colors">
                    For E-Commerce & D2C
                  </a>
                </li>
                <li>
                  <a href="#solutions-creators" className="hover:text-zinc-900 transition-colors">
                    For Creators & Influencers
                  </a>
                </li>
                <li>
                  <a href="#solutions-agencies" className="hover:text-zinc-900 transition-colors">
                    For Marketing Agencies
                  </a>
                </li>
                <li>
                  <a href="#usecases-moderation" className="hover:text-zinc-900 transition-colors">
                    Spam & Negative Shields
                  </a>
                </li>
                <li>
                  <a href="#usecases-replies" className="hover:text-zinc-900 transition-colors">
                    1-Click Smart Replies
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-zinc-900 mb-3 text-xs uppercase tracking-wider">
                Product
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="#demo" className="hover:text-zinc-900 transition-colors">
                    Interactive Simulation
                  </a>
                </li>
                <li>
                  <a href="#workflow" className="hover:text-zinc-900 transition-colors">
                    Three-Step Workflow
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="hover:text-zinc-900 transition-colors">
                    Conversion Architecture
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-zinc-900 transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-zinc-900 mb-3 text-xs uppercase tracking-wider">
                Account
              </p>
              <ul className="space-y-2">
                <li>
                  <Link href="/login" className="hover:text-zinc-900 transition-colors">
                    Dashboard Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-zinc-900 transition-colors">
                    Connect Channel
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-600 text-white flex items-center justify-center">
                <Video className="w-3.5 h-3.5 fill-white" />
              </div>
              <span className="font-heading font-bold text-sm text-zinc-950">
                BigRed<span className="text-red-600">Hub</span>
              </span>
              <span className="text-zinc-400 ml-2">
                © {new Date().getFullYear()} BigRedHub. All rights reserved.
              </span>
            </div>

            <p className="text-[11px] text-zinc-400">
              YouTube is a registered trademark of Google LLC.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
