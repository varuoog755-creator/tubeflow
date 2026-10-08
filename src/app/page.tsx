import Link from "next/link";
import { MessageSquare, Zap, ShieldCheck, Heart, ArrowRight, CheckCircle2, Video } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-lg text-white">
              <Video className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">TubeFlow</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400 font-medium">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-red-600/20"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-6 pt-24 pb-20 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-semibold mb-8 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" /> Built for YouTube Shorts & Video Creators
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none mb-6">
            Turn YouTube comments into{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-400">
              instant leads & revenue
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-400 leading-relaxed mb-10">
            Tell viewers &quot;Comment LINK for the guide&quot;. TubeFlow detects keywords in seconds, auto-replies with your resource or affiliate links, hearts the comment, and boosts algorithm engagement on autopilot.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-2"
            >
              Connect Your Channel Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <MessageSquare className="w-6 h-6 text-red-500 mb-4" />
              <h3 className="font-semibold text-lg text-white mb-2">Keyword Triggered Replies</h3>
              <p className="text-sm text-slate-400">
                Trigger instant link replies when viewers write &quot;LINK&quot;, &quot;PDF&quot;, &quot;NOTES&quot;, or custom keywords.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <Heart className="w-6 h-6 text-rose-500 mb-4" />
              <h3 className="font-semibold text-lg text-white mb-2">Auto-Heart & Like</h3>
              <p className="text-sm text-slate-400">
                Instantly give creator hearts and likes to good comments to skyrocket viewer loyalty and reach.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-500 mb-4" />
              <h3 className="font-semibold text-lg text-white mb-2">Spam & Competitor Filter</h3>
              <p className="text-sm text-slate-400">
                Keep comments clean by filtering spam links, bot promotions, and competitor attacks.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison / How It Works */}
        <section id="features" className="py-20 border-t border-slate-800 bg-slate-900/30 px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works in 3 Steps</h2>
            <p className="text-slate-400">Set up once, run indefinitely without touching your dashboard again.</p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-start gap-4 p-6 rounded-xl border border-slate-800/80 bg-slate-950">
              <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-sm">1</div>
              <h4 className="font-semibold text-white">Connect Channel</h4>
              <p className="text-sm text-slate-400">One-click Google verification with secure official YouTube Data API permissions.</p>
            </div>

            <div className="flex flex-col items-start gap-4 p-6 rounded-xl border border-slate-800/80 bg-slate-950">
              <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-sm">2</div>
              <h4 className="font-semibold text-white">Define Rules</h4>
              <p className="text-sm text-slate-400">Pick keyword triggers (e.g., &quot;CODE&quot;) and your target download or affiliate link.</p>
            </div>

            <div className="flex flex-col items-start gap-4 p-6 rounded-xl border border-slate-800/80 bg-slate-950">
              <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-sm">3</div>
              <h4 className="font-semibold text-white">Collect Conversions</h4>
              <p className="text-sm text-slate-400">Viewers comment, TubeFlow replies with rotating links, driving high conversion traffic.</p>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 border-t border-slate-800 px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-slate-400">Everything you need to automate your YouTube comments.</p>
          </div>

          <div className="max-w-md mx-auto rounded-2xl border border-red-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-xl text-white">Creator Pro</h3>
                <p className="text-sm text-slate-400">For serious YouTube & Shorts creators</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                POPULAR
              </span>
            </div>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-white">$15</span>
              <span className="text-slate-400 text-sm">/month</span>
            </div>

            <ul className="space-y-3.5 mb-8 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Unlimited Keyword Auto-Replies
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Auto-Heart & Auto-Like Engagement
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Spintax Link Variations (Anti-Spam)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Detailed Conversion & Reply Logs
              </li>
            </ul>

            <Link
              href="/dashboard"
              className="block w-full py-3 text-center rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition-colors"
            >
              Start 7-Day Free Trial
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        <p>© 2026 TubeFlow. All rights reserved. Not affiliated with Google or YouTube.</p>
      </footer>
    </div>
  );
}
