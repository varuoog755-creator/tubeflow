import Link from "next/link";
import { Video, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy — TubeFlow",
  description: "TubeFlow privacy policy, data practices, and YouTube API compliance.",
};

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
          <p className="text-slate-500">Effective Date: October 8, 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            When you connect your YouTube account through Google OAuth, TubeFlow collects your channel identifier, channel title, subscriber and view statistics, and your authenticated email address.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">2. Use of YouTube API Data</h2>
          <p>
            TubeFlow uses official YouTube Data API v3 services to poll comments on your published videos and post authorized automated replies based on rules configured in your dashboard.
          </p>
          <p>
            Our use and transfer of information received from Google APIs adhere to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 underline hover:text-red-300"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">3. Data Retention and Deletion</h2>
          <p>
            You can disconnect your channel at any time from your TubeFlow Settings tab or revoke access via your Google Security settings. Upon disconnection, stored access and refresh tokens are permanently purged.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-white">4. Contact Information</h2>
          <p>
            For privacy inquiries or data requests, contact us at <span className="font-mono text-white">varuoog755@gmail.com</span>.
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        © 2026 TubeFlow. All rights reserved.
      </footer>
    </div>
  );
}
