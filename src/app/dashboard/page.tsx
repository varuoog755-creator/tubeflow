import Link from "next/link";
import { Video, MessageSquare, PlaySquare, Settings, Activity, PlusCircle, CheckCircle, ExternalLink } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-red-600 p-2 rounded-lg text-white">
              <Video className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">TubeFlow</span>
          </Link>

          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-red-600/10 text-red-400 font-medium text-sm border border-red-500/20"
            >
              <Activity className="w-4 h-4" /> Overview
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium text-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Automations
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium text-sm transition-colors"
            >
              <PlaySquare className="w-4 h-4" /> Videos & Shorts
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium text-sm transition-colors"
            >
              <Settings className="w-4 h-4" /> Settings
            </a>
          </nav>
        </div>

        <div className="p-4 rounded-xl border border-slate-800 bg-slate-950 text-xs text-slate-400">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-200">YouTube API Quota</span>
            <span className="text-emerald-400 font-medium">Healthy</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-emerald-500 h-full w-[14%]"></div>
          </div>
          <p className="text-[11px] text-slate-500">1,400 / 10,000 units used today</p>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Channel Automations</h1>
            <p className="text-sm text-slate-400">Manage auto-replies, keyword triggers, and engagement rules.</p>
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-red-600/20">
            <PlusCircle className="w-4 h-4" /> Create Campaign
          </button>
        </header>

        {/* Channel Banner Card */}
        <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center font-bold text-red-400">
              TF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white">Tech Talks & Tutorials</h3>
                <span className="px-2 py-0.5 text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Connected
                </span>
              </div>
              <p className="text-xs text-slate-400">Channel ID: UC_x4kY8o...</p>
            </div>
          </div>

          <button className="text-xs text-slate-400 hover:text-white border border-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
            Switch Channel <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
            <p className="text-xs font-medium text-slate-400 mb-1">Total Auto-Replies Sent</p>
            <p className="text-2xl font-bold text-white">1,842</p>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">+18% from last week</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
            <p className="text-xs font-medium text-slate-400 mb-1">Keywords Triggered</p>
            <p className="text-2xl font-bold text-white">4 Active</p>
            <p className="text-[11px] text-slate-500 mt-1">LINK, PDF, CODE, TEMPLATE</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
            <p className="text-xs font-medium text-slate-400 mb-1">Hearts & Likes Given</p>
            <p className="text-2xl font-bold text-white">2,150</p>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">Boosting algorithm score</p>
          </div>
        </div>

        {/* Active Campaigns Table */}
        <div className="border border-slate-800 rounded-2xl bg-slate-900/40 overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">Active Trigger Rules</h3>
            <span className="text-xs text-slate-400">Auto-polls every 3 minutes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 font-medium">Rule Name</th>
                  <th className="px-6 py-3 font-medium">Keywords</th>
                  <th className="px-6 py-3 font-medium">Target</th>
                  <th className="px-6 py-3 font-medium">Auto-Reply Text</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="px-6 py-4 font-medium text-white">Shorts Free Guide</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-mono text-amber-300">LINK, GUIDE</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">Shorts Only</td>
                  <td className="px-6 py-4 text-xs text-slate-300 max-w-xs truncate">
                    Hey! Grab the complete PDF breakdown here: https://...
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium text-white">Source Code Drop</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-mono text-amber-300">CODE, REPO</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">All Videos</td>
                  <td className="px-6 py-4 text-xs text-slate-300 max-w-xs truncate">
                    Here is the Github repository link for this project: https://...
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
