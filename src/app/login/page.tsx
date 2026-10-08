"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Video,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Sparkles,
  TrendingUp,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const errorParam = searchParams.get("auth_error") || searchParams.get("error");

  useEffect(() => {
    // If user is already authenticated, redirect straight to dashboard
    fetch("/api/auth/me")
      .then((res) => {
        if (res.ok) {
          router.replace("/dashboard");
        } else {
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        setCheckingAuth(false);
      });
  }, [router]);

  const handleGoogleLogin = () => {
    setLoggingIn(true);
    // Redirect directly to Google OAuth initiation for user login
    window.location.href = "/api/auth/google?mode=login";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-red-500 selection:text-white">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-red-600/10 blur-[160px] rounded-full" />
        <div className="absolute -bottom-20 right-10 w-[500px] h-[300px] bg-rose-600/10 blur-[140px] rounded-full" />
      </div>

      {/* Header / Brand */}
      <header className="relative z-10 px-6 py-6 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-105 transition-all">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                TubeFlow <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 font-bold">Pro</span>
              </span>
              <span className="text-[11px] text-slate-400 -mt-1 font-medium">YouTube Intent & Sales Automation</span>
            </div>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-black/80 backdrop-blur-xl">
            {/* Header info */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> High-Intent Comment Automation
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome to TubeFlow
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Connect your YouTube channel to monitor buyer intent and automate instant replies.
              </p>
            </div>

            {/* Logged out notice */}
            {searchParams.get("logged_out") && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>You have been signed out successfully.</span>
              </div>
            )}

            {/* Error banner if redirected with error */}
            {errorParam && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-red-400" /> Authentication Notice
                </p>
                <p className="mt-1 text-slate-300">
                  {errorParam === "access_denied"
                    ? "YouTube permissions were not granted. Please approve YouTube access to connect your channel."
                    : `Could not complete Google Sign-In (${errorParam}). Please try again.`}
                </p>
              </div>
            )}

            {/* Google Login Button */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loggingIn || checkingAuth}
                className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-2xl shadow-white/10 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
              >
                {/* Official Google G Logo SVG */}
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
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
                <span>
                  {loggingIn
                    ? "Connecting to Google..."
                    : checkingAuth
                    ? "Checking session..."
                    : "Continue with Google"}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 transition-transform ml-auto" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium pt-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bank-grade 256-bit encrypted authentication</span>
              </div>
            </div>

            {/* Benefit Bullets */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Included with your account:
              </span>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>24/7 high-intent comment detection (EN, Hindi, Hinglish)</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Instant automated replies with tracked click-through links</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Competitor intel tracking & conversion analytics</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>100% compliant with YouTube API Services Policies</span>
                </li>
              </ul>
            </div>

            {/* YouTube compliance statement */}
            <div className="mt-6 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                <span>Official YouTube API Verification</span>
              </div>
              TubeFlow accesses your channel strictly to monitor comments and send automated responses according to rules you configure. We never publish videos or store channel passwords.
            </div>
          </div>

          {/* Legal / Policy Footer */}
          <div className="mt-6 text-center text-xs text-slate-400 space-x-4">
            <span>By signing in, you accept our</span>
            <Link href="/terms" className="text-slate-300 hover:text-white underline">
              Terms
            </Link>
            <span>&</span>
            <Link href="/privacy" className="text-slate-300 hover:text-white underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 px-6 py-4 border-t border-slate-800/60 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} TubeFlow. All rights reserved. YouTube is a registered trademark of Google LLC.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
