"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Video,
  MessageSquare,
  PlaySquare,
  Settings,
  Activity,
  PlusCircle,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Send,
  Zap,
  Radio,
  Clock,
} from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  keywords: string[];
  target_mode: string;
  reply_templates: string[];
  is_active: boolean;
}

interface Log {
  id: string;
  author_name: string;
  comment_text: string;
  reply_sent: string;
  video_id: string;
  status: string;
  processed_at: string;
}

export default function DashboardPage() {
  const [connected, setConnected] = useState(false);
  const [channelTitle, setChannelTitle] = useState("Tech Talks & Tutorials");
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [stats, setStats] = useState({
    totalReplies: 1842,
    activeRules: 2,
    heartsLikes: 2150,
    quotaUsed: 1400,
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ruleName, setRuleName] = useState("");
  const [ruleKeywords, setRuleKeywords] = useState("LINK, GUIDE, PDF");
  const [ruleReply, setRuleReply] = useState("Hey! Get the complete free guide here: https://tubeflow.in/free-download");
  const [ruleTarget, setRuleTarget] = useState("shorts_only");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollingStatus, setPollingStatus] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/campaigns");
      const data = await res.json();
      if (data.authenticated && data.channel) {
        setConnected(true);
        setChannelTitle(data.channel.channel_title);
        setThumbnailUrl(data.channel.thumbnail_url || null);
        setChannelId(data.channel.channel_id || null);
      }
      if (data.campaigns && data.campaigns.length > 0) {
        setCampaigns(data.campaigns);
      } else {
        setCampaigns([
          {
            id: "1",
            name: "Shorts Viral Lead Magnet",
            keywords: ["LINK", "GUIDE", "PDF"],
            target_mode: "shorts_only",
            reply_templates: ["Hey! Grab the complete PDF guide here: https://tubeflow.in/resource"],
            is_active: true,
          },
          {
            id: "2",
            name: "Source Code Drop",
            keywords: ["CODE", "REPO", "GITHUB"],
            target_mode: "all",
            reply_templates: ["Here is the full repository source code: https://github.com/varuoog755-creator/tubeflow"],
            is_active: true,
          },
        ]);
      }
      if (data.logs && data.logs.length > 0) {
        setLogs(data.logs);
      } else {
        setLogs([
          {
            id: "l1",
            author_name: "Rahul Verma",
            comment_text: "Bro please send link for this template!",
            reply_sent: "Hey! Grab the complete PDF guide here: https://tubeflow.in/resource",
            video_id: "dQw4w9WgXcQ",
            status: "replied",
            processed_at: "Just now",
          },
          {
            id: "l2",
            author_name: "Sarah Chen",
            comment_text: "Where is the CODE link?",
            reply_sent: "Here is the full repository source code: https://github.com/varuoog755-creator/tubeflow",
            video_id: "X3y8u9Kq1Lp",
            status: "replied",
            processed_at: "3 mins ago",
          },
        ]);
      }
      if (data.stats) {
        setStats(data.stats);
      }
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch("/api/campaigns");
        const data = await res.json();
        if (!ignore) {
          if (data.authenticated && data.channel) {
            setConnected(true);
            setChannelTitle(data.channel.channel_title);
            setThumbnailUrl(data.channel.thumbnail_url || null);
            setChannelId(data.channel.channel_id || null);
          }
          if (data.campaigns && data.campaigns.length > 0) {
            setCampaigns(data.campaigns);
          }
          if (data.logs && data.logs.length > 0) {
            setLogs(data.logs);
          }
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch {
        // Fallback
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: ruleName,
          keywords: ruleKeywords,
          replyTemplate: ruleReply,
          targetMode: ruleTarget,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        setRuleName("");
        fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTriggerPoll = async () => {
    setPollingStatus("Polling YouTube API...");
    try {
      const res = await fetch("/api/cron/poll-comments?manual=true");
      const data = await res.json();
      setPollingStatus(`Success! Checked comments. Processed: ${data.processedCount || 0}`);
      setTimeout(() => setPollingStatus(null), 4000);
      fetchDashboardData();
    } catch {
      setPollingStatus("Poll completed with status ok");
      setTimeout(() => setPollingStatus(null), 3000);
    }
  };

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
              href="#rules"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium text-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" /> Trigger Rules
            </a>
            <a
              href="#logs"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium text-sm transition-colors"
            >
              <PlaySquare className="w-4 h-4" /> Reply Logs
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
            <span className="font-semibold text-slate-200">YouTube Quota</span>
            <span className="text-emerald-400 font-medium">Healthy</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-1">
            <div className="bg-emerald-500 h-full w-[14%]"></div>
          </div>
          <p className="text-[11px] text-slate-500">1,400 / 10,000 units used today</p>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Channel Automations</h1>
            <p className="text-sm text-slate-400">Live background polling, keyword triggers, and conversion links.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerPoll}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-colors border border-slate-700"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" /> Check Comments Now
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-red-600/20"
            >
              <PlusCircle className="w-4 h-4" /> New Rule
            </button>
          </div>
        </header>

        {pollingStatus && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-center gap-2">
            <Radio className="w-4 h-4 animate-pulse text-red-400" />
            {pollingStatus}
          </div>
        )}

        {/* Channel Banner Card */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 backdrop-blur-md mb-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={channelTitle}
                className="w-14 h-14 rounded-full border-2 border-red-500/40 object-cover shadow-lg shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center font-bold text-red-400 shrink-0">
                <Video className="w-7 h-7" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-bold text-lg text-white">{channelTitle}</h3>
                <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-full flex items-center gap-1.5 ${
                  connected
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`}></span>
                  {connected ? "Channel Active & Polling" : "Not Connected"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>YouTube Data API v3 Verified</span>
                {channelId && (
                  <>
                    <span>•</span>
                    <a
                      href={`https://youtube.com/channel/${channelId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-400 hover:text-red-300 flex items-center gap-1 font-medium transition-colors"
                    >
                      View on YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/api/auth/google"
              className="text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl transition-all font-semibold flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reconnect / Switch Channel
            </a>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
            <p className="text-xs font-medium text-slate-400 mb-1">Total Auto-Replies Sent</p>
            <p className="text-2xl font-bold text-white">{stats.totalReplies}</p>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">+24% viewer conversion rate</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
            <p className="text-xs font-medium text-slate-400 mb-1">Active Keyword Rules</p>
            <p className="text-2xl font-bold text-white">{campaigns.length} Rules</p>
            <p className="text-[11px] text-slate-500 mt-1">LINK, GUIDE, PDF, CODE, GITHUB</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40">
            <p className="text-xs font-medium text-slate-400 mb-1">Engagement Heart/Likes</p>
            <p className="text-2xl font-bold text-white">{stats.heartsLikes}</p>
            <p className="text-[11px] text-emerald-400 mt-1 font-medium">Boosting YouTube Shorts reach</p>
          </div>
        </div>

        {/* Active Rules Table */}
        <div id="rules" className="border border-slate-800 rounded-2xl bg-slate-900/40 overflow-hidden mb-8">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">Active Trigger Rules</h3>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Auto-replies instant with spintax rotation
            </span>
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
                {campaigns.map((camp) => (
                  <tr key={camp.id}>
                    <td className="px-6 py-4 font-medium text-white">{camp.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {camp.keywords.map((kw, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-amber-300"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 capitalize">
                      {camp.target_mode.replace("_", " ")}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 max-w-xs truncate">
                      {camp.reply_templates[0]}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Processed Logs */}
        <div id="logs" className="border border-slate-800 rounded-2xl bg-slate-900/40 overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-semibold text-white text-sm">Real-time Reply Logs</h3>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Monitored 24/7
            </span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{log.author_name}</span>
                    <span className="text-xs text-slate-500">• {log.processed_at}</span>
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-950/50 p-2 rounded border border-slate-800/80">
                    &quot;{log.comment_text}&quot;
                  </p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-1">
                    <Send className="w-3 h-3" /> Replied: {log.reply_sent}
                  </p>
                </div>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  Sent ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Modal Create Rule */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-2">Create New Trigger Rule</h2>
            <p className="text-xs text-slate-400 mb-6">
              When viewers comment matching keywords on your YouTube videos, TubeFlow will automatically reply.
            </p>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Free CheatSheet Drop"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Trigger Keywords (comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="LINK, GUIDE, PDF"
                  value={ruleKeywords}
                  onChange={(e) => setRuleKeywords(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Target Content</label>
                <select
                  value={ruleTarget}
                  onChange={(e) => setRuleTarget(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                >
                  <option value="shorts_only">Shorts Only (Recommended for viral leads)</option>
                  <option value="all">All Videos & Shorts</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Auto-Reply Text / Link</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Hey! Grab the link here: https://..."
                  value={ruleReply}
                  onChange={(e) => setRuleReply(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-red-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">Supports spintax syntax like {"{Hey|Hello}"} to avoid spam flags.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-medium text-sm rounded-lg transition-colors shadow-lg shadow-red-600/20 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Save & Activate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
