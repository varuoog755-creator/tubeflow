"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Eye,
  MessageSquare,
  ShieldAlert,
  BarChart3,
  Search,
  RefreshCw,
  SlidersHorizontal,
  Video,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Send,
  Zap,
  ChevronRight,
  Globe,
  Smartphone,
  Monitor,
  ExternalLink,
  LifeBuoy,
  Tag,
  Key,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  workspaceId: string;
  workspaceName: string;
  plan: string;
  planStatus: string;
  byokEnabled: boolean;
  byokClientId: string | null;
  channelConnected: boolean;
  channelTitle: string | null;
  channelCustomUrl: string | null;
  subscribers: number;
  rulesCount: number;
  createdAt: string;
  updatedAt: string;
}

interface SupportTicket {
  id: string;
  workspace_id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  ticket_number: string;
  subject: string;
  category: string;
  priority: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  message: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  sender_type: "customer" | "admin";
  sender_name: string;
  sender_email: string;
  message: string;
  created_at: string;
}

interface VisitorEvent {
  id: string;
  path: string;
  referrer: string;
  device: string;
  ip_hash: string;
  country: string;
  created_at: string;
}

interface AdminData {
  metrics: {
    totalUsers: number;
    totalWorkspaces: number;
    totalChannels: number;
    totalRules: number;
    totalRepliesDelivered: number;
    totalCommentsMonitored: number;
    pageViewsToday: number;
    pageViewsTotal: number;
    uniqueVisitorsToday: number;
    uniqueVisitorsTotal: number;
    openTickets: number;
    inProgressTickets: number;
    resolvedTickets: number;
    totalTickets: number;
  };
  analytics: {
    topPages: { path: string; views: number }[];
    topReferrers: { source: string; count: number }[];
    deviceBreakdown: { desktop: number; mobile: number; tablet: number };
    recentVisitors: VisitorEvent[];
  };
  users: AdminUser[];
  tickets: SupportTicket[];
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "tickets" | "analytics">("overview");

  // Search & Filters
  const [userSearch, setUserSearch] = useState("");
  const [planFilter, setPlanFilter] = useState<string>("ALL");
  const [ticketStatusFilter, setTicketStatusFilter] = useState<string>("ALL");

  // Selected Ticket for Modal/Detail
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingPlanUserId, setUpdatingPlanUserId] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/overview");
      if (res.status === 403 || res.status === 401) {
        setAccessDenied(true);
        setLoading(false);
        return;
      }
      const json = await res.json();
      if (json.success) {
        setData(json);
      } else {
        setAccessDenied(true);
      }
    } catch {
      setAccessDenied(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const openTicketDetail = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}`);
      const json = await res.json();
      if (json.success) {
        setTicketMessages(json.messages || []);
      }
    } catch (err) {
      console.error("Load ticket thread error:", err);
    }
  };

  const handleSendAdminReply = async () => {
    if (!selectedTicket || !adminReplyText.trim()) return;
    setSendingReply(true);
    try {
      const res = await fetch(`/api/support/tickets/${selectedTicket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: adminReplyText.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setTicketMessages((prev) => [...prev, json.message]);
        setAdminReplyText("");
        // Refresh ticket status locally
        setSelectedTicket((prev) => prev ? { ...prev, status: "in_progress" } : null);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Send reply error:", err);
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: "open" | "in_progress" | "resolved" | "closed") => {
    try {
      const res = await fetch(`/api/support/tickets/${ticketId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(json.ticket);
        }
        fetchAdminData();
      }
    } catch (err) {
      console.error("Update ticket status error:", err);
    }
  };

  const handleUpdateUserPlan = async (workspaceId: string, newPlan: string) => {
    setUpdatingPlanUserId(workspaceId);
    try {
      const res = await fetch("/api/admin/users/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workspaceId, newPlan }),
      });
      const json = await res.json();
      if (json.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error("Update user plan error:", err);
    } finally {
      setUpdatingPlanUserId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter((u) => {
      if (planFilter !== "ALL" && u.plan.toLowerCase() !== planFilter.toLowerCase()) return false;
      if (userSearch.trim()) {
        const query = userSearch.toLowerCase().trim();
        return (
          u.email.toLowerCase().includes(query) ||
          u.fullName.toLowerCase().includes(query) ||
          (u.channelTitle && u.channelTitle.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [data?.users, planFilter, userSearch]);

  const filteredTickets = useMemo(() => {
    if (!data?.tickets) return [];
    return data.tickets.filter((t) => {
      if (ticketStatusFilter !== "ALL" && t.status !== ticketStatusFilter) return false;
      return true;
    });
  }, [data?.tickets, ticketStatusFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 space-y-4">
        <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
        <p className="text-xs font-semibold text-zinc-400">Loading BigRedHub Admin Console...</p>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 space-y-4 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-950/60 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="font-heading font-black text-2xl text-white">Access Denied</h1>
        <p className="text-xs text-zinc-400 max-w-sm mx-auto">
          This portal is restricted to authorized BigRedHub system administrators only.
        </p>
        <Link
          href="/dashboard"
          className="mt-4 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all inline-flex items-center gap-2"
        >
          <span>Return to Creator Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-red-600 selection:text-white">
      {/* TOP ADMIN BAR */}
      <header className="h-16 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-700 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-600/30">
            BRH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-black text-sm text-white tracking-wide">
                BigRedHub Admin Console
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/30">
                MASTER ADMIN
              </span>
            </div>
            <p className="text-[10px] text-zinc-400">
              Live Customer Analytics, Traffic, Help Desk & User Data
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAdminData}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer border border-zinc-700"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <Link
            href="/dashboard"
            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors border border-zinc-700 flex items-center gap-1.5"
          >
            <span>Customer Dashboard</span>
            <ExternalLink className="w-3 h-3 text-zinc-400" />
          </Link>
        </div>
      </header>

      {/* KPI STATS BANNER */}
      <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/40">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-7xl mx-auto">
          {/* Card 1: Total Users */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-semibold">Total Users</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-heading font-black text-white">
                {data?.metrics.totalUsers || 0}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                {data?.metrics.totalWorkspaces || 0} workspaces
              </span>
            </div>
          </div>

          {/* Card 2: Page Views Today */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-semibold">Page Views Today</span>
              <Eye className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-heading font-black text-emerald-400">
                {data?.metrics.pageViewsToday || 0}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                {data?.metrics.pageViewsTotal || 0} all-time
              </span>
            </div>
          </div>

          {/* Card 3: Unique Visitors */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-semibold">Unique Visitors</span>
              <Globe className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-heading font-black text-cyan-400">
                {data?.metrics.uniqueVisitorsToday || 0}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                {data?.metrics.uniqueVisitorsTotal || 0} unique IPs
              </span>
            </div>
          </div>

          {/* Card 4: Connected Channels */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-semibold">Channels Synced</span>
              <Video className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-heading font-black text-purple-400">
                {data?.metrics.totalChannels || 0}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                {data?.metrics.totalRules || 0} active campaigns
              </span>
            </div>
          </div>

          {/* Card 5: Replies Delivered */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-semibold">Replies Sent</span>
              <MessageSquare className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-heading font-black text-amber-400">
                {data?.metrics.totalRepliesDelivered || 0}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                {data?.metrics.totalCommentsMonitored || 0} monitored
              </span>
            </div>
          </div>

          {/* Card 6: Open Tickets */}
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] font-semibold">Support Tickets</span>
              <LifeBuoy className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2">
              <span className="text-2xl font-heading font-black text-rose-400">
                {data?.metrics.openTickets || 0}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-0.5">
                {data?.metrics.inProgressTickets || 0} in progress • {data?.metrics.resolvedTickets || 0} resolved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN ADMIN WORKSPACE */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "overview"
                ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Traffic & Visitor Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "users"
                ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Registered Users & Channels ({data?.users.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer relative ${
              activeTab === "tickets"
                ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Help Desk Tickets ({data?.tickets.length || 0})</span>
            {data?.metrics.openTickets ? (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                {data.metrics.openTickets}
              </span>
            ) : null}
          </button>
        </div>

        {/* TAB 1: VISITOR & TRAFFIC ANALYTICS */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top Visited Pages */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <h2 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Top Visited Pages</span>
                </h2>
                <div className="space-y-2">
                  {data?.analytics.topPages.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-800/60 last:border-0">
                      <span className="font-mono text-zinc-300 truncate max-w-[200px]">{p.path}</span>
                      <span className="font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {p.views} views
                      </span>
                    </div>
                  ))}
                  {(!data?.analytics.topPages || data.analytics.topPages.length === 0) && (
                    <p className="text-xs text-zinc-500 py-3 text-center">No visitor events recorded yet.</p>
                  )}
                </div>
              </div>

              {/* Top Referrers */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <h2 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Traffic Sources / Referrers</span>
                </h2>
                <div className="space-y-2">
                  {data?.analytics.topReferrers.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-800/60 last:border-0">
                      <span className="text-zinc-300 truncate max-w-[200px]">{r.source}</span>
                      <span className="font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/20">
                        {r.count} visits
                      </span>
                    </div>
                  ))}
                  {(!data?.analytics.topReferrers || data.analytics.topReferrers.length === 0) && (
                    <p className="text-xs text-zinc-500 py-3 text-center">No referrer data yet.</p>
                  )}
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
                <h2 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  <span>Device Distribution</span>
                </h2>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-zinc-300">
                      <Monitor className="w-4 h-4 text-indigo-400" />
                      <span>Desktop</span>
                    </span>
                    <span className="font-bold text-white">
                      {data?.analytics.deviceBreakdown.desktop || 0} visits
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-zinc-300">
                      <Smartphone className="w-4 h-4 text-purple-400" />
                      <span>Mobile</span>
                    </span>
                    <span className="font-bold text-white">
                      {data?.analytics.deviceBreakdown.mobile || 0} visits
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-zinc-300">
                      <Monitor className="w-4 h-4 text-zinc-400" />
                      <span>Tablet</span>
                    </span>
                    <span className="font-bold text-white">
                      {data?.analytics.deviceBreakdown.tablet || 0} visits
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-Time Visitor Stream Table */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <h2 className="font-heading font-bold text-sm text-white flex items-center justify-between">
                <span>Recent Live Page Visits Stream</span>
                <span className="text-[10px] text-zinc-400 font-normal">Last 30 visits</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="text-[10px] text-zinc-400 uppercase tracking-wider border-b border-zinc-800 bg-zinc-950/40">
                    <tr>
                      <th className="p-2.5">Time</th>
                      <th className="p-2.5">Path</th>
                      <th className="p-2.5">Device</th>
                      <th className="p-2.5">Country</th>
                      <th className="p-2.5">Referrer</th>
                      <th className="p-2.5">Visitor Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-mono text-[11px]">
                    {data?.analytics.recentVisitors.map((v) => (
                      <tr key={v.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-2.5 text-zinc-400">
                          {new Date(v.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </td>
                        <td className="p-2.5 text-white font-semibold">{v.path}</td>
                        <td className="p-2.5 capitalize text-zinc-300">{v.device}</td>
                        <td className="p-2.5 text-zinc-300">{v.country || "IN"}</td>
                        <td className="p-2.5 text-zinc-400 max-w-[200px] truncate">{v.referrer || "Direct"}</td>
                        <td className="p-2.5 text-zinc-500">{v.ip_hash}</td>
                      </tr>
                    ))}
                    {(!data?.analytics.recentVisitors || data.analytics.recentVisitors.length === 0) && (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-zinc-500 font-sans">
                          No visitor events logged yet. Open pages to start tracking.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGISTERED USERS & CHANNELS */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by email, name or channel..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-zinc-400">Plan:</span>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="ALL">All Plans</option>
                  <option value="free">Free</option>
                  <option value="growth">Pro (Growth)</option>
                  <option value="scale">Scale</option>
                  <option value="agency">Agency BYOK</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="text-[10px] text-zinc-400 uppercase tracking-wider border-b border-zinc-800 bg-zinc-950">
                    <tr>
                      <th className="p-3.5">User</th>
                      <th className="p-3.5">Connected YouTube Channel</th>
                      <th className="p-3.5">Subscription Plan</th>
                      <th className="p-3.5">BYOK Mode</th>
                      <th className="p-3.5">Campaigns</th>
                      <th className="p-3.5">Joined</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-zinc-800/40 transition-colors">
                        {/* User Identity */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-white">{user.fullName}</p>
                              <p className="text-[11px] text-zinc-400">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Channel */}
                        <td className="p-3.5">
                          {user.channelConnected ? (
                            <div>
                              <p className="font-bold text-white flex items-center gap-1.5">
                                <Video className="w-3.5 h-3.5 text-red-500" />
                                <span>{user.channelTitle}</span>
                              </p>
                              <p className="text-[11px] text-zinc-400">
                                {user.channelCustomUrl || "Synced"} • {(user.subscribers || 0).toLocaleString()} subs
                              </p>
                            </div>
                          ) : (
                            <span className="text-[11px] font-semibold text-zinc-500 italic">
                              No channel connected
                            </span>
                          )}
                        </td>

                        {/* Plan */}
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              user.plan === "agency"
                                ? "bg-amber-950/60 text-amber-400 border-amber-500/30"
                                : user.plan === "scale"
                                ? "bg-purple-950/60 text-purple-400 border-purple-500/30"
                                : user.plan === "growth"
                                ? "bg-indigo-950/60 text-indigo-400 border-indigo-500/30"
                                : "bg-zinc-800 text-zinc-400 border-zinc-700"
                            }`}
                          >
                            {user.plan}
                          </span>
                        </td>

                        {/* BYOK */}
                        <td className="p-3.5">
                          {user.byokEnabled ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              <Key className="w-3 h-3" />
                              <span>Dedicated BYOK</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-zinc-500">Shared Cloud Engine</span>
                          )}
                        </td>

                        {/* Campaigns */}
                        <td className="p-3.5">
                          <span className="font-semibold text-zinc-200">{user.rulesCount} rules</span>
                        </td>

                        {/* Joined Date */}
                        <td className="p-3.5 text-zinc-400 text-[11px]">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>

                        {/* Plan Management Action */}
                        <td className="p-3.5 text-right">
                          <select
                            value={user.plan}
                            disabled={updatingPlanUserId === user.workspaceId}
                            onChange={(e) => handleUpdateUserPlan(user.workspaceId, e.target.value)}
                            className="bg-zinc-950 border border-zinc-700 hover:border-zinc-500 rounded-lg px-2 py-1 text-[11px] text-zinc-200 focus:outline-none cursor-pointer"
                          >
                            <option value="free">Set Free</option>
                            <option value="growth">Set Pro</option>
                            <option value="scale">Set Scale</option>
                            <option value="agency">Set Agency</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-zinc-500">
                          No users matched your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HELP DESK TICKETS */}
        {activeTab === "tickets" && (
          <div className="space-y-4">
            {/* Ticket Filter Bar */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-red-500" />
                <span className="font-bold text-sm text-white">Customer Support Desk</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Status:</span>
                <select
                  value={ticketStatusFilter}
                  onChange={(e) => setTicketStatusFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="ALL">All Tickets</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Tickets Table */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-zinc-300">
                  <thead className="text-[10px] text-zinc-400 uppercase tracking-wider border-b border-zinc-800 bg-zinc-950">
                    <tr>
                      <th className="p-3.5">Ticket #</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Subject</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Priority</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Created</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/80">
                    {filteredTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-red-400">
                          {t.ticket_number}
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-white">{t.user_name}</p>
                          <p className="text-[11px] text-zinc-400">{t.user_email}</p>
                        </td>
                        <td className="p-3.5 max-w-[260px] truncate">
                          <span className="font-semibold text-white">{t.subject}</span>
                          <p className="text-[11px] text-zinc-400 truncate">{t.message}</p>
                        </td>
                        <td className="p-3.5 capitalize text-zinc-300">
                          {t.category.replace("_", " ")}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              t.priority === "urgent"
                                ? "bg-red-950 text-red-400 border border-red-500/40"
                                : t.priority === "high"
                                ? "bg-amber-950 text-amber-400 border border-amber-500/40"
                                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                            }`}
                          >
                            {t.priority}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              t.status === "open"
                                ? "bg-rose-950/80 text-rose-400 border border-rose-500/40 animate-pulse"
                                : t.status === "in_progress"
                                ? "bg-indigo-950/80 text-indigo-400 border border-indigo-500/40"
                                : "bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
                            }`}
                          >
                            {t.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-3.5 text-zinc-400 text-[11px]">
                          {new Date(t.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => openTicketDetail(t)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition-colors cursor-pointer"
                          >
                            Open Desk
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTickets.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-zinc-500">
                          No support tickets found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* TICKET DETAIL & ADMIN REPLY MODAL */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl p-6 space-y-5 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-red-400">
                    {selectedTicket.ticket_number}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      selectedTicket.status === "open"
                        ? "bg-rose-950 text-rose-400 border border-rose-500/40"
                        : selectedTicket.status === "in_progress"
                        ? "bg-indigo-950 text-indigo-400 border border-indigo-500/40"
                        : "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                    }`}
                  >
                    {selectedTicket.status.replace("_", " ")}
                  </span>
                </div>
                <h2 className="font-heading font-black text-base text-white mt-1">
                  {selectedTicket.subject}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Raised by: <strong>{selectedTicket.user_name}</strong> ({selectedTicket.user_email})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateTicketStatus(selectedTicket.id, e.target.value as any)}
                  className="bg-zinc-950 border border-zinc-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800">
              {ticketMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-2xl text-xs space-y-1.5 max-w-[85%] ${
                    msg.sender_type === "admin"
                      ? "ml-auto bg-red-950/40 border border-red-500/30 text-zinc-200"
                      : "mr-auto bg-zinc-800 border border-zinc-700 text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] text-zinc-400">
                    <span className="font-bold text-white flex items-center gap-1">
                      {msg.sender_type === "admin" ? "🛡️ BigRedHub Support" : `👤 ${msg.sender_name}`}
                    </span>
                    <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                </div>
              ))}
            </div>

            {/* Admin Reply Box */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <textarea
                rows={3}
                placeholder="Type your official admin response here to assist the customer..."
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-red-500 resize-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">
                  Sending an admin reply will notify the creator and mark ticket as In Progress.
                </span>

                <button
                  type="button"
                  onClick={handleSendAdminReply}
                  disabled={sendingReply || !adminReplyText.trim()}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {sendingReply && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{sendingReply ? "Sending..." : "Send Reply"}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
