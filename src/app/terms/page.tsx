import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms of Service — TubeFlow",
  description: "TubeFlow terms of service and acceptable use guidelines.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/60 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black">
              TF
            </div>
            <span className="font-extrabold text-lg text-white">TubeFlow</span>
          </Link>
          <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto p-6 md:p-12 space-y-8 text-xs sm:text-sm leading-relaxed text-slate-300">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white">Terms of Service</h1>
          <p className="text-slate-500">Effective Date: October 8, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or using TubeFlow, you agree to comply with and be bound by these Terms of Service and all applicable laws and regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. YouTube Community Guidelines Compliance</h2>
          <p>
            Users are strictly prohibited from configuring repetitive spam triggers, malicious URLs, deceptive redirect loops, or harassment templates. All automated comments must comply with YouTube Community Guidelines and Google Developer Policies.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Limitation of Liability</h2>
          <p>
            TubeFlow is an independent productivity software suite and is not affiliated with or endorsed by YouTube or Google LLC. Users are solely responsible for compliance with YouTube platform policies on their channels.
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        © 2026 TubeFlow. All rights reserved.
      </footer>
    </div>
  );
}
