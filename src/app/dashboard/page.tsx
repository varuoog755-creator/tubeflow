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
  TrendingUp,
  Users,
  Compass,
  Bot,
  Layers,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Filter,
  Check,
  AlertCircle,
  Play,
  AlertTriangle,
} from "lucide-react";

interface Channel {
  id: string;
  channel_id: string;
  channel_title: string;
  thumbnail_url: string | null;
  custom_url: string | null;
  subscriber_count: number;
  video_count: number;
  view_count: number;
  is_active: boolean;
}

interface TriggerRule {
  id: string;
  name: string;
  channel_id?: string | null;
  keywords: string[];
  negative_keywords: string[];
  match_type: string;
  keyword_match_operator?: string;
  target_mode: string;
  reply_templates: string[];
  cta_url: string | null;
  intent_category: string;
  delay_seconds: number;
  is_active: boolean;
  youtube_channels?: { channel_title?: string };
}

interface ProcessedLog {
  id: string;
  author_name: string;
  comment_text: string;
  reply_text: string | null;
  video_id: string;
  reply_status: string;
  detected_intent: string | null;
  error_message?: string | null;
  youtube_reply_id?: string | null;
  processed_at: string | null;
  created_at: string;
  trigger_rules?: { name?: string };
}

interface TrackedLinkItem {
  id: string;
  slug: string;
  destination_url: string;
  campaign_name: string;
  clicks_count: number;
  conversions_count: number;
  revenue_generated: string;
}

interface Competitor {
  id: string;
  competitor_channel_id: string;
  channel_title: string;
  custom_url: string | null;
  thumbnail_url: string | null;
  subscriber_count: number;
  video_count: number;
  total_views: number;
}

type TabType =
  | "overview"
  | "channels"
  | "rules"
  | "logs"
  | "conversions"
  | "analytics"
  | "competitors"
  | "copilot"
  | "templates"
  | "billing"
  | "settings";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ email: string; full_name?: string; avatar_url?: string } | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [rules, setRules] = useState<TriggerRule[]>([]);
  const [logs, setLogs] = useState<ProcessedLog[]>([]);
  const [trackedLinks, setTrackedLinks] = useState<TrackedLinkItem[]>([]);
  const [competitors, setCompetitors] = useState<Competitor[]>([]);

  const [stats, setStats] = useState({
    connectedChannels: 0,
    commentsMonitored: 0,
    commentsMatched: 0,
    repliesSent: 0,
    failedReplies: 0,
    spamBlocked: 0,
    replySuccessRate: 100,
    clicks: 0,
    conversions: 0,
    revenue: 0,
  });

  // Rule Modal State
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
  const [ruleChannelId, setRuleChannelId] = useState("");
  const [ruleName, setRuleName] = useState("");
  const [ruleKeywords, setRuleKeywords] = useState("LINK, PRICE, GUIDE");
  const [ruleNegative, setRuleNegative] = useState("fake, scam");
  const [ruleMatchType, setRuleMatchType] = useState("contains");
  const [ruleOperator, setRuleOperator] = useState<"ANY" | "ALL">("ANY");
  const [ruleIntent, setRuleIntent] = useState("ALL");
  const [ruleReply, setRuleReply] = useState("Hey {{first_name}}! {Here is the official link|Grab it right here}: {{cta_url}}");
  const [ruleCta, setRuleCta] = useState("https://tubeflow-nine.vercel.app");
  const [ruleDelay, setRuleDelay] = useState("0");
  const [ruleError, setRuleError] = useState<string | null>(null);
  const [isSubmittingRule, setIsSubmittingRule] = useState(false);

  // Dry-Run Simulator State
  const [isDryRunModalOpen, setIsDryRunModalOpen] = useState(false);
  const [dryRunComment, setDryRunComment] = useState("Bro where can I buy this setup? Drop LINK pls!!");
  const [dryRunAuthor, setDryRunAuthor] = useState("Vikram");
  const [dryRunResult, setDryRunResult] = useState<any>(null);
  const [isEvaluatingDryRun, setIsEvaluatingDryRun] = useState(false);

  // Reply Logs Filter
  const [logFilterStatus, setLogFilterStatus] = useState<"ALL" | "replied" | "error" | "spam">("ALL");

  // Link Modal State
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [newDestinationUrl, setNewDestinationUrl] = useState("");
  const [newCampaignName, setNewCampaignName] = useState("");

  // Competitor Modal State
  const [isCompModalOpen, setIsCompModalOpen] = useState(false);
  const [compHandle, setCompHandle] = useState("");

  // AI Copilot State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiThinking, setAiThinking] = useState(false);

  // Action status message
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Dashboard summary
      const dRes = await fetch("/api/dashboard");
      const dData = await dRes.json();
      if (dData.authenticated) {
        setProfile(dData.profile);
        setChannels(dData.channels || []);
        setRules(dData.rules || []);
        setLogs(dData.logs || []);
        if (dData.stats) setStats(dData.stats);
      }

      // 2. Tracked links / conversions
      const cRes = await fetch("/api/conversions");
      const cData = await cRes.json();
      if (cData.links) setTrackedLinks(cData.links);

      // 3. Competitors
      const compRes = await fetch("/api/competitors");
      const compData = await compRes.json();
      if (compData.competitors) setCompetitors(compData.competitors);
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateOrUpdateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;
    setIsSubmittingRule(true);
    setRuleError(null);
    try {
      const method = editingRuleId ? "PUT" : "POST";
      const payload: Record<string, unknown> = {
        name: ruleName.trim(),
        keywords: ruleKeywords.split(",").map((s) => s.trim()).filter(Boolean),
        negativeKeywords: ruleNegative.split(",").map((s) => s.trim()).filter(Boolean),
        matchType: ruleMatchType,
        keywordMatchOperator: ruleOperator,
        intentCategory: ruleIntent,
        replyTemplates: [ruleReply],
        ctaUrl: ruleCta.trim() || null,
        delaySeconds: parseInt(ruleDelay || "0", 10),
        channelId: ruleChannelId || undefined,
      };

      if (editingRuleId) {
        payload.id = editingRuleId;
      }

      const res = await fetch("/api/rules", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setRuleError(data.error || "Failed to save rule");
        return;
      }

      setIsRuleModalOpen(false);
      setEditingRuleId(null);
      setRuleName("");
      setActionNotice(editingRuleId ? "Rule updated successfully" : "Rule created successfully");
      fetchAllData();
    } catch (err: unknown) {
      setRuleError(err instanceof Error ? err.message : "Failed to save rule");
    } finally {
      setIsSubmittingRule(false);
    }
  };

  const handleEditRule = (r: TriggerRule) => {
    setEditingRuleId(r.id);
    setRuleName(r.name);
    setRuleKeywords(r.keywords.join(", "));
    setRuleNegative(r.negative_keywords?.join(", ") || "");
    setRuleMatchType(r.match_type || "contains");
    setRuleOperator((r.keyword_match_operator as "ANY" | "ALL") || "ANY");
    setRuleIntent(r.intent_category || "ALL");
    setRuleReply(r.reply_templates[0] || "");
    setRuleCta(r.cta_url || "");
    setRuleDelay(String(r.delay_seconds || 0));
    setRuleChannelId(r.channel_id || "");
    setRuleError(null);
    setIsRuleModalOpen(true);
  };

  const handleDuplicateRule = async (ruleId: string) => {
    try {
      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "duplicate", ruleId }),
      });
      const data = await res.json();
      if (res.ok) {
        setActionNotice(`Rule duplicated as "${data.rule.name}"`);
        fetchAllData();
      } else {
        setActionNotice(`Duplicate failed: ${data.error}`);
      }
    } catch {
      setActionNotice("Duplicate request failed");
    }
  };

  const handleOpenDryRun = (r?: TriggerRule) => {
    if (r) {
      setRuleName(r.name);
      setRuleKeywords(r.keywords.join(", "));
      setRuleNegative(r.negative_keywords?.join(", ") || "");
      setRuleMatchType(r.match_type || "contains");
      setRuleOperator((r.keyword_match_operator as "ANY" | "ALL") || "ANY");
      setRuleIntent(r.intent_category || "ALL");
      setRuleReply(r.reply_templates[0] || "");
      setRuleCta(r.cta_url || "");
    }
    setDryRunComment("Bro where can I buy this setup? Drop LINK pls!!");
    setDryRunAuthor("Vikram");
    setDryRunResult(null);
    setIsDryRunModalOpen(true);
  };

  const handleExecuteDryRun = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEvaluatingDryRun(true);
    try {
      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "test_dry_run",
          testCommentText: dryRunComment,
          testAuthorName: dryRunAuthor,
          keywords: ruleKeywords.split(",").map((k) => k.trim()),
          negativeKeywords: ruleNegative.split(",").map((k) => k.trim()),
          matchType: ruleMatchType,
          keywordMatchOperator: ruleOperator,
          intentCategory: ruleIntent,
          replyTemplate: ruleReply,
          ctaUrl: ruleCta,
        }),
      });
      const data = await res.json();
      setDryRunResult(data);
    } catch (err) {
      console.error("Dry run execution error:", err);
    } finally {
      setIsEvaluatingDryRun(false);
    }
  };

  const handleToggleRule = async (ruleId: string, currentActive: boolean) => {
    try {
      await fetch("/api/rules", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ruleId, is_active: !currentActive }),
      });
      fetchAllData();
    } catch (err) {
      console.error("Toggle rule error:", err);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (!confirm("Are you sure you want to delete this rule?")) return;
    try {
      await fetch(`/api/rules?id=${ruleId}`, { method: "DELETE" });
      fetchAllData();
    } catch (err) {
      console.error("Delete rule error:", err);
    }
  };

  const handleCreateTrackedLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDestinationUrl.trim()) return;
    try {
      const res = await fetch("/api/conversions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationUrl: newDestinationUrl,
          campaignName: newCampaignName || "General Link Campaign",
        }),
      });
      if (res.ok) {
        setIsLinkModalOpen(false);
        setNewDestinationUrl("");
        setNewCampaignName("");
        fetchAllData();
      }
    } catch (err) {
      console.error("Link create error:", err);
    }
  };

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compHandle.trim()) return;
    try {
      await fetch("/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelHandleOrId: compHandle }),
      });
      setIsCompModalOpen(false);
      setCompHandle("");
      fetchAllData();
    } catch (err) {
      console.error("Add competitor error:", err);
    }
  };

  const handleAskCopilot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiThinking(true);
    setAiResponse(null);
    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: aiPrompt }),
      });
      const data = await res.json();
      setAiResponse(data.response || "No response received");
    } catch (err) {
      console.error("AI error:", err);
      setAiResponse("Unable to generate advice right now.");
    } finally {
      setAiThinking(false);
    }
  };

  const handleTriggerManualPolling = async () => {
    setActionNotice("Polling YouTube comments...");
    try {
      const res = await fetch("/api/cron/poll-comments?manual=true");
      const data = await res.json();
      setActionNotice(
        `Poll finished. Confirmed ${data.confirmedRepliesCount || 0} reply(s) across ${data.commentsInspectedCount || 0} comment(s).`
      );
      fetchAllData();
    } catch {
      setActionNotice("Poll execution failed.");
    }
  };

  const activeChannel = channels[0] || null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Logo */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 font-black">
                TF
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight text-white block">
                  TubeFlow
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                  SaaS Control Center
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "channels", label: "YouTube Channels", icon: Video },
              { id: "rules", label: "Trigger Rules", icon: Zap },
              { id: "logs", label: "Reply Logs", icon: MessageSquare },
              { id: "conversions", label: "Conversions & Links", icon: TrendingUp },
              { id: "competitors", label: "Competitor Intel", icon: Compass },
              { id: "copilot", label: "AI YouTube Copilot", icon: Bot },
              { id: "templates", label: "Template Library", icon: Layers },
              { id: "billing", label: "Plans & Billing", icon: CreditCard },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-red-600/15 text-red-400 border border-red-500/20 shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account / Logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300 shrink-0">
                {profile?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="truncate">
                <span className="text-xs font-semibold text-white block truncate">
                  {profile?.full_name || profile?.email?.split("@")[0] || "Active User"}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
                  {profile?.email || "Authenticated"}
                </span>
              </div>
            </div>
            <Link
              href="/api/auth/logout"
              title="Log out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black text-white capitalize">
              {activeTab === "rules" ? "Trigger Rules & Automations" : activeTab}
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              {activeChannel
                ? `Connected to: ${activeChannel.channel_title}`
                : "No active YouTube channel connected."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerManualPolling}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-red-400" />
              <span>Poll YouTube Now</span>
            </button>

            <Link
              href="/api/auth/google?mode=connect_youtube"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all shadow-lg shadow-red-600/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Connect Channel</span>
            </Link>
          </div>
        </div>

        {/* Global Action Notification */}
        {actionNotice && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/50 text-red-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-400" />
              <span>{actionNotice}</span>
            </div>
            <button
              onClick={() => setActionNotice(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Real Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Channels</span>
                <span className="text-2xl font-black text-white">{stats.connectedChannels}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Real synced</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] font-semibold text-slate-400 block mb-1">Monitored</span>
                <span className="text-2xl font-black text-white">{stats.commentsMonitored}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Total comments</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] font-semibold text-emerald-400 block mb-1">Confirmed Replies</span>
                <span className="text-2xl font-black text-emerald-400">{stats.repliesSent}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Verified on YouTube</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <span className={`text-[11px] font-semibold block mb-1 ${stats.failedReplies > 0 ? "text-red-400" : "text-slate-400"}`}>
                  Failed Attempts
                </span>
                <span className={`text-2xl font-black ${stats.failedReplies > 0 ? "text-red-400" : "text-slate-400"}`}>
                  {stats.failedReplies}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">API / Quota errors</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] font-semibold text-amber-400 block mb-1">Spam Shielded</span>
                <span className="text-2xl font-black text-amber-400">{stats.spamBlocked}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Bots filtered out</span>
              </div>
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
                <span className="text-[11px] font-semibold text-cyan-400 block mb-1">Tracked Clicks</span>
                <span className="text-2xl font-black text-cyan-400">{stats.clicks}</span>
                <span className="text-[10px] text-slate-500 block mt-1">From shortlinks</span>
              </div>
            </div>

            {/* Channel Connection Banner */}
            {activeChannel ? (
              <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  {activeChannel.thumbnail_url ? (
                    <img
                      src={activeChannel.thumbnail_url}
                      alt={activeChannel.channel_title}
                      className="w-14 h-14 rounded-full border-2 border-red-500"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center font-bold text-red-400 text-lg">
                      YT
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-lg text-white">{activeChannel.channel_title}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                        Live Polling Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {activeChannel.subscriber_count.toLocaleString()} Subscribers • {activeChannel.video_count} Videos • {activeChannel.view_count.toLocaleString()} Total Views
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`https://youtube.com/channel/${activeChannel.channel_id}`}
                    target="_blank"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                  >
                    <span>View on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center">
                <Video className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="font-bold text-white text-base">No YouTube Channel Connected</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Connect your YouTube channel via Google OAuth to enable real comment monitoring and automated link delivery.
                </p>
                <Link
                  href="/api/auth/google?mode=connect_youtube"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Connect Channel Now</span>
                </Link>
              </div>
            )}

            {/* Quick Trigger Rules Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white">Active Trigger Rules</h3>
                  <p className="text-xs text-slate-400">Automations actively scanning incoming comments</p>
                </div>
                <button
                  onClick={() => setIsRuleModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Rule</span>
                </button>
              </div>

              {rules.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No trigger rules created yet. Click "New Rule" to set up your first keyword responder.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 font-semibold">Rule Name</th>
                        <th className="pb-3 font-semibold">Trigger Keywords</th>
                        <th className="pb-3 font-semibold">Intent</th>
                        <th className="pb-3 font-semibold">Status</th>
                        <th className="pb-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {rules.slice(0, 5).map((r) => (
                        <tr key={r.id}>
                          <td className="py-3 font-medium text-white">{r.name}</td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1">
                              {r.keywords.map((kw, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-red-400 font-mono text-[10px]">
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 text-slate-300 font-mono text-[11px]">{r.intent_category}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              r.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                            }`}>
                              {r.is_active ? "Active" : "Paused"}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleToggleRule(r.id, r.is_active)}
                              className="text-xs text-slate-400 hover:text-white mr-3"
                            >
                              {r.is_active ? "Pause" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleDeleteRule(r.id)}
                              className="text-xs text-red-400 hover:text-red-300"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CHANNELS */}
        {activeTab === "channels" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Connected YouTube Channels</h2>
                <p className="text-xs text-slate-400">Manage multiple creator channels from one dashboard</p>
              </div>
              <Link
                href="/api/auth/google?mode=connect_youtube"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Channel</span>
              </Link>
            </div>

            {channels.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-sm text-slate-400 mb-4">No channels connected yet.</p>
                <Link
                  href="/api/auth/google?mode=connect_youtube"
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  Connect YouTube Channel
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channels.map((ch) => (
                  <div key={ch.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-4">
                      {ch.thumbnail_url ? (
                        <img src={ch.thumbnail_url} alt={ch.channel_title} className="w-12 h-12 rounded-full border border-slate-700" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-red-400">
                          YT
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-base">{ch.channel_title}</h4>
                        <span className="text-xs text-slate-500 font-mono">{ch.channel_id}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 rounded-xl text-center text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Subscribers</span>
                        <span className="font-bold text-white">{ch.subscriber_count.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Videos</span>
                        <span className="font-bold text-white">{ch.video_count}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Views</span>
                        <span className="font-bold text-white">{ch.view_count.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-xs text-emerald-400 font-medium">● Polling Active</span>
                      <Link
                        href={`https://youtube.com/channel/${ch.channel_id}`}
                        target="_blank"
                        className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        Open Channel <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRIGGER RULES */}
        {activeTab === "rules" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Trigger Rule Automations</h2>
                <p className="text-xs text-slate-400">Configure keywords, negative filters, intent categories, and reply templates</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenDryRun()}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-all shadow-sm"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Dry-Run Simulator</span>
                </button>
                <button
                  onClick={() => {
                    setEditingRuleId(null);
                    setRuleName("");
                    setRuleKeywords("LINK, PRICE, GUIDE");
                    setRuleNegative("fake, scam");
                    setRuleMatchType("contains");
                    setRuleOperator("ANY");
                    setRuleIntent("ALL");
                    setRuleReply("Hey {{first_name}}! {Here is the official link|Grab it right here}: {{cta_url}}");
                    setRuleCta("https://tubeflow-nine.vercel.app");
                    setRuleDelay("0");
                    setRuleChannelId("");
                    setRuleError(null);
                    setIsRuleModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-lg shadow-red-600/20"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Create Rule</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-semibold">Rule Name</th>
                    <th className="p-4 font-semibold">Match Type</th>
                    <th className="p-4 font-semibold">Keywords</th>
                    <th className="p-4 font-semibold">Negative Filter</th>
                    <th className="p-4 font-semibold">Intent</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {rules.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No trigger rules found. Create a rule to start replying automatically.
                      </td>
                    </tr>
                  ) : (
                    rules.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-800/30">
                        <td className="p-4">
                          <span className="font-bold text-white block">{r.name}</span>
                          {r.youtube_channels?.channel_title && (
                            <span className="text-[10px] text-slate-500 block">{r.youtube_channels.channel_title}</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] uppercase block w-fit">
                            {r.match_type} ({r.keyword_match_operator || "ANY"})
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {r.keywords.map((kw, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-red-400 font-mono text-[10px]">
                                {kw}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-400 font-mono text-[10px]">
                            {r.negative_keywords?.length > 0 ? r.negative_keywords.join(", ") : "None"}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-300">{r.intent_category}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.is_active ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                          }`}>
                            {r.is_active ? "Active" : "Paused"}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1.5">
                          <button
                            onClick={() => handleOpenDryRun(r)}
                            title="Simulate comment against this rule"
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-950 text-cyan-400 border border-slate-700 hover:border-cyan-800 text-[10px] font-bold transition-all"
                          >
                            Test
                          </button>
                          <button
                            onClick={() => handleEditRule(r)}
                            title="Edit rule settings"
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-amber-950 text-amber-400 border border-slate-700 hover:border-amber-800 text-[10px] font-bold transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDuplicateRule(r.id)}
                            title="Duplicate this rule"
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-indigo-950 text-indigo-400 border border-slate-700 hover:border-indigo-800 text-[10px] font-bold transition-all"
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => handleToggleRule(r.id, r.is_active)}
                            className="text-slate-400 hover:text-white text-[10px]"
                          >
                            {r.is_active ? "Pause" : "Activate"}
                          </button>
                          <button
                            onClick={() => handleDeleteRule(r.id)}
                            className="text-red-400 hover:text-red-300 text-[10px]"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: REPLY LOGS */}
        {activeTab === "logs" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Real-Time Reply Logs</h2>
                <p className="text-xs text-slate-400">Audit trail of all processed comments, verified YouTube responses, and error traces</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-400 font-medium">Filter:</label>
                <select
                  value={logFilterStatus}
                  onChange={(e) => setLogFilterStatus(e.target.value as "ALL" | "replied" | "error" | "spam")}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="ALL">All Statuses ({logs.length})</option>
                  <option value="replied">Confirmed Replied ({logs.filter(l => l.reply_status === "replied").length})</option>
                  <option value="error">Failed / Error ({logs.filter(l => l.reply_status === "error").length})</option>
                  <option value="spam">Spam Shielded ({logs.filter(l => l.reply_status === "spam").length})</option>
                </select>
                <button
                  onClick={fetchAllData}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
                >
                  Refresh
                </button>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-semibold">Author</th>
                    <th className="p-4 font-semibold">Comment Text</th>
                    <th className="p-4 font-semibold">Intent Detected</th>
                    <th className="p-4 font-semibold">Automated Reply / Result</th>
                    <th className="p-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(() => {
                    const filteredLogs = logFilterStatus === "ALL" ? logs : logs.filter((l) => l.reply_status === logFilterStatus);
                    if (filteredLogs.length === 0) {
                      return (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">
                            {logs.length === 0
                              ? "No reply logs recorded yet. Comments will appear here as they are processed."
                              : `No logs matching filter "${logFilterStatus}".`}
                          </td>
                        </tr>
                      );
                    }
                    return filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/30">
                        <td className="p-4 font-medium text-white">{log.author_name}</td>
                        <td className="p-4 max-w-xs text-slate-300">{log.comment_text}</td>
                        <td className="p-4 font-mono text-[11px] text-cyan-400">{log.detected_intent || "KEYWORD"}</td>
                        <td className="p-4 max-w-sm text-slate-300">
                          {log.reply_status === "error" ? (
                            <div className="space-y-1">
                              <span className="text-red-400 font-mono text-[11px] block">Error: {log.error_message || "Delivery failed"}</span>
                              {log.reply_text && <span className="text-slate-500 text-[10px] block truncate">Attempted: {log.reply_text}</span>}
                            </div>
                          ) : (
                            <span className="truncate block" title={log.reply_text || ""}>
                              {log.reply_text || "Skipped (no match or spam)"}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            log.reply_status === "replied"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : log.reply_status === "error"
                              ? "bg-red-500/15 text-red-400 border border-red-500/30"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}>
                            {log.reply_status === "replied" ? "Confirmed Replied" : log.reply_status}
                          </span>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CONVERSIONS & LINKS */}
        {activeTab === "conversions" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Tracked Links & Conversions</h2>
                <p className="text-xs text-slate-400">Measure exact click-through rates and attributed purchases from YouTube comments</p>
              </div>
              <button
                onClick={() => setIsLinkModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create Tracked Link</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Total Clicks</span>
                <span className="text-2xl font-black text-white">{stats.clicks}</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Attributed Conversions</span>
                <span className="text-2xl font-black text-emerald-400">{stats.conversions}</span>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">Attributed Revenue</span>
                <span className="text-2xl font-black text-cyan-400">₹{stats.revenue}</span>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-semibold">Campaign</th>
                    <th className="p-4 font-semibold">Short URL</th>
                    <th className="p-4 font-semibold">Destination URL</th>
                    <th className="p-4 font-semibold text-center">Clicks</th>
                    <th className="p-4 font-semibold text-center">Conversions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {trackedLinks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No tracked links created yet.
                      </td>
                    </tr>
                  ) : (
                    trackedLinks.map((tl) => (
                      <tr key={tl.id}>
                        <td className="p-4 font-bold text-white">{tl.campaign_name}</td>
                        <td className="p-4 font-mono text-red-400">/r/{tl.slug}</td>
                        <td className="p-4 text-slate-400 max-w-xs truncate">{tl.destination_url}</td>
                        <td className="p-4 text-center font-bold text-white">{tl.clicks_count}</td>
                        <td className="p-4 text-center font-bold text-emerald-400">{tl.conversions_count}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: COMPETITOR INTEL */}
        {activeTab === "competitors" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Competitor Intelligence</h2>
                <p className="text-xs text-slate-400">Track competitor upload rates and find what topics convert best</p>
              </div>
              <button
                onClick={() => setIsCompModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Track Competitor</span>
              </button>
            </div>

            {competitors.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
                <p className="text-sm text-slate-400 mb-4">No competitors tracked yet.</p>
                <button
                  onClick={() => setIsCompModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  Add YouTube Channel Handle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {competitors.map((c) => (
                  <div key={c.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-4">
                      {c.thumbnail_url ? (
                        <img src={c.thumbnail_url} alt={c.channel_title} className="w-12 h-12 rounded-full" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400">
                          {c.channel_title[0]}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-white text-base">{c.channel_title}</h4>
                        <span className="text-xs text-slate-400 font-mono">{c.custom_url || c.competitor_channel_id}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/60 rounded-xl text-center text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Subscribers</span>
                        <span className="font-bold text-white">{c.subscriber_count.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Videos</span>
                        <span className="font-bold text-white">{c.video_count}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Views</span>
                        <span className="font-bold text-white">{c.total_views.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: AI YOUTUBE COPILOT */}
        {activeTab === "copilot" && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-bold text-white">AI YouTube Conversion Copilot</h2>
              <p className="text-xs text-slate-400">Context-aware advice informed by your connected channel, active rules, and conversions</p>
            </div>

            <form onSubmit={handleAskCopilot} className="space-y-3">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask e.g.: 'What is my best converting trigger?' or 'Suggest 3 high-converting Shorts CTAs for my niche.'"
                className="w-full h-28 bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                disabled={aiThinking}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>{aiThinking ? "Analyzing Channel Data..." : "Ask Copilot"}</span>
              </button>
            </form>

            {aiResponse && (
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                  <Bot className="w-4 h-4" />
                  <span>TubeFlow Copilot Advice:</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 8: TEMPLATE LIBRARY */}
        {activeTab === "templates" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Conversion Reply Template Library</h2>
              <p className="text-xs text-slate-400">Battle-tested templates using Spintax variations to prevent spam filters</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "D2C Direct Checkout Link",
                  intent: "BUYING_INTENT",
                  template: "{Hey|Hello} {{first_name}}! {Here is the product you asked for|Grab it directly here} 👇 {{cta_url}}",
                },
                {
                  title: "Free PDF / Resource Lead Magnet",
                  intent: "LINK_REQUEST",
                  template: "{Awesome question|Glad you asked} {{first_name}}! {Download the complete free PDF guide here|Access the resource now}: {{cta_url}}",
                },
                {
                  title: "Affiliate Setup / Gear Review",
                  intent: "PRODUCT_QUESTION",
                  template: "Hey {{first_name}} 👋 The exact gear used in this video is linked here: {{cta_url}} {Hope this helps!|Check it out!}",
                },
                {
                  title: "Course / Webinar Registration",
                  intent: "BUYING_INTENT",
                  template: "{Welcome|Hey} {{first_name}}! Full curriculum details and bonus access are waiting here: {{cta_url}}",
                },
              ].map((tmpl, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-sm">{tmpl.title}</h4>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono text-[10px]">
                      {tmpl.intent}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono p-3 bg-slate-950 rounded-xl">{tmpl.template}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: PLANS & BILLING */}
        {activeTab === "billing" && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold text-white">Subscription & Usage Limits</h2>
              <p className="text-xs text-slate-400">Current tier and server-enforced reply capacity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Plan</span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-white">Free Starter</h3>
                  <span className="text-xs text-slate-500">₹0 / month</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 100 auto-replies / month</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> 1 connected YouTube channel</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Standard keyword triggers</li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-red-500/30 space-y-4 relative">
                <span className="px-2.5 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                  Recommended For Growth
                </span>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-white">Pro Creator</h3>
                  <span className="text-xs text-slate-500">₹1,499 / month</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-red-400" /> Unlimited automated replies</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-red-400" /> Multi-channel support (up to 5 channels)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-red-400" /> AI Intent detection & Spintax rotator</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-red-400" /> Sub-second polling priority</li>
                </ul>
                <button
                  onClick={() => alert("Payment gateway integration (Razorpay/Stripe) is ready for live billing credentials.")}
                  className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Upgrade To Pro
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: SETTINGS */}
        {activeTab === "settings" && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h2 className="text-xl font-bold text-white">Account & Channel Settings</h2>
              <p className="text-xs text-slate-400">Manage connected account permissions and preferences</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm">Account Information</h4>
              <div className="text-xs space-y-1">
                <span className="text-slate-400 block">Email Address:</span>
                <span className="font-mono text-white block">{profile?.email || "varuoog755@gmail.com"}</span>
              </div>
              <div className="text-xs space-y-1">
                <span className="text-slate-400 block">Account Name:</span>
                <span className="text-white block">{profile?.full_name || "Creator"}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-red-950/20 border border-red-900/30 space-y-4">
              <h4 className="font-bold text-red-400 text-sm">Danger Zone</h4>
              <p className="text-xs text-slate-400">Disconnecting your channel will halt all background comment monitoring and auto-replies.</p>
              {activeChannel && (
                <button
                  onClick={async () => {
                    if (!confirm("Are you sure you want to disconnect this channel?")) return;
                    await fetch("/api/channels", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "disconnect", channelDbId: activeChannel.id }),
                    });
                    fetchAllData();
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Disconnect YouTube Channel
                </button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* CREATE / EDIT RULE MODAL */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingRuleId ? "Edit Trigger Rule" : "Create Trigger Rule"}
              </h3>
              <button
                onClick={() => {
                  setIsRuleModalOpen(false);
                  setEditingRuleId(null);
                  setRuleError(null);
                }}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            {ruleError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{ruleError}</span>
              </div>
            )}

            <form onSubmit={handleCreateOrUpdateRule} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Rule Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Viral Shorts Link Responder"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Target YouTube Channel</label>
                <select
                  value={ruleChannelId}
                  onChange={(e) => setRuleChannelId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                >
                  <option value="">All Connected Channels</option>
                  {channels.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      {ch.channel_title} ({ch.custom_url || ch.channel_id || "Channel"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Trigger Keywords (comma separated)</label>
                <input
                  type="text"
                  required
                  placeholder="LINK, PRICE, GUIDE"
                  value={ruleKeywords}
                  onChange={(e) => setRuleKeywords(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Negative Keywords (skips comment if present)</label>
                <input
                  type="text"
                  placeholder="fake, scam, scammer"
                  value={ruleNegative}
                  onChange={(e) => setRuleNegative(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Intent Filter</label>
                  <select
                    value={ruleIntent}
                    onChange={(e) => setRuleIntent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="ALL">ALL Intents</option>
                    <option value="LINK_REQUEST">LINK_REQUEST</option>
                    <option value="BUYING_INTENT">BUYING_INTENT</option>
                    <option value="PRICE_REQUEST">PRICE_REQUEST</option>
                    <option value="PRODUCT_QUESTION">PRODUCT_QUESTION</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Match Type</label>
                  <select
                    value={ruleMatchType}
                    onChange={(e) => setRuleMatchType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="contains">Contains</option>
                    <option value="exact">Exact Phrase</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Operator</label>
                  <select
                    value={ruleOperator}
                    onChange={(e) => setRuleOperator(e.target.value as "ANY" | "ALL")}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  >
                    <option value="ANY">Match ANY (OR)</option>
                    <option value="ALL">Match ALL (AND)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-slate-300 block mb-1 font-medium">CTA Destination URL</label>
                  <input
                    type="url"
                    placeholder="https://yourstore.com/item"
                    value={ruleCta}
                    onChange={(e) => setRuleCta(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-medium">Delay (sec)</label>
                  <input
                    type="number"
                    min="0"
                    max="3600"
                    value={ruleDelay}
                    onChange={(e) => setRuleDelay(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">
                  Reply Template (Supports Spintax & {"{{first_name}}"}, {"{{cta_url}}"})
                </label>
                <textarea
                  rows={3}
                  value={ruleReply}
                  onChange={(e) => setRuleReply(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500 font-mono text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsRuleModalOpen(false);
                    setEditingRuleId(null);
                    setRuleError(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRule}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  {isSubmittingRule ? "Saving..." : editingRuleId ? "Update Rule" : "Create Rule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DRY RUN SIMULATOR MODAL */}
      {isDryRunModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Test Rule Simulator (Dry Run)</h3>
              </div>
              <button
                onClick={() => setIsDryRunModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Simulate rule matching and reply generation against YouTube comments without posting live comments.
            </p>

            <form onSubmit={handleExecuteDryRun} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Test Comment Author</label>
                <input
                  type="text"
                  value={dryRunAuthor}
                  onChange={(e) => setDryRunAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  placeholder="e.g. Rahul Sharma"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Test Comment Text</label>
                <textarea
                  rows={3}
                  value={dryRunComment}
                  onChange={(e) => setDryRunComment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
                  placeholder="Type any test comment..."
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1">
                <div className="text-slate-400 font-semibold">Testing against active rule parameters:</div>
                <div className="text-slate-300 font-mono">
                  Keywords: <span className="text-white">{ruleKeywords || "None"}</span> (Operator: <span className="text-red-400">{ruleOperator}</span>)
                </div>
                {ruleNegative && (
                  <div className="text-slate-300 font-mono">
                    Negative: <span className="text-red-400">{ruleNegative}</span>
                  </div>
                )}
                <div className="text-slate-300 font-mono">
                  Intent: <span className="text-cyan-400">{ruleIntent}</span> | Match Type: <span className="text-white">{ruleMatchType}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDryRunModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isEvaluatingDryRun}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{isEvaluatingDryRun ? "Simulating..." : "Run Dry Run"}</span>
                </button>
              </div>
            </form>

            {dryRunResult && (
              <div className={`p-4 rounded-xl border text-xs space-y-2 mt-3 ${
                dryRunResult.matched
                  ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
                  : "bg-red-950/40 border-red-500/30 text-red-200"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5">
                    {dryRunResult.matched ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>MATCH SUCCESSFUL</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>MATCH REJECTED</span>
                      </>
                    )}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40">
                    Detected Intent: {dryRunResult.detectedIntent}
                  </span>
                </div>

                <div className="text-slate-300 text-[11px]">
                  <strong>Reason:</strong> {dryRunResult.reason}
                </div>

                {dryRunResult.renderedReply && (
                  <div className="pt-2 border-t border-emerald-500/20">
                    <span className="text-[10px] text-emerald-400 block font-semibold mb-1">Generated Reply Preview:</span>
                    <div className="p-2.5 rounded-lg bg-black/60 font-mono text-[11px] text-white break-words">
                      {dryRunResult.renderedReply}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE TRACKED LINK MODAL */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Create Tracked Link</h3>
              <button onClick={() => setIsLinkModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕ Close
              </button>
            </div>
            <form onSubmit={handleCreateTrackedLink} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Campaign Name</label>
                <input
                  type="text"
                  placeholder="e.g. Shorts Bio Link"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Destination URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://myshopify.com/product"
                  value={newDestinationUrl}
                  onChange={(e) => setNewDestinationUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold">
                  Create Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRACK COMPETITOR MODAL */}
      {isCompModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">Track Competitor Channel</h3>
              <button onClick={() => setIsCompModalOpen(false)} className="text-slate-400 hover:text-white text-xs">
                ✕ Close
              </button>
            </div>
            <form onSubmit={handleAddCompetitor} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">YouTube Handle or Channel ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. @MrBeast or UCX6OQ3DkcsbYNE6H8uQQuVA"
                  value={compHandle}
                  onChange={(e) => setCompHandle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCompModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-red-600 text-white font-bold">
                  Track Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
