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
  Copy,
  Search,
  Filter,
  Globe,
  Share2,
  Workflow,
  AlertTriangle,
  Ban,
  Megaphone,
  Building2,
  Smile,
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

      {/* SECTION: 8 CORE FUNCTIONS (MATCHING USER REFERENCE IMAGE) */}
      <section id="functions" className="py-24 bg-gradient-to-b from-white via-zinc-50/50 to-white border-t border-zinc-100 px-4 sm:px-6 scroll-mt-16 relative overflow-hidden">
        {/* Soft atmospheric gradient blurs */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-gradient-to-tr from-purple-100/40 via-red-50/30 to-amber-50/30 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto">
          {/* Section Header with Badges and Hand-Drawn Cursive Doodles */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 relative">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-purple-200/80 bg-purple-50/70 text-purple-700 text-xs font-semibold mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin-slow" />
              <span>Everything You Need</span>
            </div>

            {/* Main Section Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 mb-4 leading-tight">
              Everything Needed to{" "}
              <span className="bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
                Monetize YouTube Comments
              </span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto">
              Eight powerful modules designed to manage, filter, automate, and attribute viewer conversations at scale.
            </p>

            {/* Left Hand-Drawn Annotation: 'From comments...' with curved arrow */}
            <div className="hidden lg:flex flex-col items-center absolute -left-16 -top-2 select-none pointer-events-none transform -rotate-12 animate-float">
              <span className="font-cursive text-purple-600 font-bold text-lg tracking-wide">From comments...</span>
              <svg className="w-8 h-8 text-purple-500 -mt-1 ml-4" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M 10 5 C 10 25, 25 30, 22 35" />
                <path d="M 16 33 L 23 36 L 24 29" />
              </svg>
            </div>

            {/* Right Hand-Drawn Annotation: '...to customers' with curved arrow & mini chart */}
            <div className="hidden lg:flex flex-col items-center absolute -right-16 -top-2 select-none pointer-events-none transform rotate-12 animate-float-reverse">
              <span className="font-cursive text-purple-600 font-bold text-lg tracking-wide">...to customers</span>
              <div className="flex items-center gap-1 -mt-1 mr-4">
                <div className="flex items-end gap-0.5 h-6">
                  <div className="w-1.5 h-2 bg-purple-200 rounded-xs" />
                  <div className="w-1.5 h-3.5 bg-purple-300 rounded-xs" />
                  <div className="w-1.5 h-5 bg-purple-400 rounded-xs" />
                </div>
                <svg className="w-7 h-7 text-purple-500" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M 8 30 C 15 10, 25 8, 30 18" />
                  <path d="M 24 16 L 31 18 L 29 25" />
                </svg>
              </div>
            </div>
          </div>

          {/* 8-Card Grid Layout (2 rows of 4 columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* CARD 1: Central Dashboard */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 p-5 flex flex-col justify-between group">
              <div>
                {/* Visual UI Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-3 mb-5 shadow-2xs">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/60 text-[10px]">
                    <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                      <div className="w-3.5 h-3.5 bg-red-600 rounded flex items-center justify-center text-white">
                        <Play className="w-2 h-2 fill-white" />
                      </div>
                      <span>BigRedHub</span>
                    </div>
                    <span className="font-semibold text-zinc-500">All Comments (842)</span>
                  </div>

                  {/* Inner Split Layout: Mini Sidebar + Feed */}
                  <div className="grid grid-cols-12 gap-1.5">
                    {/* Left Mini Nav */}
                    <div className="col-span-4 bg-white/90 rounded-lg p-1.5 border border-zinc-100 flex flex-col gap-1 text-[8px] font-medium text-zinc-500">
                      <div className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold flex items-center gap-1">
                        <MessageSquare className="w-2 h-2 text-purple-600" />
                        <span>Comments</span>
                      </div>
                      <div className="px-1.5 py-0.5 flex items-center gap-1 text-zinc-400">
                        <Users className="w-2 h-2" />
                        <span>Leads</span>
                      </div>
                      <div className="px-1.5 py-0.5 flex items-center gap-1 text-zinc-400">
                        <Sliders className="w-2 h-2" />
                        <span>Templates</span>
                      </div>
                      <div className="px-1.5 py-0.5 flex items-center gap-1 text-zinc-400">
                        <Zap className="w-2 h-2" />
                        <span>Automations</span>
                      </div>
                      <div className="px-1.5 py-0.5 flex items-center gap-1 text-zinc-400">
                        <BarChart3 className="w-2 h-2" />
                        <span>Analytics</span>
                      </div>
                    </div>

                    {/* Right Mini Comment List */}
                    <div className="col-span-8 bg-white/90 rounded-lg p-1.5 border border-zinc-100 flex flex-col gap-1.5">
                      {/* Search Pill */}
                      <div className="bg-zinc-50 rounded px-1.5 py-0.5 border border-zinc-200/60 flex items-center gap-1 text-[8px] text-zinc-400">
                        <Search className="w-2 h-2" />
                        <span>Search comments...</span>
                      </div>

                      {/* Comment 1 */}
                      <div className="bg-zinc-50/70 p-1 rounded border border-zinc-100 flex items-center justify-between text-[8px]">
                        <div className="flex items-center gap-1 min-w-0">
                          <div className="w-3.5 h-3.5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-[7px] shrink-0">P</div>
                          <div className="truncate">
                            <span className="font-bold text-zinc-800">Priya Sharma</span>
                            <p className="text-[7px] text-zinc-500 truncate">Price kya hai? 🤝</p>
                          </div>
                        </div>
                        <span className="px-1 py-0.2 rounded bg-red-100 text-red-700 font-semibold text-[6.5px] shrink-0">Buying Intent</span>
                      </div>

                      {/* Comment 2 */}
                      <div className="bg-zinc-50/70 p-1 rounded border border-zinc-100 flex items-center justify-between text-[8px]">
                        <div className="flex items-center gap-1 min-w-0">
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[7px] shrink-0">R</div>
                          <div className="truncate">
                            <span className="font-bold text-zinc-800">Rohit Verma</span>
                            <p className="text-[7px] text-zinc-500 truncate">Link please 🙏</p>
                          </div>
                        </div>
                        <span className="px-1 py-0.2 rounded bg-blue-100 text-blue-700 font-semibold text-[6.5px] shrink-0">Link Request</span>
                      </div>

                      {/* Comment 3 */}
                      <div className="bg-zinc-50/70 p-1 rounded border border-zinc-100 flex items-center justify-between text-[8px]">
                        <div className="flex items-center gap-1 min-w-0">
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[7px] shrink-0">N</div>
                          <div className="truncate">
                            <span className="font-bold text-zinc-800">Neha Singh</span>
                            <p className="text-[7px] text-zinc-500 truncate">Is this on Amazon?</p>
                          </div>
                        </div>
                        <span className="px-1 py-0.2 rounded bg-zinc-200 text-zinc-700 font-semibold text-[6.5px] shrink-0">Question</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-zinc-950">Central Dashboard</h3>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Manage all YouTube comments in one place. Three-panel inbox with saved views, instant search, and real-time reply workspace.
                </p>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
              >
                <span>Launch Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>


            {/* CARD 2: Comment Lead Funnels */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 p-5 flex flex-col justify-between group">
              <div>
                {/* Visual UI Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-3 mb-5 shadow-2xs">
                  {/* Customer Avatar & Bubble */}
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center font-bold text-[9px]">C</div>
                    <div className="bg-white px-2.5 py-1 rounded-xl border border-zinc-200/80 shadow-2xs text-[9px] text-zinc-800">
                      <span className="font-semibold block text-[8px] text-zinc-400">Customer</span>
                      <span>Where can I buy this? 🤩</span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex justify-center mb-1.5 text-zinc-300">
                    <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
                  </div>

                  {/* Tracked Short Link Box */}
                  <div className="bg-white rounded-xl border border-purple-200 p-2 shadow-2xs mb-3 text-center">
                    <span className="text-[8px] font-semibold text-zinc-400 block mb-0.5">Tracked Short Link</span>
                    <div className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded text-[9px]">
                      <span>bigredhub.info/l/abc123</span>
                      <Copy className="w-2.5 h-2.5 text-purple-500" />
                    </div>
                  </div>

                  {/* 3 Step Icons: Comment -> Tracked Link -> Order */}
                  <div className="flex items-center justify-around pt-1 border-t border-zinc-200/60">
                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-2xs">
                        <Play className="w-3.5 h-3.5 fill-white" />
                      </div>
                      <span className="text-[7.5px] font-semibold text-zinc-600 mt-1">Comment</span>
                    </div>

                    <ArrowRight className="w-3 h-3 text-zinc-300" />

                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-2xs">
                        <Share2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[7.5px] font-semibold text-zinc-600 mt-1">Tracked Link</span>
                    </div>

                    <ArrowRight className="w-3 h-3 text-zinc-300" />

                    <div className="flex flex-col items-center">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[7.5px] font-semibold text-zinc-600 mt-1">Order</span>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-xs">
                    <Filter className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-zinc-950">Comment Lead Funnels</h3>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Turn viewer comments and keywords into attributed leads and orders. Delivers unique shortlinks like ManyChat for YouTube.
                </p>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
              >
                <span>Setup Tracked Links</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>


            {/* CARD 3: Intelligent Intent Tagging */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 p-5 flex flex-col justify-between group">
              <div>
                {/* Visual UI Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-3 mb-5 shadow-2xs">
                  {/* Top: Comment Header & Robot Tag */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/60 text-[9px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[8px]">R</div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-zinc-800">Rohit Verma</span>
                          <span className="text-[7px] text-zinc-400">5 min ago</span>
                        </div>
                        <p className="text-[8px] text-zinc-600 font-medium">Price kya hai?</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* AI Intent Classification Bars */}
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">AI Intent Classification</span>

                    {/* Intent 1: Buying Intent */}
                    <div>
                      <div className="flex justify-between text-[8px] font-semibold mb-0.5">
                        <span className="text-red-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> Buying Intent
                        </span>
                        <span className="text-zinc-600 font-mono">92%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200/80 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 rounded-full" style={{ width: "92%" }} />
                      </div>
                    </div>

                    {/* Intent 2: Price Inquiry */}
                    <div>
                      <div className="flex justify-between text-[8px] font-semibold mb-0.5">
                        <span className="text-blue-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> Price Inquiry
                        </span>
                        <span className="text-zinc-600 font-mono">85%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200/80 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }} />
                      </div>
                    </div>

                    {/* Intent 3: Link Request */}
                    <div>
                      <div className="flex justify-between text-[8px] font-semibold mb-0.5">
                        <span className="text-purple-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600" /> Link Request
                        </span>
                        <span className="text-zinc-600 font-mono">78%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200/80 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: "78%" }} />
                      </div>
                    </div>

                    {/* Intent 4: General Question */}
                    <div>
                      <div className="flex justify-between text-[8px] font-semibold mb-0.5">
                        <span className="text-emerald-700 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" /> General Question
                        </span>
                        <span className="text-zinc-600 font-mono">60%</span>
                      </div>
                      <div className="w-full h-1.5 bg-zinc-200/80 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: "60%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Tag className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-zinc-950">Intelligent Intent Tagging</h3>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Automatic AI classification of comments. Tags Buying Intent, Price Inquiries, and Link Requests with confidence scores.
                </p>
              </div>

              {/* Action Button */}
              <a
                href="#demo"
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
              >
                <span>Test Classification</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>


            {/* CARD 4: AI-Powered Answers */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 p-5 flex flex-col justify-between group">
              <div>
                {/* Visual UI Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-3 mb-5 shadow-2xs">
                  {/* Viewer Comment */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/60 text-[9px]">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[8px]">N</div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-zinc-800">Neha Singh</span>
                          <span className="text-[7px] text-zinc-400">1 hour ago</span>
                        </div>
                        <p className="text-[8px] text-zinc-600 font-medium">Is this available on Amazon?</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center">
                      <Play className="w-2 h-2 fill-white" />
                    </div>
                  </div>

                  {/* Pill: AI Generated Reply + Generate Button */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8px] font-bold text-zinc-600 flex items-center gap-1">
                      <Bot className="w-2.5 h-2.5 text-purple-600" /> AI Generated Reply
                    </span>
                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-600 text-white font-bold text-[7.5px] shadow-2xs">
                      <Sparkles className="w-2 h-2" />
                      <span>Generate</span>
                    </div>
                  </div>

                  {/* Generated Reply Bubble */}
                  <div className="bg-white rounded-xl border border-zinc-200/80 p-2 text-[8.5px] text-zinc-700 shadow-2xs relative">
                    <p className="leading-snug pr-4">
                      Hi Neha! 👋 Yes, this is available on Amazon. You can check it here: <span className="font-semibold text-purple-600">[short link]</span>
                    </p>
                    <button className="absolute bottom-1.5 right-1.5 text-zinc-400 hover:text-zinc-600">
                      <Copy className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Bot className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-zinc-950">AI-Powered Answers</h3>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Brand-compliant answers with just one click. Natural Spintax message rotation prevents duplicate bot detection.
                </p>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
              >
                <span>Configure Templates</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>


            {/* CARD 5: Activity Logs & Traces */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 p-5 flex flex-col justify-between group">
              <div>
                {/* Visual UI Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-3 mb-5 shadow-2xs">
                  {/* Top Logs Header */}
                  <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-200/60 text-[9px]">
                    <span className="font-bold text-zinc-900">Activity Logs</span>
                    <span className="text-[7.5px] font-semibold text-zinc-500 bg-white px-1.5 py-0.5 rounded border border-zinc-200">All Activities ▾</span>
                  </div>

                  {/* 4 Log Items */}
                  <div className="space-y-1.5 text-[8px]">
                    {/* Log 1: Reply Sent */}
                    <div className="bg-white rounded-lg p-1.5 border border-zinc-200/70 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <div>
                          <span className="font-bold text-zinc-900 block leading-tight">Reply Sent</span>
                          <span className="text-[7px] text-zinc-400 font-mono">Comment ID: Ugy....8k2</span>
                        </div>
                      </div>
                      <span className="text-[7px] text-zinc-400 font-medium">2 min ago</span>
                    </div>

                    {/* Log 2: Comment Fetched */}
                    <div className="bg-white rounded-lg p-1.5 border border-zinc-200/70 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                          <Play className="w-2 h-2 fill-blue-600" />
                        </div>
                        <div>
                          <span className="font-bold text-zinc-900 block leading-tight">Comment Fetched</span>
                          <span className="text-[7px] text-zinc-400">200 comments processed</span>
                        </div>
                      </div>
                      <span className="text-[7px] text-zinc-400 font-medium">5 min ago</span>
                    </div>

                    {/* Log 3: API Success */}
                    <div className="bg-white rounded-lg p-1.5 border border-zinc-200/70 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </div>
                        <div>
                          <span className="font-bold text-zinc-900 block leading-tight">API Success</span>
                          <span className="text-[7px] text-zinc-400">Status: 200 OK</span>
                        </div>
                      </div>
                      <span className="text-[7px] text-zinc-400 font-medium">5 min ago</span>
                    </div>

                    {/* Log 4: Reply Failed */}
                    <div className="bg-white rounded-lg p-1.5 border border-red-100 flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                          <AlertTriangle className="w-2.5 h-2.5" />
                        </div>
                        <div>
                          <span className="font-bold text-red-700 block leading-tight">Reply Failed</span>
                          <span className="text-[7px] text-red-500">Status: 403 - Quota Exceeded</span>
                        </div>
                      </div>
                      <span className="text-[7px] text-zinc-400 font-medium">1 hour ago</span>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                    <ScrollText className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-zinc-950">Activity Logs & Traces</h3>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Audit trail of all comment activity. View real YouTube comment reply IDs, delivery timestamps, and API status codes.
                </p>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
              >
                <span>View Activity Feed</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>


            {/* CARD 6: Custom Automations */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 p-5 flex flex-col justify-between group">
              <div>
                {/* Visual UI Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-3 mb-5 shadow-2xs">
                  {/* IF Rule Box */}
                  <div className="bg-white rounded-xl border border-zinc-200/80 p-2 shadow-2xs mb-2">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[7.5px]">IF</span>
                      <span className="text-[8px] font-bold text-zinc-700">Comment contains</span>
                    </div>
                    <span className="text-[7px] text-zinc-400 block mb-1">ANY of these keywords</span>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[7.5px] border border-blue-200">price ✕</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[7.5px] border border-blue-200">buy ✕</span>
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[7.5px] border border-blue-200">order ✕</span>
                      <span className="px-1 py-0.5 rounded bg-zinc-100 text-zinc-500 text-[7.5px]">+</span>
                    </div>
                  </div>

                  {/* AND Rule Box */}
                  <div className="bg-white rounded-xl border border-zinc-200/80 p-2 shadow-2xs mb-2">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[7.5px]">AND</span>
                      <span className="text-[8px] font-bold text-zinc-700">Not contains</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-semibold text-[7.5px] border border-red-200">scam ✕</span>
                      <span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-semibold text-[7.5px] border border-red-200">whatsapp ✕</span>
                      <span className="px-1 py-0.5 rounded bg-zinc-100 text-zinc-500 text-[7.5px]">+</span>
                    </div>
                  </div>

                  {/* THEN Action Box */}
                  <div className="bg-white rounded-xl border border-blue-200 p-2 shadow-2xs flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                        <Send className="w-2.5 h-2.5" />
                      </div>
                      <div>
                        <span className="text-[7px] text-zinc-400 block leading-tight">THEN</span>
                        <span className="font-bold text-zinc-800 text-[8px]">Send AI Reply</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[7.5px] text-zinc-500 bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-200">
                      <Clock className="w-2.5 h-2.5" />
                      <span>Wait 10 minutes</span>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-zinc-950">Custom Automations</h3>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Create rule-based workflows with ANY or ALL keyword matching, negative exclusion lists, and custom response cooldowns.
                </p>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
              >
                <span>Create Rules</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>


            {/* CARD 7: Mobile Responsive App */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 p-5 flex flex-col justify-between group">
              <div>
                {/* Visual UI Mockup Box: Phone + Laptop Device Composition */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-3 mb-5 shadow-2xs flex items-center justify-center relative min-h-[160px] overflow-hidden">
                  {/* Laptop Mockup (Background) */}
                  <div className="w-[155px] bg-white rounded-t-lg border-2 border-zinc-800 shadow-md p-1 transform translate-x-4 translate-y-1">
                    <div className="flex items-center justify-between pb-1 border-b border-zinc-100 text-[6px]">
                      <div className="flex items-center gap-0.5">
                        <div className="w-1 h-1 rounded-full bg-red-400" />
                        <div className="w-1 h-1 rounded-full bg-amber-400" />
                        <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      </div>
                      <span className="font-bold text-zinc-700 text-[6px]">BigRedHub</span>
                    </div>
                    <div className="space-y-1 pt-1 text-[5.5px]">
                      <div className="bg-zinc-50 p-0.5 rounded flex justify-between items-center">
                        <span className="font-semibold text-zinc-800">Priya Sharma</span>
                        <span className="px-1 rounded bg-red-100 text-red-600 font-bold">Buying</span>
                      </div>
                      <div className="bg-zinc-50 p-0.5 rounded flex justify-between items-center">
                        <span className="font-semibold text-zinc-800">Rohit Verma</span>
                        <span className="px-1 rounded bg-blue-100 text-blue-600 font-bold">Link</span>
                      </div>
                    </div>
                  </div>

                  {/* Phone Mockup (Foreground) */}
                  <div className="w-[82px] bg-white rounded-2xl border-2 border-zinc-900 shadow-xl p-1.5 absolute left-3 bottom-2 transform -rotate-3">
                    <div className="flex items-center justify-between pb-1 mb-1 border-b border-zinc-100 text-[6px]">
                      <span className="font-bold text-zinc-900">BigRedHub</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    </div>
                    <div className="flex gap-1 text-[5px] font-semibold text-zinc-500 mb-1">
                      <span className="text-red-600 border-b border-red-600">Comments</span>
                      <span>Leads</span>
                    </div>
                    <div className="space-y-1 text-[5px]">
                      <div className="bg-zinc-50 p-1 rounded">
                        <span className="font-bold block text-zinc-800">Priya Sharma</span>
                        <span className="text-zinc-500">Price kya hai?</span>
                      </div>
                      <div className="bg-zinc-50 p-1 rounded">
                        <span className="font-bold block text-zinc-800">Rohit Verma</span>
                        <span className="text-zinc-500">Link please</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-600 text-white flex items-center justify-center shadow-xs">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-zinc-950">Mobile Responsive App</h3>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  Reply to viewer inquiries on the go. Complete lightweight web app accessible from phones, tablets, and desktop workstations.
                </p>
              </div>

              {/* Action Button */}
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
              >
                <span>Open Mobile App</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>


            {/* CARD 8: Automatic Spam Shields */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 p-5 flex flex-col justify-between group">
              <div>
                {/* Visual UI Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-3 mb-5 shadow-2xs">
                  {/* Filter Header */}
                  <div className="flex items-center gap-1.5 pb-2 mb-2 border-b border-zinc-200/60 text-[9px] font-bold text-zinc-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Comment Filter</span>
                  </div>

                  {/* Filter Toggles */}
                  <div className="space-y-1.5 mb-2.5 text-[8px]">
                    {/* Toggle 1: Phishing Links */}
                    <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-zinc-200/70 shadow-2xs">
                      <span className="text-zinc-700 flex items-center gap-1">
                        <AlertTriangle className="w-2.5 h-2.5 text-red-500" /> Phishing Links
                      </span>
                      <div className="w-6 h-3 bg-red-500 rounded-full flex items-center justify-end px-0.5 shadow-2xs">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Toggle 2: WhatsApp Scams */}
                    <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-zinc-200/70 shadow-2xs">
                      <span className="text-zinc-700 flex items-center gap-1">
                        <MessageCircle className="w-2.5 h-2.5 text-emerald-500" /> WhatsApp Scams
                      </span>
                      <div className="w-6 h-3 bg-emerald-500 rounded-full flex items-center justify-end px-0.5 shadow-2xs">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Toggle 3: Hate Comments */}
                    <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-zinc-200/70 shadow-2xs">
                      <span className="text-zinc-700 flex items-center gap-1">
                        <ThumbsDown className="w-2.5 h-2.5 text-amber-500" /> Hate Comments
                      </span>
                      <div className="w-6 h-3 bg-amber-500 rounded-full flex items-center justify-end px-0.5 shadow-2xs">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>

                    {/* Toggle 4: Irrelevant Spam */}
                    <div className="flex items-center justify-between bg-white px-2 py-1 rounded-lg border border-zinc-200/70 shadow-2xs">
                      <span className="text-zinc-700 flex items-center gap-1">
                        <Ban className="w-2.5 h-2.5 text-blue-500" /> Irrelevant Spam
                      </span>
                      <div className="w-6 h-3 bg-blue-500 rounded-full flex items-center justify-end px-0.5 shadow-2xs">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Intercepted Bad Comment Callout */}
                  <div className="bg-red-50/80 rounded-xl border border-red-100 p-1.5 flex items-center justify-between text-[7.5px]">
                    <div>
                      <span className="font-semibold text-zinc-700 block">DM me on WhatsApp +91 9876543210</span>
                      <span className="text-zinc-400">for discount 🤫</span>
                    </div>
                    <div className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold flex items-center gap-0.5 shadow-2xs shrink-0">
                      <Ban className="w-2 h-2" />
                      <span>Blocked</span>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-zinc-950">Automatic Spam Shields</h3>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                  No bots, no nonsense. Automatically filter phishing, WhatsApp contact scams, and hate comments without sending replies.
                </p>
              </div>

              {/* Action Button */}
              <a
                href="#benefits"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
              >
                <span>View Security Specs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: TAILORED SOLUTIONS (MATCHING USER REFERENCE IMAGE) */}
      <section id="solutions" className="py-24 bg-gradient-to-b from-white via-zinc-50/40 to-white border-t border-zinc-100 px-4 sm:px-6 scroll-mt-16 relative overflow-hidden">
        {/* Soft atmospheric gradient blur */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-gradient-to-tr from-purple-100/40 via-pink-50/30 to-amber-50/30 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto">
          {/* Section Header with Pill and Hand-Drawn Annotations */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 relative">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-purple-200/80 bg-purple-50/70 text-purple-700 text-xs font-semibold mb-4 shadow-2xs">
              <Users className="w-3.5 h-3.5 text-purple-600" />
              <span>Tailored Solutions</span>
            </div>

            {/* Main Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 mb-4 leading-tight">
              Tailored Solutions for{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 bg-clip-text text-transparent">
                Every Growth Model
              </span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto">
              BigRedHub replaces manual typing with intelligent comment response pipelines adapted to your specific business model.
            </p>

            {/* Left Hand-Drawn Annotation: 'Different goals...' */}
            <div className="hidden lg:flex flex-col items-center absolute -left-12 -top-2 select-none pointer-events-none transform -rotate-12 animate-float">
              <span className="font-cursive text-purple-600 font-bold text-lg tracking-wide">Different goals...</span>
              <svg className="w-8 h-8 text-purple-500 -mt-1 ml-4" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M 10 5 C 10 25, 25 30, 22 35" />
                <path d="M 16 33 L 23 36 L 24 29" />
              </svg>
            </div>

            {/* Right Hand-Drawn Annotation: '...same powerful engine!' */}
            <div className="hidden lg:flex flex-col items-center absolute -right-12 -top-2 select-none pointer-events-none transform rotate-12 animate-float-reverse">
              <span className="font-cursive text-purple-600 font-bold text-lg tracking-wide">...same powerful engine!</span>
              <div className="flex items-center gap-1 -mt-1 mr-4">
                <div className="flex items-end gap-0.5 h-6">
                  <div className="w-1.5 h-2 bg-purple-200 rounded-xs" />
                  <div className="w-1.5 h-3.5 bg-purple-300 rounded-xs" />
                  <div className="w-1.5 h-5 bg-purple-400 rounded-xs" />
                </div>
                <svg className="w-7 h-7 text-purple-500" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M 8 30 C 15 10, 25 8, 30 18" />
                  <path d="M 24 16 L 31 18 L 29 25" />
                </svg>
              </div>
            </div>
          </div>

          {/* 3 Main Solutions Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CARD 1: For E-Commerce & D2C Brands */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 p-6 flex flex-col justify-between group">
              <div>
                {/* Visual Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-4 mb-6 shadow-2xs relative">
                  {/* Floating Shopping Cart Doodle */}
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shadow-xs">
                    <ShoppingCart className="w-4 h-4" />
                  </div>

                  {/* Viewer Comment Bubble */}
                  <div className="flex items-start gap-2.5 mb-4 max-w-[85%]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      A
                    </div>
                    <div className="bg-white px-3 py-2 rounded-2xl border border-zinc-200/80 shadow-2xs text-[10px] text-zinc-800">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-bold text-zinc-900">Anjali Verma</span>
                        <span className="text-[8px] text-zinc-400">2 hours ago</span>
                      </div>
                      <p className="font-medium text-zinc-700">Price kya hai? Where to buy? 🤩</p>
                      <div className="flex items-center gap-2 mt-1 text-zinc-400 text-[8px]">
                        <span className="flex items-center gap-0.5"><ThumbsUp className="w-2.5 h-2.5" /></span>
                        <span className="flex items-center gap-0.5"><ThumbsDown className="w-2.5 h-2.5" /></span>
                        <span className="font-semibold text-zinc-600">Reply</span>
                      </div>
                    </div>
                  </div>

                  {/* Connecting Curved Arrow */}
                  <div className="flex justify-center -my-2 mr-12 text-pink-400">
                    <svg className="w-6 h-6 rotate-12" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M 5 5 C 10 18, 18 20, 25 22" />
                      <path d="M 20 18 L 26 22 L 22 27" />
                    </svg>
                  </div>

                  {/* Automated BigRedHub Reply Card with Product Widget */}
                  <div className="bg-white rounded-2xl border border-zinc-200/80 p-3 shadow-sm ml-auto max-w-[92%]">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-3.5 h-3.5 bg-red-600 rounded flex items-center justify-center text-white">
                        <Play className="w-2 h-2 fill-white" />
                      </div>
                      <span className="font-bold text-zinc-900 text-[9px]">BigRedHub</span>
                      <span className="text-[7.5px] text-zinc-400">Just now</span>
                    </div>

                    <p className="text-[9px] text-zinc-700 font-medium mb-2">
                      You can buy it here 👇
                    </p>

                    {/* Product Card Inside Reply */}
                    <div className="bg-zinc-50 rounded-xl p-2 border border-zinc-200/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Tumbler Product Visual */}
                        <div className="w-8 h-10 rounded-lg bg-pink-100 border border-pink-200 flex items-center justify-center text-pink-600 shrink-0">
                          <div className="w-4 h-7 rounded-sm bg-pink-400 border border-pink-500 shadow-2xs" />
                        </div>
                        <div>
                          <h5 className="font-bold text-[9px] text-zinc-900 leading-tight">Premium Tumbler</h5>
                          <span className="text-[8px] text-zinc-500">750ml – ₹499</span>
                        </div>
                      </div>

                      <div className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[8px] flex items-center gap-1 shadow-2xs hover:bg-blue-700 transition-colors">
                        <span>Buy Now</span>
                        <ShoppingCart className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>

                  {/* Mini '+ Sales from YouTube' badge */}
                  <div className="mt-3 flex items-center justify-end gap-1.5">
                    <div className="flex items-end gap-0.5 h-4">
                      <div className="w-1 h-1.5 bg-emerald-400 rounded-2xs" />
                      <div className="w-1 h-2.5 bg-emerald-500 rounded-2xs" />
                      <div className="w-1 h-3.5 bg-emerald-600 rounded-2xs" />
                    </div>
                    <span className="text-[9px] font-bold text-emerald-600">+ Sales from YouTube</span>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-xs">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-zinc-950">For E-Commerce & D2C Brands</h3>
                    <p className="text-xs font-semibold text-pink-600">Protect your brand and increase ROAS</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-5">
                  Viewers asking &quot;where to buy&quot; or &quot;price&quot; on your YouTube product videos are ready to buy. BigRedHub auto-replies with direct product links in under 2 seconds, preventing lost sales and lifting paid ad ROAS.
                </p>

                {/* Bullet Points */}
                <ul className="space-y-2 text-xs text-zinc-700 mb-6 font-medium">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Auto-deliver tracked checkout and cart links</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Attribute real sales revenue to specific videos</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Block scam bots targeting your customers</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <Link
                href="/login"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-500 hover:from-pink-700 hover:to-rose-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
              >
                <span>Deploy for E-Commerce</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>


            {/* CARD 2: For Creators & Influencers */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 p-6 flex flex-col justify-between group">
              <div>
                {/* Visual Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-4 mb-6 shadow-2xs relative">
                  {/* Floating Megaphone Doodle */}
                  <div className="absolute -top-2 left-2 w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                    <Megaphone className="w-4 h-4" />
                  </div>

                  {/* Center Video Player Mockup */}
                  <div className="rounded-xl overflow-hidden border border-zinc-200 shadow-xs mb-3 bg-zinc-950 relative">
                    <div className="relative h-28 bg-gradient-to-tr from-purple-900/60 via-zinc-800 to-zinc-900 flex items-center justify-center">
                      {/* Creator Visual Representation */}
                      <div className="w-16 h-16 rounded-full bg-purple-200/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-xs">
                        <Users className="w-7 h-7 text-white/80" />
                      </div>
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-red-600/90 flex items-center justify-center text-white shadow-lg">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Video Player Controls Bar */}
                    <div className="bg-zinc-900/95 px-2 py-1 flex items-center justify-between text-[7px] text-white/70">
                      <div className="flex items-center gap-1.5">
                        <Play className="w-2 h-2 fill-white text-white" />
                        <span>0:00 / 8:24</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>CC</span>
                        <Sliders className="w-2 h-2" />
                        <Monitor className="w-2 h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Floating Heart Reaction Badge */}
                  <div className="absolute bottom-16 right-3 w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md animate-pulse">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                  </div>

                  {/* Viewer Comment & Auto-Reply Flow */}
                  <div className="space-y-2">
                    {/* Viewer Comment */}
                    <div className="flex items-start gap-2 max-w-[85%]">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[8px] shrink-0">
                        R
                      </div>
                      <div className="bg-white px-2.5 py-1.5 rounded-xl border border-zinc-200/80 shadow-2xs text-[9px] text-zinc-800">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-zinc-900 text-[8.5px]">Rohan</span>
                          <span className="text-[7.5px] text-zinc-400">1 hour ago</span>
                        </div>
                        <p className="text-[8.5px] text-zinc-700">Awesome video! Links pls? 🙏</p>
                      </div>
                    </div>

                    {/* BigRedHub Multi-Link Reply */}
                    <div className="bg-white rounded-xl border border-zinc-200/80 p-2.5 shadow-2xs ml-auto max-w-[92%]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-3 h-3 bg-red-600 rounded flex items-center justify-center text-white">
                          <Play className="w-1.5 h-1.5 fill-white" />
                        </div>
                        <span className="font-bold text-zinc-900 text-[8.5px]">BigRedHub</span>
                        <span className="text-[7px] text-zinc-400">Just now</span>
                      </div>

                      <p className="text-[8px] text-zinc-700 font-medium mb-1">
                        Here are my gear links 👇
                      </p>

                      <div className="space-y-0.5 text-[7.5px] text-zinc-600">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-zinc-800">My Camera →</span>
                          <span className="font-semibold text-purple-600">[short link]</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-zinc-800">My Mic →</span>
                          <span className="font-semibold text-purple-600">[short link]</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-zinc-800">Full Setup →</span>
                          <span className="font-semibold text-purple-600">[short link]</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-zinc-950">For Creators & Influencers</h3>
                    <p className="text-xs font-semibold text-purple-600">Community growth and monetized interactions</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-5">
                  Stop copy-pasting gear links, course discounts, or newsletter invitations 500 times per upload. BigRedHub gives automatic creator hearts and delivers your links without burnout.
                </p>

                {/* Bullet Points */}
                <ul className="space-y-2 text-xs text-zinc-700 mb-6 font-medium">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Deliver affiliate gear and sponsor links</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Auto-heart to send phone notifications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Spintax natural response rotation</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <Link
                href="/login"
                className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
              >
                <span>Deploy for Creators</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>


            {/* CARD 3: For Marketing Agencies */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 p-6 flex flex-col justify-between group">
              <div>
                {/* Visual Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-4 mb-6 shadow-2xs">
                  {/* Agency Multi-Tenant Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-200/60 text-[9px]">
                    <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                      <div className="w-3.5 h-3.5 bg-red-600 rounded flex items-center justify-center text-white">
                        <Play className="w-2 h-2 fill-white" />
                      </div>
                      <span>BigRedHub</span>
                    </div>
                    <div className="px-2 py-0.5 rounded bg-purple-600 text-white font-bold text-[8px] flex items-center gap-1 shadow-2xs">
                      <span>+ Add Client</span>
                    </div>
                  </div>

                  {/* Split: Mini Nav + Client Channels List */}
                  <div className="grid grid-cols-12 gap-2">
                    {/* Left Mini Nav */}
                    <div className="col-span-4 bg-white/90 rounded-lg p-1.5 border border-zinc-100 flex flex-col gap-1 text-[7.5px] font-medium text-zinc-500">
                      <div className="px-1 py-0.5 flex items-center gap-1 text-zinc-400">
                        <Monitor className="w-2 h-2" />
                        <span>Dashboard</span>
                      </div>
                      <div className="px-1 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold flex items-center gap-1">
                        <Building2 className="w-2 h-2 text-purple-600" />
                        <span>Clients</span>
                      </div>
                      <div className="px-1 py-0.5 flex items-center gap-1 text-zinc-400">
                        <MessageSquare className="w-2 h-2" />
                        <span>Comments</span>
                      </div>
                      <div className="px-1 py-0.5 flex items-center gap-1 text-zinc-400">
                        <Zap className="w-2 h-2" />
                        <span>Automations</span>
                      </div>
                      <div className="px-1 py-0.5 flex items-center gap-1 text-zinc-400">
                        <BarChart3 className="w-2 h-2" />
                        <span>Analytics</span>
                      </div>
                    </div>

                    {/* Right Client Channels Table */}
                    <div className="col-span-8 bg-white/90 rounded-lg p-1.5 border border-zinc-100 space-y-1.5">
                      <span className="text-[7.5px] font-bold text-zinc-500 block mb-0.5">Client Channels</span>

                      {/* Client 1: Fashion Brand */}
                      <div className="bg-zinc-50/80 p-1 rounded border border-zinc-100 flex items-center justify-between text-[7.5px]">
                        <div className="flex items-center gap-1 min-w-0">
                          <div className="w-4 h-4 rounded-md bg-pink-500 text-white flex items-center justify-center font-bold text-[7px] shrink-0">F</div>
                          <div className="truncate">
                            <span className="font-bold text-zinc-900 block truncate leading-tight">Fashion Brand</span>
                            <span className="text-[6.5px] text-zinc-400">24,530 comments</span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 text-[7px] shrink-0">+320%</span>
                      </div>

                      {/* Client 2: Tech Gadgets */}
                      <div className="bg-zinc-50/80 p-1 rounded border border-zinc-100 flex items-center justify-between text-[7.5px]">
                        <div className="flex items-center gap-1 min-w-0">
                          <div className="w-4 h-4 rounded-md bg-blue-500 text-white flex items-center justify-center font-bold text-[7px] shrink-0">T</div>
                          <div className="truncate">
                            <span className="font-bold text-zinc-900 block truncate leading-tight">Tech Gadgets</span>
                            <span className="text-[6.5px] text-zinc-400">12,450 comments</span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 text-[7px] shrink-0">+180%</span>
                      </div>

                      {/* Client 3: Fitness Coach */}
                      <div className="bg-zinc-50/80 p-1 rounded border border-zinc-100 flex items-center justify-between text-[7.5px]">
                        <div className="flex items-center gap-1 min-w-0">
                          <div className="w-4 h-4 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-[7px] shrink-0">C</div>
                          <div className="truncate">
                            <span className="font-bold text-zinc-900 block truncate leading-tight">Fitness Coach</span>
                            <span className="text-[6.5px] text-zinc-400">8,920 comments</span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 text-[7px] shrink-0">+240%</span>
                      </div>

                      {/* Client 4: Food Brand */}
                      <div className="bg-zinc-50/80 p-1 rounded border border-zinc-100 flex items-center justify-between text-[7.5px]">
                        <div className="flex items-center gap-1 min-w-0">
                          <div className="w-4 h-4 rounded-md bg-orange-500 text-white flex items-center justify-center font-bold text-[7px] shrink-0">B</div>
                          <div className="truncate">
                            <span className="font-bold text-zinc-900 block truncate leading-tight">Food Brand</span>
                            <span className="text-[6.5px] text-zinc-400">15,670 comments</span>
                          </div>
                        </div>
                        <span className="font-bold text-emerald-600 text-[7px] shrink-0">+210%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-zinc-950">For Marketing Agencies</h3>
                    <p className="text-xs font-semibold text-emerald-600">Deliver full-coverage response systems for clients</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-5">
                  Manage YouTube comment pipelines for multiple client brands under one dashboard. Guarantee response coverage and prove attribution return with verified client conversion reporting.
                </p>

                {/* Bullet Points */}
                <ul className="space-y-2 text-xs text-zinc-700 mb-6 font-medium">
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Multi-tenant channel workspace management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Auditable client conversion reports</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>Brand voice customization per channel</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <Link
                href="/login"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
              >
                <span>Deploy for Agencies</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION: USE CASES / PROVEN AUTOMATION CAPABILITIES (MATCHING USER REFERENCE IMAGE) */}
      <section id="use-cases" className="py-24 bg-gradient-to-b from-white via-zinc-50/50 to-white border-t border-zinc-100 px-4 sm:px-6 scroll-mt-16 relative overflow-hidden">
        {/* Soft atmospheric gradient blur */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[360px] bg-gradient-to-tr from-purple-100/40 via-red-50/30 to-amber-50/30 blur-3xl pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto">
          {/* Section Header with Pill and Hand-Drawn Cursive Doodles */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20 relative">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-purple-200/80 bg-purple-50/70 text-purple-700 text-xs font-semibold mb-4 shadow-2xs">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>Use Cases</span>
            </div>

            {/* Main Section Headline */}
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-950 mb-4 leading-tight">
              Proven{" "}
              <span className="bg-gradient-to-r from-purple-600 via-red-500 to-amber-500 bg-clip-text text-transparent">
                Automation Capabilities
              </span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto">
              Engineered around YouTube algorithms and viewer behavior to maximize customer conversion and audience retention.
            </p>

            {/* Left Hand-Drawn Annotation: 'Clean comments...' */}
            <div className="hidden lg:flex flex-col items-center absolute -left-12 -top-2 select-none pointer-events-none transform -rotate-12 animate-float">
              <span className="font-cursive text-purple-600 font-bold text-lg tracking-wide">Clean comments...</span>
              <svg className="w-8 h-8 text-purple-500 -mt-1 ml-4" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M 10 5 C 10 25, 25 30, 22 35" />
                <path d="M 16 33 L 23 36 L 24 29" />
              </svg>
            </div>

            {/* Right Hand-Drawn Annotation: '...more leads and sales!' */}
            <div className="hidden lg:flex flex-col items-center absolute -right-12 -top-2 select-none pointer-events-none transform rotate-12 animate-float-reverse">
              <span className="font-cursive text-purple-600 font-bold text-lg tracking-wide">...more leads and sales!</span>
              <div className="flex items-center gap-1 -mt-1 mr-4">
                <div className="flex items-end gap-0.5 h-6">
                  <div className="w-1.5 h-2 bg-pink-200 rounded-xs" />
                  <div className="w-1.5 h-3.5 bg-pink-300 rounded-xs" />
                  <div className="w-1.5 h-5 bg-pink-400 rounded-xs" />
                </div>
                <svg className="w-7 h-7 text-purple-500" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M 8 30 C 15 10, 25 8, 30 18" />
                  <path d="M 24 16 L 31 18 L 29 25" />
                </svg>
              </div>
            </div>
          </div>

          {/* 3 Large Capability Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* CARD 1: Filter Negative & Spam Comments */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 p-6 flex flex-col justify-between group">
              <div>
                {/* Visual UI Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-4 mb-6 shadow-2xs relative">
                  {/* Floating Shield Doodle Tag */}
                  <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-md animate-pulse">
                    <Shield className="w-4 h-4 fill-white" />
                  </div>

                  {/* Header: Comments (1,248) + Spam Filter ON */}
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-200/60 text-[10px]">
                    <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                      <div className="w-3.5 h-3.5 bg-red-600 rounded flex items-center justify-center text-white">
                        <Play className="w-2 h-2 fill-white" />
                      </div>
                      <span>Comments (1,248)</span>
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-bold text-[8px] flex items-center gap-1 border border-red-200/70">
                      <ShieldAlert className="w-2.5 h-2.5 text-red-600" />
                      <span>Spam Filter ON</span>
                    </div>
                  </div>

                  {/* Filtered Comments Feed */}
                  <div className="space-y-2 text-[8.5px]">
                    {/* Item 1: WhatsApp Scam - BLOCKED */}
                    <div className="bg-white rounded-xl p-2 border border-zinc-200/80 flex items-start justify-between gap-2 shadow-2xs">
                      <div className="flex items-start gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-zinc-300 text-zinc-600 flex items-center justify-center font-bold text-[7px] shrink-0">
                          C
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-zinc-900 text-[8px]">@crypto_trader123</span>
                            <span className="text-[7px] text-zinc-400">1 hour ago</span>
                          </div>
                          <p className="text-[7.5px] text-zinc-600 leading-snug">
                            DM me on WhatsApp +91 9876543210 for free signals 🚀🚀
                          </p>
                        </div>
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-bold text-[7.5px] border border-red-200 flex items-center gap-0.5 shrink-0">
                        <Ban className="w-2 h-2" />
                        <span>Blocked</span>
                      </div>
                    </div>

                    {/* Item 2: Free Bitcoin Link - BLOCKED */}
                    <div className="bg-white rounded-xl p-2 border border-zinc-200/80 flex items-start justify-between gap-2 shadow-2xs">
                      <div className="flex items-start gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-zinc-300 text-zinc-600 flex items-center justify-center font-bold text-[7px] shrink-0">
                          F
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-zinc-900 text-[8px]">@freebitcoingiveaway</span>
                            <span className="text-[7px] text-zinc-400">2 hours ago</span>
                          </div>
                          <p className="text-[7.5px] text-zinc-600 leading-snug">
                            Click here for free BTC <span className="text-blue-500 underline">https://scam-link.com</span>
                          </p>
                        </div>
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-bold text-[7.5px] border border-red-200 flex items-center gap-0.5 shrink-0">
                        <Ban className="w-2 h-2" />
                        <span>Blocked</span>
                      </div>
                    </div>

                    {/* Item 3: Fake Video Hate Comment - BLOCKED */}
                    <div className="bg-white rounded-xl p-2 border border-zinc-200/80 flex items-start justify-between gap-2 shadow-2xs">
                      <div className="flex items-start gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-zinc-300 text-zinc-600 flex items-center justify-center font-bold text-[7px] shrink-0">
                          U
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-zinc-900 text-[8px]">@user834720</span>
                            <span className="text-[7px] text-zinc-400">3 hours ago</span>
                          </div>
                          <p className="text-[7.5px] text-zinc-600 leading-snug">
                            This video is fake and useless!!!
                          </p>
                        </div>
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-red-50 text-red-600 font-bold text-[7.5px] border border-red-200 flex items-center gap-0.5 shrink-0">
                        <Ban className="w-2 h-2" />
                        <span>Blocked</span>
                      </div>
                    </div>

                    {/* Item 4: Real Buyer Comment - ALLOWED */}
                    <div className="bg-emerald-50/70 rounded-xl p-2 border border-emerald-200/80 flex items-start justify-between gap-2 shadow-2xs">
                      <div className="flex items-start gap-1.5 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-[7px] shrink-0">
                          P
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-zinc-900 text-[8px]">@priya_sharma</span>
                            <span className="text-[7px] text-zinc-400">4 hours ago</span>
                          </div>
                          <p className="text-[7.5px] text-zinc-800 font-medium leading-snug">
                            Price kya hai? Where to buy? 🤩
                          </p>
                        </div>
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-[7.5px] flex items-center gap-0.5 shrink-0 shadow-2xs">
                        <Check className="w-2 h-2 stroke-[3]" />
                        <span>Allowed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-xs">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-zinc-950">Filter Negative & Spam Comments</h3>
                    <p className="text-xs font-semibold text-pink-600">Protect your customers and brand reputation</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Crypto bots, WhatsApp scams, and malicious links erode trust. BigRedHub identifies spam patterns and negative comments, withholding replies so toxic remarks never receive links or creator hearts.
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="p-3 rounded-2xl bg-pink-50/70 border border-pink-200/70 flex items-center gap-2.5 text-xs font-bold text-pink-900">
                <div className="w-6 h-6 rounded-lg bg-pink-500 text-white flex items-center justify-center shrink-0">
                  <Ban className="w-3.5 h-3.5" />
                </div>
                <span>Zero links dispatched to toxic comments</span>
              </div>
            </div>


            {/* CARD 2: 1-Click Smart Replies */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 p-6 flex flex-col justify-between group">
              <div>
                {/* Visual UI Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-4 mb-6 shadow-2xs relative">
                  {/* Floating Send / Paper Plane Icon Doodle */}
                  <div className="absolute top-12 right-2 w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-md animate-bounce">
                    <Send className="w-4 h-4 text-white" />
                  </div>

                  {/* Top Viewer Inquiry Bubble */}
                  <div className="bg-white rounded-2xl border border-zinc-200/80 p-3 shadow-2xs mb-3 max-w-[85%]">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-[8px]">N</div>
                      <span className="font-bold text-zinc-900 text-[8.5px]">@neha_singh</span>
                      <span className="text-[7.5px] text-zinc-400">10 minutes ago</span>
                    </div>
                    <p className="text-[9px] text-zinc-800 font-medium mb-1.5">
                      Is this available on Amazon?
                    </p>
                    <div className="flex items-center gap-2 text-zinc-400 text-[8px]">
                      <span className="flex items-center gap-0.5"><ThumbsUp className="w-2.5 h-2.5" /></span>
                      <span className="flex items-center gap-0.5"><ThumbsDown className="w-2.5 h-2.5" /></span>
                      <span className="font-semibold text-zinc-600">Reply</span>
                    </div>
                  </div>

                  {/* AI Suggested Reply Box with 1-Click Action */}
                  <div className="bg-white rounded-2xl border border-purple-200 p-3 shadow-sm">
                    {/* Bar: AI Suggested Reply + 1-Click Reply Pill */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100">
                      <span className="text-[8.5px] font-bold text-zinc-700 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" /> AI Suggested Reply
                      </span>
                      <div className="px-2 py-0.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[8px] flex items-center gap-1 shadow-2xs cursor-pointer hover:opacity-95 transition-opacity">
                        <Sparkles className="w-2 h-2" />
                        <span>1-Click Reply</span>
                      </div>
                    </div>

                    {/* Reply Text with Copy Icon */}
                    <div className="text-[8.5px] text-zinc-700 relative pr-5 mb-2 leading-snug">
                      <p>
                        Hi Neha! 👋 Yes, this is available on Amazon. You can check it here:{" "}
                        <span className="text-blue-600 font-semibold underline">https://amzn.to/abc123</span>
                      </p>
                      <button className="absolute top-0 right-0 text-zinc-400 hover:text-zinc-600">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Reply Modifiers Toolbar */}
                    <div className="flex items-center gap-2 pt-1 border-t border-zinc-100 text-[7.5px] text-zinc-500 font-medium">
                      <button className="hover:text-purple-600 flex items-center gap-0.5">
                        <ChevronRight className="w-2 h-2" /> Shorter
                      </button>
                      <span className="text-zinc-200">|</span>
                      <button className="hover:text-purple-600 flex items-center gap-0.5">
                        <Sparkles className="w-2 h-2" /> Friendlier
                      </button>
                      <span className="text-zinc-200">|</span>
                      <button className="hover:text-purple-600 flex items-center gap-0.5">
                        <Smile className="w-2 h-2" /> Add Emoji
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-zinc-950">1-Click Smart Replies</h3>
                    <p className="text-xs font-semibold text-purple-600">Save 80% of time spent answering comments</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Manage all incoming comments from a central three-panel inbox. Approve suggested answers with one click, or configure autopilot rules to reply within seconds while viewers remain on YouTube.
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/70 flex items-center gap-2.5 text-xs font-bold text-purple-900">
                <div className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span>Sub-2-second response latency window</span>
              </div>
            </div>


            {/* CARD 3: Comment Lead Funnels (Like ManyChat) */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 shadow-sm hover:shadow-xl hover:border-pink-300 transition-all duration-300 p-6 flex flex-col justify-between group">
              <div>
                {/* Visual UI Mockup Box */}
                <div className="bg-zinc-50/80 rounded-2xl border border-zinc-200/70 p-4 mb-6 shadow-2xs">
                  {/* Split Grid: Left Comment-Reply + Right ManyChat Flow Pipeline */}
                  <div className="grid grid-cols-12 gap-2.5">
                    {/* Left Sub-Column (7 cols): Comment + Reply Flow */}
                    <div className="col-span-7 space-y-2">
                      {/* User Trigger Comment */}
                      <div className="bg-white rounded-xl p-2 border border-zinc-200/80 shadow-2xs">
                        <div className="flex items-center gap-1 mb-0.5">
                          <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[7px]">R</div>
                          <span className="font-bold text-zinc-900 text-[7.5px]">@rohit_verma</span>
                          <span className="text-[6.5px] text-zinc-400">2 hours ago</span>
                        </div>
                        <p className="text-[8px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded inline-block mb-1">
                          LINK
                        </p>
                        <div className="flex items-center gap-1.5 text-zinc-400 text-[7px]">
                          <span><ThumbsUp className="w-2 h-2" /></span>
                          <span><ThumbsDown className="w-2 h-2" /></span>
                          <span className="font-semibold text-zinc-600">Reply</span>
                        </div>
                      </div>

                      {/* Directional Curved Connector Arrow */}
                      <div className="flex justify-center -my-1 text-pink-500">
                        <ChevronDown className="w-3 h-3 animate-bounce" />
                      </div>

                      {/* Automated BigRedHub Funnel Delivery */}
                      <div className="bg-white rounded-xl p-2 border border-zinc-200/80 shadow-2xs">
                        <div className="flex items-center gap-1 mb-1">
                          <div className="w-3 h-3 bg-red-600 rounded flex items-center justify-center text-white">
                            <Play className="w-1.5 h-1.5 fill-white" />
                          </div>
                          <span className="font-bold text-zinc-900 text-[7.5px]">BigRedHub</span>
                          <span className="text-[6.5px] text-zinc-400">2 hours ago</span>
                        </div>
                        <p className="text-[7.5px] text-zinc-700 font-medium mb-1">
                          Here is your link! 🔗<br />
                          Get 50% OFF here:
                        </p>
                        <div className="bg-purple-50 text-purple-700 text-[7.5px] font-bold p-1 rounded flex items-center justify-between border border-purple-200/60">
                          <span className="truncate">https://bigredhub.info/l/abc123</span>
                          <Copy className="w-2 h-2 shrink-0 ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Right Sub-Column (5 cols): 4-Stage Vertical Funnel */}
                    <div className="col-span-5 flex flex-col justify-between py-0.5 space-y-1.5 text-[7px] font-bold">
                      {/* Step 1: Keyword Trigger */}
                      <div className="bg-white p-1 rounded-lg border border-purple-200 shadow-2xs flex items-center gap-1">
                        <div className="w-4 h-4 rounded bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Tag className="w-2.5 h-2.5" />
                        </div>
                        <div className="leading-tight truncate">
                          <span className="text-zinc-900 block truncate text-[6.5px]">Comment Keyword</span>
                          <span className="text-purple-600 text-[6px]">&quot;LINK&quot;, &quot;GUIDE&quot;</span>
                        </div>
                      </div>

                      <div className="flex justify-center -my-1 text-zinc-300">
                        <ChevronDown className="w-2.5 h-2.5" />
                      </div>

                      {/* Step 2: Auto Reply Tracked Link */}
                      <div className="bg-white p-1 rounded-lg border border-pink-200 shadow-2xs flex items-center gap-1">
                        <div className="w-4 h-4 rounded bg-pink-500 text-white flex items-center justify-center shrink-0">
                          <Send className="w-2.5 h-2.5" />
                        </div>
                        <div className="leading-tight truncate">
                          <span className="text-zinc-900 block truncate text-[6.5px]">Auto Reply</span>
                          <span className="text-pink-600 text-[6px]">Tracked Link</span>
                        </div>
                      </div>

                      <div className="flex justify-center -my-1 text-zinc-300">
                        <ChevronDown className="w-2.5 h-2.5" />
                      </div>

                      {/* Step 3: User Clicks & Visits */}
                      <div className="bg-white p-1 rounded-lg border border-rose-200 shadow-2xs flex items-center gap-1">
                        <div className="w-4 h-4 rounded bg-rose-500 text-white flex items-center justify-center shrink-0">
                          <ShoppingCart className="w-2.5 h-2.5" />
                        </div>
                        <div className="leading-tight truncate">
                          <span className="text-zinc-900 block truncate text-[6.5px]">User Clicks</span>
                          <span className="text-rose-600 text-[6px]">& Visits Cart</span>
                        </div>
                      </div>

                      <div className="flex justify-center -my-1 text-zinc-300">
                        <ChevronDown className="w-2.5 h-2.5" />
                      </div>

                      {/* Step 4: Track Leads & Sales */}
                      <div className="bg-white p-1 rounded-lg border border-emerald-200 shadow-2xs flex items-center gap-1">
                        <div className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <BarChart3 className="w-2.5 h-2.5" />
                        </div>
                        <div className="leading-tight truncate">
                          <span className="text-zinc-900 block truncate text-[6.5px]">Track Leads</span>
                          <span className="text-emerald-600 text-[6px]">& Sales in CRM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Icon & Title */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-xs">
                    <Filter className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-zinc-950">Comment Lead Funnels (Like ManyChat)</h3>
                    <p className="text-xs font-semibold text-pink-600">Turn viewer comments into automated lead funnels</p>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                  Ask viewers to comment &quot;LINK&quot;, &quot;GUIDE&quot;, or &quot;DEAL&quot;. BigRedHub recognizes the keyword trigger, replies with an attributed shortlink, and tracks conversion events through to checkout.
                </p>
              </div>

              {/* Bottom Feature Pill */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 flex items-center gap-2.5 text-xs font-bold text-emerald-900">
                <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <span>Full-funnel attribution from comment to sale</span>
              </div>
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
