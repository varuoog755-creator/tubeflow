"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Video,
  ArrowRight,
  ShieldCheck,
  Check,
  Lock,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const errorParam = searchParams.get("auth_error") || searchParams.get("error");

  useEffect(() => {
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
    window.location.href = "/api/auth/google?mode=login";
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white font-sans">
      {/* Minimal Header */}
      <header className="px-6 py-5 border-b border-zinc-900 bg-black/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Video className="w-4 h-4 text-red-500" />
            </div>
            <span className="font-semibold text-base tracking-tight text-white">TubeFlow</span>
          </Link>

          <Link
            href="/"
            className="text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800">
            {/* Header info */}
            <div className="mb-8">
              <h1 className="text-xl font-semibold text-white tracking-tight">
                Sign in to TubeFlow
              </h1>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                Connect your YouTube channel to monitor buyer intent and automate instant replies.
              </p>
            </div>

            {/* Logged out notice */}
            {searchParams.get("logged_out") && (
              <div className="mb-5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You have been signed out successfully.</span>
              </div>
            )}

            {/* Error banner if redirected with error */}
            {errorParam && (
              <div className="mb-5 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs">
                <span className="font-semibold text-white block mb-0.5">Authentication Note</span>
                <p className="text-zinc-400 text-[11px]">
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
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs flex items-center justify-center gap-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {/* Official Google G Logo SVG */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 ml-auto" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 pt-1">
                <Lock className="w-3 h-3 text-zinc-400" />
                <span>Encrypted OAuth2 session</span>
              </div>
            </div>

            {/* Feature bullets */}
            <div className="mt-8 pt-6 border-t border-zinc-900 space-y-2.5">
              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-2">
                Included with account
              </span>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Sub-2s automated replies</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Intent & commercial keyword filters</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>Official YouTube API compliance</span>
              </div>
            </div>
          </div>

          {/* Legal / Policy Footer */}
          <div className="mt-6 text-center text-[11px] text-zinc-500 space-x-2">
            <span>By continuing, you accept our</span>
            <Link href="/terms" className="text-zinc-400 hover:text-white underline">
              Terms
            </Link>
            <span>&</span>
            <Link href="/privacy" className="text-zinc-400 hover:text-white underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="px-6 py-4 border-t border-zinc-900 text-center text-xs text-zinc-600">
        © {new Date().getFullYear()} TubeFlow. YouTube is a trademark of Google LLC.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 text-xs">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
