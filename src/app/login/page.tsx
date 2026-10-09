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
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col justify-between selection:bg-red-100 selection:text-red-700 font-sans">
      {/* Header */}
      <header className="px-6 py-5 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20">
              <Video className="w-4 h-4 fill-white" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight text-zinc-950">
              Tube<span className="text-red-600">Flow</span>
            </span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="p-8 rounded-3xl bg-white border border-zinc-200/90 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            {/* Header info */}
            <div className="mb-7">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
                <Video className="w-5 h-5 fill-red-600" />
              </div>
              <h1 className="text-xl font-heading font-bold text-zinc-950 tracking-tight">
                Sign in to TubeFlow
              </h1>
              <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed">
                Connect your YouTube channel to monitor buyer intent and deliver trackable links.
              </p>
            </div>

            {/* Logged out notice */}
            {searchParams.get("logged_out") && (
              <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You signed out successfully.</span>
              </div>
            )}

            {/* Error banner if redirected with error */}
            {errorParam && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                <span className="font-semibold text-red-950 block mb-0.5">Authentication Note</span>
                <p className="text-red-700 text-[11px]">
                  {errorParam === "access_denied"
                    ? "YouTube permissions were not granted. Approve YouTube access to connect your channel."
                    : `Google Sign-In failed (${errorParam}). Try again.`}
                </p>
              </div>
            )}

            {/* Google Login Button */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loggingIn || checkingAuth}
                className="w-full py-3 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold text-xs flex items-center justify-center gap-2.5 transition-all shadow-md shadow-zinc-950/10 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {/* Official Google G Logo SVG */}
                <svg className="w-4 h-4 shrink-0 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
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
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 ml-auto" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-600 pt-1">
                <Lock className="w-3 h-3 text-zinc-600" />
                <span>Encrypted Google OAuth2 session</span>
              </div>

          </a>
            </div>

            {/* Feature bullets */}
            <div className="mt-8 pt-6 border-t border-zinc-100 space-y-2.5">
              <span className="text-[11px] font-semibold text-zinc-600 uppercase tracking-wider block mb-2">
                Included with account
              </span>
              <div className="flex items-center gap-2 text-xs text-zinc-700">
                <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Rule-based comment reply automation</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-700">
                <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Intent and commercial keyword filters</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-700">
                <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Official YouTube API compliance</span>
              </div>
            </div>
          </div>

          {/* Legal Footer */}
          <div className="mt-6 text-center text-[11px] text-zinc-600 space-x-2">
            <span>By continuing, you accept our</span>
            <Link href="/" className="text-zinc-700 hover:text-zinc-950 underline">
              Terms
            </Link>
            <span>&</span>
            <Link href="/" className="text-zinc-700 hover:text-zinc-950 underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="px-6 py-4 border-t border-zinc-100 text-center text-xs text-zinc-600 bg-zinc-50/50">
        © {new Date().getFullYear()} TubeFlow. YouTube is a trademark of Google LLC.
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-xs text-zinc-600">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
