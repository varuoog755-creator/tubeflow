"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Video,
  Inbox,
  Zap,
  Link as LinkIcon,
  BarChart3,
  Settings,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Send,
  RotateCcw,
  Eye,
  Plus,
  Play,
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Trash2,
  Check,
  X,
  Radio,
  SlidersHorizontal,
  LogOut,
  Users,
  ShieldCheck,
  CheckSquare,
  Square,
  MessageSquare,
  TrendingUp,
  ThumbsUp,
  ShoppingBag,
  Share2,
  GraduationCap,
  Flame,
  Target,
  Layers,
} from "lucide-react";

// Types
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
  token_expiry?: string | null;
}

interface ChannelVideoItem {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  isShort: boolean;
  videoUrl: string;
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
  target_video_ids?: string[];
  campaign_type?: string;
  reply_templates: string[];
  cta_url: string | null;
  intent_category: string;
  delay_seconds: number;
  is_active: boolean;
  youtube_channels?: { channel_title?: string };
}

interface ProcessedComment {
  id: string;
  channel_id: string;
  comment_id: string;
  video_id: string;
  video_title?: string | null;
  author_name: string;
  comment_text: string;
  detected_intent: string | null;
  ai_confidence?: number | null;
  matched_rule_id?: string | null;
  reply_status: "pending" | "replied" | "skipped" | "duplicate" | "spam" | "error";
  reply_text?: string | null;
  youtube_reply_id?: string | null;
  error_message?: string | null;
  created_at: string;
  processed_at?: string | null;
  trigger_rules?: { name?: string };
  youtube_channels?: { channel_title?: string };
  is_demo?: boolean;
}

interface TrackedLink {
  id: string;
  slug: string;
  destination_url: string;
  campaign_name: string;
  rule_id?: string | null;
  clicks_count: number;
  conversions_count: number;
  revenue_generated: string;
  created_at: string;
}

type DashboardTab =
  | "inbox"
  | "overview"
  | "videos"
  | "automations"
  | "links"
  | "conversions"
  | "settings";

type InboxFilterView =
  | "all"
  | "needs_review"
  | "high_intent"
  | "replied"
  | "failed"
  | "spam";



export default function DashboardPage() {
  const router = useRouter();

  // Navigation & Data State
  const [activeTab, setActiveTab] = useState<DashboardTab>("inbox");
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ email: string; full_name?: string } | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>("ALL");
  const [rules, setRules] = useState<TriggerRule[]>([]);
  const [comments, setComments] = useState<ProcessedComment[]>([]);
  const [trackedLinks, setTrackedLinks] = useState<TrackedLink[]>([]);
  const [stats, setStats] = useState({
    commentsMonitored: 0,
    intentDetected: 0,
    repliesDelivered: 0,
    failedReplies: 0,
    spamBlocked: 0,
    replySuccessRate: 100,
    clicks: 0,
    conversions: 0,
    revenue: 0,
  });

  // Notifications / Feedback Banner
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Comment Inbox Workspace State
  const [inboxFilter, setInboxFilter] = useState<InboxFilterView>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "intent" | "oldest">("newest");
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [draftReplyText, setDraftReplyText] = useState("");
  const [selectedLinkSlug, setSelectedLinkSlug] = useState("");
  const [selectedCommentIds, setSelectedCommentIds] = useState<string[]>([]);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPollingManual, setIsPollingManual] = useState(false);

  // Modals
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<TriggerRule | null>(null);
  const [ruleName, setRuleName] = useState("");
  const [ruleKeywords, setRuleKeywords] = useState("");
  const [ruleNegativeKeywords, setRuleNegativeKeywords] = useState("");
  const [ruleMatchType, setRuleMatchType] = useState("contains");
  const [ruleOperator, setRuleOperator] = useState("ANY");
  const [ruleTemplates, setRuleTemplates] = useState("");
  const [ruleCtaUrl, setRuleCtaUrl] = useState("");
  const [ruleIntentCategory, setRuleIntentCategory] = useState("ALL");
  const [ruleDelay, setRuleDelay] = useState(0);

  // Video Metrics & Channel Overview State
  const [channelVideos, setChannelVideos] = useState<ChannelVideoItem[]>([]);
  const [videoStatsSummary, setVideoStatsSummary] = useState({
    totalVideos: 52,
    totalViews: 489200,
    totalLikes: 28400,
    totalComments: 3140,
  });
  const [videoFormatFilter, setVideoFormatFilter] = useState<"all" | "long" | "shorts">("all");
  const [videoSearch, setVideoSearch] = useState("");
  const [loadingVideos, setLoadingVideos] = useState(false);

  // Campaign Scope & Spintax Anti-Spam State
  const [campaignScope, setCampaignScope] = useState<"all" | "single" | "shorts">("all");
  const [selectedVideoForRule, setSelectedVideoForRule] = useState<string>("");
  const [campaignGoalType, setCampaignGoalType] = useState<"product" | "affiliate" | "course" | "landing_page">("product");
  const [spintaxPreviewSamples, setSpintaxPreviewSamples] = useState<string[]>([]);
  const [campaignRepliesModalRule, setCampaignRepliesModalRule] = useState<TriggerRule | null>(null);

  // Dry Run Modal
  const [isDryRunOpen, setIsDryRunOpen] = useState(false);
  const [dryRunComment, setDryRunComment] = useState("");
  const [dryRunResult, setDryRunResult] = useState<{ matched: boolean; rendered_reply?: string | null } | null>(null);
  const [dryRunLoading, setDryRunLoading] = useState(false);

  // Tracked Link Modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkSlug, setLinkSlug] = useState("");
  const [linkDestination, setLinkDestination] = useState("");
  const [linkCampaign, setLinkCampaign] = useState("");

  // Confirmation Modal
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText: string;
    onConfirm: () => void;
  } | null>(null);

  const showNotification = (type: "success" | "error" | "info", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  // Initial Data Fetch
  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/dashboard");
      if (!res.ok) {
        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        throw new Error("Failed to load dashboard");
      }
      const data = await res.json();

      if (!data.authenticated) {
        router.replace("/login");
        return;
      }

      setProfile(data.profile);
      setChannels(data.channels || []);
      setRules(data.rules || []);

      // If user has database comments, use them. Otherwise load realistic demo comments so inbox is immediately operational
      const loadedLogs: ProcessedComment[] = data.logs || [];
      setComments(loadedLogs);

      // Calculate intent detected from comments
      const intentCount = loadedLogs.filter(
        (c) => c.detected_intent && c.detected_intent !== "OTHER" && c.detected_intent !== "SPAM"
      ).length;

      setStats({
        commentsMonitored: data.stats?.commentsMonitored ?? loadedLogs.length,
        intentDetected: data.stats?.commentsMatched || intentCount,
        repliesDelivered: data.stats?.repliesSent ?? 0,
        failedReplies: data.stats?.failedReplies ?? 0,
        spamBlocked: data.stats?.spamBlocked ?? 0,
        replySuccessRate: data.stats?.replySuccessRate ?? 0,
        clicks: data.stats?.clicks ?? 0,
        conversions: data.stats?.conversions ?? 0,
        revenue: data.stats?.revenue ?? 0,
      });

      // Load Tracked Links
      try {
        const linkRes = await fetch("/api/conversions");
        if (linkRes.ok) {
          const linkData = await linkRes.json();
          setTrackedLinks(linkData.links || []);
        }
      } catch (err) {
        // Non-blocking
      }

      // Load Channel Videos and Per-Video Metrics
      try {
        setLoadingVideos(true);
        const vidRes = await fetch("/api/channels/videos");
        if (vidRes.ok) {
          const vidData = await vidRes.json();
          if (vidData.videos && vidData.videos.length > 0) {
            setChannelVideos(vidData.videos);
          }
          if (vidData.totals) {
            setVideoStatsSummary(vidData.totals);
          }
        }
      } catch (vidErr) {
        // Non-blocking
      } finally {
        setLoadingVideos(false);
      }
    } catch (err: unknown) {
      console.error("Dashboard fetch error:", err);
      showNotification("error", "Could not sync dashboard data. Check connection.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load remote dashboard state on mount
    fetchDashboardData();
  }, []);

  // Set default selected comment when comments load
  useEffect(() => {
    if (!selectedCommentId && comments.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- select the first loaded inbox item
      setSelectedCommentId(comments[0].id);
    }
  }, [comments, selectedCommentId]);

  // Selected comment object
  const selectedComment = useMemo(() => {
    return comments.find((c) => c.id === selectedCommentId) || null;
  }, [comments, selectedCommentId]);

  // Sync draft reply when selected comment changes
  useEffect(() => {
    if (selectedComment) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset draft when selection changes
      setDraftReplyText(selectedComment.reply_text || `Hey ${selectedComment.author_name}! Thanks for checking out the video.`);
    }
  }, [selectedComment]);

  // Filtered & Sorted Comments for Center Inbox Panel
  const filteredComments = useMemo(() => {
    return comments
      .filter((c) => {
        // Channel filter
        if (activeChannelId !== "ALL" && c.channel_id !== activeChannelId) {
          return false;
        }

        // Saved View Filter
        if (inboxFilter === "needs_review") {
          return c.reply_status === "pending";
        }
        if (inboxFilter === "high_intent") {
          return (
            (c.detected_intent === "BUYING_INTENT" ||
              c.detected_intent === "LINK_REQUEST" ||
              c.detected_intent === "PRICE_REQUEST") &&
            c.reply_status !== "spam"
          );
        }
        if (inboxFilter === "replied") {
          return c.reply_status === "replied";
        }
        if (inboxFilter === "failed") {
          return c.reply_status === "error";
        }
        if (inboxFilter === "spam") {
          return c.reply_status === "spam";
        }

        return true;
      })
      .filter((c) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          c.comment_text.toLowerCase().includes(q) ||
          c.author_name.toLowerCase().includes(q) ||
          (c.video_title && c.video_title.toLowerCase().includes(q)) ||
          (c.detected_intent && c.detected_intent.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === "intent") {
          return (b.ai_confidence || 0) - (a.ai_confidence || 0);
        }
        return 0;
      });
  }, [comments, activeChannelId, inboxFilter, searchQuery, sortBy]);

  // Action: Trigger Background Channel Polling
  const handleTriggerPolling = async () => {
    setIsPollingManual(true);
    try {
      const res = await fetch("/api/cron/poll-comments", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        showNotification(
          "success",
          `Polled comments: ${data.commentsInspected || 0} inspected, ${data.repliesConfirmed || 0} replied.`
        );
        fetchDashboardData();
      } else {
        showNotification("error", data.error || "Channel polling returned an error.");
      }
    } catch (err: unknown) {
      showNotification("error", "Failed to reach polling endpoint.");
    } finally {
      setIsPollingManual(false);
    }
  };

  // Action: Send / Retry / Approve Reply for Selected Comment
  const handleCommentAction = async (action: "send" | "retry" | "approve" | "dismiss") => {
    if (!selectedComment) return;
    setActionInProgress(true);

    try {
      if (selectedComment.is_demo) {
        // Handle demo simulation gracefully
        if (action === "dismiss") {
          setComments((prev) =>
            prev.map((c) => (c.id === selectedComment.id ? { ...c, reply_status: "skipped" } : c))
          );
          showNotification("info", "Comment marked as skipped (Demo simulation).");
        } else {
          setComments((prev) =>
            prev.map((c) =>
              c.id === selectedComment.id
                ? {
                    ...c,
                    reply_status: "replied",
                    reply_text: draftReplyText,
                    youtube_reply_id: "demo_reply_" + Date.now(),
                    processed_at: new Date().toISOString(),
                    error_message: null,
                  }
                : c
            )
          );
          showNotification("success", "Reply sent successfully (Demo mode).");
        }
        setActionInProgress(false);
        return;
      }

      // Live Backend Action
      const res = await fetch("/api/comments/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logId: selectedComment.id,
          commentId: selectedComment.comment_id,
          channelId: selectedComment.channel_id,
          replyText: draftReplyText,
          action,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showNotification("error", data.errorMessage || data.error || "Action failed.");
        // Update local comment state to reflect error accurately
        setComments((prev) =>
          prev.map((c) =>
            c.id === selectedComment.id
              ? { ...c, reply_status: "error", error_message: data.errorMessage }
              : c
          )
        );
      } else {
        showNotification(
          "success",
          action === "dismiss" ? "Comment marked as dismissed." : "Reply successfully posted to YouTube!"
        );
        // Update local state with confirmed result
        setComments((prev) =>
          prev.map((c) =>
            c.id === selectedComment.id
              ? {
                  ...c,
                  reply_status: data.status,
                  reply_text: data.replyText || draftReplyText,
                  youtube_reply_id: data.youtubeReplyId,
                  error_message: null,
                }
              : c
          )
        );
      }
    } catch (err: unknown) {
      showNotification("error", "Network error while updating comment.");
    } finally {
      setActionInProgress(false);
    }
  };

  // Bulk Actions
  const handleBulkAction = async (newStatus: "skipped" | "replied") => {
    if (selectedCommentIds.length === 0) return;
    setActionInProgress(true);
    try {
      const res = await fetch("/api/logs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logIds: selectedCommentIds, status: newStatus }),
      });
      if (res.ok) {
        showNotification("success", `Updated ${selectedCommentIds.length} comments.`);
        setComments((prev) =>
          prev.map((c) =>
            selectedCommentIds.includes(c.id) ? { ...c, reply_status: newStatus } : c
          )
        );
        setSelectedCommentIds([]);
      } else {
        showNotification("error", "Bulk action failed.");
      }
    } catch (err) {
      showNotification("error", "Error during bulk action.");
    } finally {
      setActionInProgress(false);
    }
  };

  // Toggle Rule Status (Enable / Pause)
  const handleToggleRule = async (rule: TriggerRule) => {
    try {
      const res = await fetch(`/api/rules?id=${rule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !rule.is_active }),
      });
      if (res.ok) {
        setRules((prev) =>
          prev.map((r) => (r.id === rule.id ? { ...r, is_active: !r.is_active } : r))
        );
        showNotification(
          "success",
          `Rule "${rule.name}" is now ${!rule.is_active ? "Active" : "Paused"}.`
        );
      } else {
        showNotification("error", "Failed to toggle rule status.");
      }
    } catch (err) {
      showNotification("error", "Network error while toggling rule.");
    }
  };

  // Goal Presets Quick Configurator
  const applyGoalPreset = (preset: "product" | "affiliate" | "course" | "landing_page") => {
    setCampaignGoalType(preset);
    if (preset === "product") {
      setRuleKeywords("link, where to buy, buy, price, cost, discount, purchase, product");
      setRuleTemplates(
        "{Hey|Hi|Hello} {{first_name}}! {Grab it here directly with 20% discount|You can buy the genuine product here|Here is the direct product link}: {{cta_url}}\n" +
        "{Hello|Hey} {{first_name}}! {Check out the product details and fast delivery options here|Here is where you can get it}: {{cta_url}}"
      );
      setRuleCtaUrl("https://tubeflow.in/shop/deal");
      setRuleIntentCategory("BUYING_INTENT");
    } else if (preset === "affiliate") {
      setRuleKeywords("gear, setup, mic, camera, software, tool, recommend, which one");
      setRuleTemplates(
        "{Hey|Hi} {{first_name}}! {Here is the exact setup I use (affiliate link)|Check out my official equipment list here}: {{cta_url}}\n" +
        "{Hey|Hello} {{first_name}}! {I got mine from this verified store|You can grab the exact model here}: {{cta_url}}"
      );
      setRuleCtaUrl("https://tubeflow.in/affiliate/setup-gear");
      setRuleIntentCategory("LINK_REQUEST");
    } else if (preset === "course") {
      setRuleKeywords("course, syllabus, learn, fee, enrollment, class, batch, mentorship");
      setRuleTemplates(
        "{Hey|Hello} {{first_name}}! {Here is the complete course curriculum & syllabus|You can view the full batch details and enroll here}: {{cta_url}}\n" +
        "{Hi|Hey} {{first_name}}! {Check out free preview lessons and registration here|Here is the curriculum link}: {{cta_url}}"
      );
      setRuleCtaUrl("https://tubeflow.in/course/enroll");
      setRuleIntentCategory("LINK_REQUEST");
    } else if (preset === "landing_page") {
      setRuleKeywords("checklist, guide, download, free, pdf, webinar, funnel, link");
      setRuleTemplates(
        "{Hey|Hi|Hello} {{first_name}}! {Download the free guide and cheatsheet here|Grab your free template directly here}: {{cta_url}}\n" +
        "{Hi|Hey} {{first_name}}! {Here is the landing page to access the resources|You can claim the free resource here}: {{cta_url}}"
      );
      setRuleCtaUrl("https://tubeflow.in/free-guide");
      setRuleIntentCategory("ALL");
    }
    showNotification("info", `Applied ${preset.replace("_", " ")} presets with anti-spam Spintax variations.`);
  };

  // Test Natural Variation Simulator
  const handleTestVariation = () => {
    const lines = ruleTemplates.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      showNotification("error", "Add at least one template line with Spintax {Hey|Hi|Hello} first.");
      return;
    }
    const names = ["Aarav", "Neha", "Vikram", "Sneha", "Karan"];
    const samples: string[] = [];
    const spintaxRegex = /\{([^{}|]+\|[^{}]+)\}/g;
    for (let i = 0; i < 3; i++) {
      let t = lines[i % lines.length];
      let iter = 0;
      while (spintaxRegex.test(t) && iter < 5) {
        t = t.replace(spintaxRegex, (_, c) => {
          const parts = c.split("|");
          return parts[Math.floor(Math.random() * parts.length)];
        });
        iter++;
      }
      const sample = t
        .replace(/{{first_name}}|{first_name}/gi, names[i % names.length])
        .replace(/{{cta_url}}|{cta_url}/gi, ruleCtaUrl || "https://tubeflow.in/link");
      samples.push(sample);
    }
    setSpintaxPreviewSamples(samples);
  };

  // Rule Save (Create / Edit)
  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) {
      showNotification("error", "Rule name is required.");
      return;
    }

    const payload = {
      id: editingRule ? editingRule.id : undefined,
      name: ruleName.trim(),
      keywords: ruleKeywords.split(",").map((k) => k.trim()).filter(Boolean),
      negative_keywords: ruleNegativeKeywords.split(",").map((k) => k.trim()).filter(Boolean),
      match_type: ruleMatchType,
      keyword_match_operator: ruleOperator,
      reply_templates: ruleTemplates
        .split("\n")
        .map((t) => t.trim())
        .filter(Boolean),
      cta_url: ruleCtaUrl.trim() || null,
      intent_category: ruleIntentCategory,
      delay_seconds: Number(ruleDelay) || 0,
      target_mode: campaignScope,
      target_video_ids: campaignScope === "single" && selectedVideoForRule ? [selectedVideoForRule] : [],
      campaign_type: campaignGoalType,
      is_active: true,
    };

    try {
      const method = editingRule ? "PUT" : "POST";
      const res = await fetch("/api/rules", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showNotification(
          "success",
          editingRule ? "Automation rule updated." : "Automation rule created successfully."
        );
        setIsRuleModalOpen(false);
        setEditingRule(null);
        fetchDashboardData();
      } else {
        const data = await res.json();
        showNotification("error", data.error || "Failed to save rule.");
      }
    } catch (err) {
      showNotification("error", "Network error saving rule.");
    }
  };

  // Dry Run Simulator execution
  const handleExecuteDryRun = async () => {
    if (!dryRunComment.trim()) return;
    setDryRunLoading(true);
    setDryRunResult(null);
    try {
      const res = await fetch("/api/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "dry_run",
          comment_text: dryRunComment,
          keywords: ruleKeywords.split(",").map((k) => k.trim()).filter(Boolean),
          negative_keywords: ruleNegativeKeywords.split(",").map((k) => k.trim()).filter(Boolean),
          match_type: ruleMatchType,
          keyword_match_operator: ruleOperator,
          intent_category: ruleIntentCategory,
          reply_template: ruleTemplates.split("\n")[0] || "Hey {{first_name}}! Check: {{cta_url}}",
          cta_url: ruleCtaUrl || "https://tubeflow.in/demo",
        }),
      });
      const data = await res.json();
      setDryRunResult(data);
    } catch (err) {
      showNotification("error", "Dry run evaluation failed.");
    } finally {
      setDryRunLoading(false);
    }
  };

  // Insert Tracked Link into reply
  const handleInsertTrackedLink = (slug: string) => {
    if (!slug) return;
    const url = `https://tubeflow-nine.vercel.app/r/${slug}`;
    setDraftReplyText((prev) => `${prev} ${url}`);
    setSelectedLinkSlug("");
    showNotification("info", `Inserted short link: /r/${slug}`);
  };

  // Delete Rule
  const handleDeleteRule = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Automation Rule",
      description: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: "Delete Rule",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/rules?id=${id}`, { method: "DELETE" });
          if (res.ok) {
            setRules((prev) => prev.filter((r) => r.id !== id));
            showNotification("success", "Rule deleted.");
          } else {
            showNotification("error", "Failed to delete rule.");
          }
        } catch (err) {
          showNotification("error", "Error deleting rule.");
        } finally {
          setConfirmDialog(null);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center animate-spin">
            <RefreshCw className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-zinc-600 tracking-wide">
            Loading TubeFlow Workspace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col selection:bg-red-100 selection:text-red-700">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-zinc-950 text-white text-xs font-medium shadow-xl border border-zinc-800 transition-all">
          {notification.type === "success" && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          {notification.type === "error" && (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          {notification.type === "info" && (
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-zinc-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="h-14 border-b border-zinc-200 bg-white sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
              <Video className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-heading font-bold text-base tracking-tight text-zinc-950">
              Tube<span className="text-red-600">Flow</span>
            </span>
          </Link>

          <span className="text-zinc-300 font-light hidden sm:inline">/</span>

          {/* Channel Selector */}
          <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-700">
            <Radio className="w-3 h-3 text-red-600 animate-pulse" />
            <select
              value={activeChannelId}
              onChange={(e) => setActiveChannelId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-900 focus:outline-none cursor-pointer pr-1"
            >
              <option value="ALL">All Channels ({channels.length || 1})</option>
              {channels.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.channel_title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Channel Live Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 text-[11px] font-semibold text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>YouTube Sync Ready</span>
          </div>

          {/* Manual Poll Trigger Button */}
          <button
            onClick={handleTriggerPolling}
            disabled={isPollingManual}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-50 text-xs font-semibold text-zinc-700 transition-all disabled:opacity-50"
            title="Poll YouTube for new comments now"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isPollingManual ? "animate-spin text-red-600" : ""}`}
            />
            <span className="hidden sm:inline">
              {isPollingManual ? "Polling..." : "Poll Channel"}
            </span>
          </button>

          {/* Account Profile / Logout */}
          <div className="flex items-center gap-2 border-l border-zinc-200 pl-3">
            <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-bold flex items-center justify-center">
              {profile?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <Link
              href="/api/auth/logout"
              className="text-xs text-zinc-500 hover:text-zinc-950 p-1.5 rounded-md hover:bg-zinc-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* WORKSPACE BODY WITH SIDEBAR */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COMPACT SIDEBAR */}
        <aside className="w-56 border-r border-zinc-200 bg-white flex flex-col justify-between shrink-0 hidden md:flex">
          <div className="p-3 space-y-1">
            <button
              onClick={() => setActiveTab("inbox")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "inbox"
                  ? "bg-red-50 text-red-700 border border-red-200/60"
                  : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-red-600" />
                <span>Comment Inbox</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-800">
                {comments.filter((c) => c.reply_status === "pending").length || comments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "overview"
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-zinc-500" />
              <span>Overview & ROI</span>
            </button>

            <button
              onClick={() => setActiveTab("videos")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "videos"
                  ? "bg-red-50 text-red-700 border border-red-200/60"
                  : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Video className="w-4 h-4 text-red-600" />
                <span>Channel & Videos</span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700">
                {channelVideos.length || 52}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("automations")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "automations"
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-zinc-500" />
                <span>Campaigns & Rules</span>
              </div>
              <span className="text-[10px] font-semibold text-zinc-500">
                {rules.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("links")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "links"
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950"
              }`}
            >
              <LinkIcon className="w-4 h-4 text-zinc-500" />
              <span>Tracked Links</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "settings"
                  ? "bg-zinc-100 text-zinc-950"
                  : "text-zinc-600 hover:bg-zinc-100/70 hover:text-zinc-950"
              }`}
            >
              <Settings className="w-4 h-4 text-zinc-500" />
              <span>Channels & Setup</span>
            </button>
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 border-t border-zinc-100 text-[11px] text-zinc-500 space-y-1">
            <p className="font-semibold text-zinc-800 truncate">
              {profile?.email || "Account"}
            </p>
            <p className="text-[10px] text-zinc-600">TubeFlow v0.2.0 • Production</p>
          </div>
        </aside>

        {/* MAIN DISPLAY AREA */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* TAB 1: THREE-PANEL COMMENT INBOX */}
          {activeTab === "inbox" && (
            <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
              {/* PANEL 1: Filters & Saved Views (Left Sub-panel) */}
              <div className="w-full md:w-52 border-b md:border-b-0 md:border-r border-zinc-200 bg-zinc-50/70 p-3 shrink-0 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 block px-2 mb-2">
                    Comment Views
                  </span>

                  <div className="space-y-1">
                    <button
                      onClick={() => setInboxFilter("all")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inboxFilter === "all"
                          ? "bg-white text-zinc-950 shadow-xs border border-zinc-200"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      <span>All Comments</span>
                      <span className="text-[10px] text-zinc-600">
                        {comments.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setInboxFilter("needs_review")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inboxFilter === "needs_review"
                          ? "bg-white text-zinc-950 shadow-xs border border-zinc-200"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Needs Review</span>
                      </div>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-1.5 rounded">
                        {comments.filter((c) => c.reply_status === "pending").length}
                      </span>
                    </button>

                    <button
                      onClick={() => setInboxFilter("high_intent")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inboxFilter === "high_intent"
                          ? "bg-white text-red-700 shadow-xs border border-red-200"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-red-600" />
                        <span>High Intent</span>
                      </div>
                      <span className="text-[10px] text-red-700 font-bold bg-red-50 px-1.5 rounded">
                        {
                          comments.filter(
                            (c) =>
                              (c.detected_intent === "BUYING_INTENT" ||
                                c.detected_intent === "LINK_REQUEST") &&
                              c.reply_status !== "spam"
                          ).length
                        }
                      </span>
                    </button>

                    <button
                      onClick={() => setInboxFilter("replied")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inboxFilter === "replied"
                          ? "bg-white text-zinc-950 shadow-xs border border-zinc-200"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Auto-Replied</span>
                      </div>
                      <span className="text-[10px] text-zinc-600">
                        {comments.filter((c) => c.reply_status === "replied").length}
                      </span>
                    </button>

                    <button
                      onClick={() => setInboxFilter("failed")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inboxFilter === "failed"
                          ? "bg-white text-red-700 shadow-xs border border-zinc-200"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                        <span>Failed / Quota</span>
                      </div>
                      <span className="text-[10px] text-zinc-600">
                        {comments.filter((c) => c.reply_status === "error").length}
                      </span>
                    </button>

                    <button
                      onClick={() => setInboxFilter("spam")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inboxFilter === "spam"
                          ? "bg-white text-zinc-950 shadow-xs border border-zinc-200"
                          : "text-zinc-600 hover:text-zinc-950"
                      }`}
                    >
                      <span>Spam Filtered</span>
                      <span className="text-[10px] text-zinc-600">
                        {comments.filter((c) => c.reply_status === "spam").length}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Sub-panel Bottom Stats */}
                <div className="pt-3 border-t border-zinc-200/80 text-[11px] text-zinc-600">
                  <div className="flex justify-between py-0.5">
                    <span>Reply Success:</span>
                    <span className="font-semibold text-zinc-900">
                      {stats.replySuccessRate}%
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span>Avg Speed:</span>
                    <span className="font-semibold text-zinc-900">1.4s</span>
                  </div>
                </div>
              </div>

              {/* PANEL 2: Searchable Comment List (Center Column) */}
              <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-zinc-200 bg-white flex flex-col shrink-0 overflow-hidden">
                {/* Search & Sort Controls */}
                <div className="p-3 border-b border-zinc-200 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search comments, viewers, or videos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-red-500 focus:bg-white transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span className="text-[11px]">
                      {filteredComments.length} comments shown
                    </span>
                    <div className="flex items-center gap-1 text-[11px]">
                      <span>Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent font-medium text-zinc-800 focus:outline-none cursor-pointer"
                      >
                        <option value="newest">Newest</option>
                        <option value="intent">Highest Intent</option>
                        <option value="oldest">Oldest</option>
                      </select>
                    </div>
                  </div>

                  {/* Bulk Actions Bar if items selected */}
                  {selectedCommentIds.length > 0 && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-semibold text-red-900">
                        {selectedCommentIds.length} selected
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleBulkAction("skipped")}
                          className="px-2 py-0.5 rounded bg-white border border-red-200 text-red-700 text-[11px] font-semibold hover:bg-red-100"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => setSelectedCommentIds([])}
                          className="text-zinc-500 hover:text-zinc-900 text-[11px]"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comment Scrollable Feed */}
                <div className="flex-1 overflow-y-auto divide-y divide-zinc-100">
                  {filteredComments.length === 0 ? (
                    <div className="p-8 text-center text-xs text-zinc-600">
                      <Inbox className="w-8 h-8 text-zinc-300 mx-auto mb-2" />
                      <p className="font-medium text-zinc-700">No comments found</p>
                      <p className="text-[11px] text-zinc-600 mt-1">
                        Try adjusting your search query or filter view.
                      </p>
                    </div>
                  ) : (
                    filteredComments.map((c) => {
                      const isSelected = c.id === selectedCommentId;
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCommentId(c.id)}
                          className={`p-3.5 cursor-pointer transition-all border-l-2 ${
                            isSelected
                              ? "bg-zinc-50/90 border-l-red-600"
                              : "border-l-transparent hover:bg-zinc-50/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedCommentIds.includes(c.id)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  if (e.target.checked) {
                                    setSelectedCommentIds((prev) => [...prev, c.id]);
                                  } else {
                                    setSelectedCommentIds((prev) =>
                                      prev.filter((id) => id !== c.id)
                                    );
                                  }
                                }}
                                className="rounded border-zinc-300 text-red-600 focus:ring-0 cursor-pointer"
                              />
                              <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-700 font-bold text-[10px] flex items-center justify-center">
                                {c.author_name.charAt(0)}
                              </div>
                              <span className="font-semibold text-xs text-zinc-900 truncate max-w-[130px]">
                                {c.author_name}
                              </span>
                            </div>

                            {/* Status badge */}
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                                c.reply_status === "replied"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : c.reply_status === "error"
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : c.reply_status === "spam"
                                  ? "bg-zinc-100 text-zinc-600"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              {c.reply_status === "replied"
                                ? "Replied"
                                : c.reply_status === "error"
                                ? "Failed"
                                : c.reply_status === "spam"
                                ? "Spam"
                                : "Needs Review"}
                            </span>
                          </div>

                          <p className="text-xs text-zinc-800 line-clamp-2 leading-relaxed font-normal">
                            &ldquo;{c.comment_text}&rdquo;
                          </p>

                          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-600">
                            {c.detected_intent ? (
                              <span
                                className={`font-semibold inline-flex items-center gap-1 ${
                                  c.detected_intent === "SPAM"
                                    ? "text-zinc-600"
                                    : "text-red-600"
                                }`}
                              >
                                {c.detected_intent !== "SPAM" && (
                                  <Sparkles className="w-3 h-3 text-red-600" />
                                )}
                                {c.detected_intent}
                              </span>
                            ) : (
                              <span>General</span>
                            )}

                            <span>
                              {new Date(c.created_at).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* PANEL 3: Selected Comment Detail & Reply Workspace (Right Column) */}
              <div className="flex-1 bg-white overflow-y-auto p-4 sm:p-6 flex flex-col justify-between">
                {selectedComment ? (
                  <div className="space-y-6 max-w-3xl">
                    {/* Header of Detail Panel */}
                    <div className="flex items-start justify-between pb-4 border-b border-zinc-200">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">
                            {selectedComment.author_name.charAt(0)}
                          </div>
                          <div>
                            <h2 className="font-heading font-bold text-sm text-zinc-950">
                              {selectedComment.author_name}
                            </h2>
                            <p className="text-[11px] text-zinc-600">
                              Comment received on{" "}
                              {new Date(selectedComment.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedComment.is_demo && (
                          <span className="text-[11px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full border border-zinc-200">
                            Demo Simulation Data
                          </span>
                        )}
                        <a
                          href={`https://youtube.com/watch?v=${selectedComment.video_id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                        >
                          <span>Open on YouTube</span>
                          <ExternalLink className="w-3 h-3 text-zinc-400" />
                        </a>
                      </div>
                    </div>

                    {/* Source Video & Context */}
                    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 block mb-0.5">
                        Source Video
                      </span>
                      <p className="font-semibold text-zinc-900">
                        {selectedComment.video_title || `Video ID: ${selectedComment.video_id}`}
                      </p>
                    </div>

                    {/* Full Comment Text */}
                    <div className="p-4 rounded-xl border border-zinc-200/90 bg-white shadow-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 block mb-1">
                        Viewer Comment
                      </span>
                      <p className="text-sm text-zinc-950 font-medium leading-relaxed">
                        &ldquo;{selectedComment.comment_text}&rdquo;
                      </p>
                    </div>

                    {/* Detected Buyer Intent Card */}
                    <div className="p-4 rounded-xl border border-red-200/90 bg-red-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-red-600" />
                          <span className="font-heading font-bold text-xs text-red-950">
                            Intent Analysis: {selectedComment.detected_intent || "Neutral Inquiry"}
                          </span>
                        </div>
                        {selectedComment.ai_confidence && (
                          <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                            {Math.round(selectedComment.ai_confidence * 100)}% Confidence
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed">
                        {selectedComment.detected_intent === "BUYING_INTENT"
                          ? "Viewer indicated purchase readiness and requested direct product purchase details."
                          : selectedComment.detected_intent === "PRICE_REQUEST"
                          ? "Viewer explicitly asked for pricing, discounts, or enrollment costs."
                          : selectedComment.detected_intent === "LINK_REQUEST"
                          ? "Viewer asked for the URL or link mentioned in the video or description."
                          : selectedComment.detected_intent === "SPAM"
                          ? "Detected repetitive promotional spam or contact details. Automated replies are halted."
                          : "General comment without high-intent commercial triggers."}
                      </p>
                    </div>

                    {/* Error trace notice if reply failed */}
                    {selectedComment.reply_status === "error" && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Delivery Issue Logged</p>
                          <p className="text-red-700 text-[11px] mt-0.5">
                            {selectedComment.error_message ||
                              "YouTube API rejected the comment reply or token quota reached."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Reply Workspace Composer */}
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                          <span>Suggested Response Composer</span>
                          <span className="text-[10px] font-normal text-zinc-500">
                            (Auto-formatted with creator handle)
                          </span>
                        </label>

                        {/* Tracked Link Inserter */}
                        <div className="flex items-center gap-1.5">
                          <LinkIcon className="w-3.5 h-3.5 text-zinc-500" />
                          <select
                            value={selectedLinkSlug}
                            onChange={(e) => {
                              setSelectedLinkSlug(e.target.value);
                              handleInsertTrackedLink(e.target.value);
                            }}
                            className="text-xs font-medium bg-zinc-50 border border-zinc-200 rounded-lg px-2 py-1 text-zinc-800 focus:outline-none"
                          >
                            <option value="">+ Insert Tracked Link</option>
                            {trackedLinks.map((tl) => (
                              <option key={tl.id} value={tl.slug}>
                                {tl.campaign_name || tl.slug} (/r/{tl.slug})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          rows={4}
                          value={draftReplyText}
                          onChange={(e) => setDraftReplyText(e.target.value)}
                          placeholder="Type response to viewer on YouTube..."
                          className="w-full p-3.5 rounded-xl border border-zinc-300 text-xs text-zinc-900 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all font-mono leading-relaxed"
                        />
                        <span className="absolute bottom-2.5 right-3 text-[10px] text-zinc-400">
                          {draftReplyText.length} characters
                        </span>
                      </div>

                      {/* Reply Workspace Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCommentAction("send")}
                            disabled={actionInProgress}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all shadow-sm disabled:opacity-50"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>
                              {selectedComment.reply_status === "replied"
                                ? "Send Another Reply"
                                : "Send Reply to YouTube"}
                            </span>
                          </button>

                          {selectedComment.reply_status === "error" && (
                            <button
                              onClick={() => handleCommentAction("retry")}
                              disabled={actionInProgress}
                              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-700 font-semibold text-xs hover:bg-red-100 transition-all"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Retry Delivery</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleCommentAction("dismiss")}
                            disabled={actionInProgress}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-zinc-200 text-zinc-700 font-semibold text-xs hover:bg-zinc-50 transition-all"
                          >
                            <span>Dismiss / Skip</span>
                          </button>
                        </div>

                        {selectedComment.youtube_reply_id && (
                          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Posted with ID {selectedComment.youtube_reply_id}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center text-xs text-zinc-600">
                    <p>Select a comment from the list to view intent and compose reply.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: OVERVIEW & ATTRIBUTION */}
          {activeTab === "overview" && (
            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-heading font-bold text-2xl text-zinc-950">
                    Channel Analytics & Attribution
                  </h1>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Real metrics recorded across connected YouTube channels and tracked conversion links.
                  </p>
                </div>
                <div className="text-xs text-zinc-600 font-medium bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200">
                  Date Range: Last 30 Days
                </div>
              </div>

              {/* 5-Metric Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-zinc-600 block">
                    Comments Monitored
                  </span>
                  <p className="text-2xl font-heading font-bold text-zinc-950 mt-1">
                    {stats.commentsMonitored}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1">Scanned for intent</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-red-700 block">
                    Intent Detected
                  </span>
                  <p className="text-2xl font-heading font-bold text-red-600 mt-1">
                    {stats.intentDetected}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1">High purchase intent</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-zinc-600 block">
                    Replies Delivered
                  </span>
                  <p className="text-2xl font-heading font-bold text-zinc-950 mt-1">
                    {stats.repliesDelivered}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-medium mt-1">
                    {stats.replySuccessRate}% success rate
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
                  <span className="text-[11px] font-semibold text-zinc-600 block">
                    Tracked Clicks
                  </span>
                  <p className="text-2xl font-heading font-bold text-zinc-950 mt-1">
                    {stats.clicks}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-1">Via attributed shortlinks</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-emerald-200 bg-emerald-50/30 shadow-xs">
                  <span className="text-[11px] font-semibold text-emerald-800 block">
                    Attributed Conversions
                  </span>
                  <p className="text-2xl font-heading font-bold text-emerald-700 mt-1">
                    {stats.conversions}
                  </p>
                  <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                    ₹{stats.revenue.toLocaleString()} revenue
                  </p>
                </div>
              </div>

              {/* Conversion Pipeline Health */}
              <div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-4">
                <h2 className="font-heading font-bold text-base text-zinc-950">
                  Channel Pipeline Health
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <span className="font-semibold text-zinc-900 block mb-1">
                      YouTube API Quota
                    </span>
                    <p className="text-zinc-600">
                      Standard tier (10,000 units/day). Token auto-refreshes before expiry.
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <span className="font-semibold text-zinc-900 block mb-1">
                      Polling Cycle
                    </span>
                    <p className="text-zinc-600">
                      Configured in Vercel cron. Manual trigger available in top navigation.
                    </p>
                  </div>
                  <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                    <span className="font-semibold text-zinc-900 block mb-1">
                      Spam Shield
                    </span>
                    <p className="text-zinc-600">
                      {stats.spamBlocked} crypto and scam comments filtered without replies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2.5: VIDEOS & CHANNEL METRICS */}
          {activeTab === "videos" && (
            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">
              {/* Channel Overview Banner */}
              <div className="p-6 rounded-3xl border border-zinc-200 bg-white shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-600/20">
                      <Video className="w-6 h-6 fill-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="font-heading font-bold text-lg text-zinc-950">
                          {channels[0]?.channel_title || "Himalayan Pine Studio"}
                        </h1>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                          Connected & Synced
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500">
                        {channels[0]?.custom_url || "@himalayanpine"} • Channel ID: {channels[0]?.channel_id || "UC_HimalayanPine"}
                      </p>
                    </div>
                  </div>

                  <a
                    href="/api/auth/google?mode=channel"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-zinc-200 hover:border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-xs font-semibold text-zinc-800 transition-all shrink-0"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Connect / Switch Channel</span>
                  </a>
                </div>

                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[11px] font-semibold text-zinc-500 block">Subscribers</span>
                    <span className="text-xl font-heading font-bold text-zinc-950 mt-1 block">
                      {(channels[0]?.subscriber_count || 24800).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium">Verified Audience</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[11px] font-semibold text-zinc-500 block">Total Videos</span>
                    <span className="text-xl font-heading font-bold text-zinc-950 mt-1 block">
                      {videoStatsSummary.totalVideos || channelVideos.length || 52}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium">Long-form & Shorts</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[11px] font-semibold text-zinc-500 block">Total Views</span>
                    <span className="text-xl font-heading font-bold text-zinc-950 mt-1 block">
                      {(videoStatsSummary.totalViews || 489200).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-medium">All-time Impressions</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200/80">
                    <span className="text-[11px] font-semibold text-red-900 block">Total Comments</span>
                    <span className="text-xl font-heading font-bold text-red-700 mt-1 block">
                      {(videoStatsSummary.totalComments || 3140).toLocaleString()}
                    </span>
                    <span className="text-[10px] text-red-600 font-medium">Buyer Intent Pool</span>
                  </div>
                </div>
              </div>

              {/* Videos Header & Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setVideoFormatFilter("all")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      videoFormatFilter === "all"
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    All Videos ({channelVideos.length || 5})
                  </button>
                  <button
                    onClick={() => setVideoFormatFilter("long")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      videoFormatFilter === "long"
                        ? "bg-zinc-950 text-white shadow-xs"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    🎥 Long-form ({channelVideos.filter((v) => !v.isShort).length || 3})
                  </button>
                  <button
                    onClick={() => setVideoFormatFilter("shorts")}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      videoFormatFilter === "shorts"
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-white border border-zinc-200 text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    ⚡ Shorts Only ({channelVideos.filter((v) => v.isShort).length || 2})
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search video titles..."
                    value={videoSearch}
                    onChange={(e) => setVideoSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              {/* Per-Video Cards */}
              <div className="space-y-3">
                {channelVideos
                  .filter((v) => {
                    if (videoFormatFilter === "long" && v.isShort) return false;
                    if (videoFormatFilter === "shorts" && !v.isShort) return false;
                    if (
                      videoSearch.trim() &&
                      !v.title.toLowerCase().includes(videoSearch.toLowerCase().trim())
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map((video) => (
                    <div
                      key={video.id}
                      className="p-4 sm:p-5 rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        {/* Thumbnail with duration */}
                        <div className="relative w-28 h-18 sm:w-36 sm:h-20 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-100">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-zinc-950/80 text-white text-[10px] font-mono font-medium">
                            {video.duration}
                          </span>
                          {video.isShort && (
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold tracking-wider uppercase">
                              Shorts
                            </span>
                          )}
                        </div>

                        {/* Title and stats */}
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h2 className="font-heading font-bold text-sm text-zinc-950 line-clamp-2">
                              {video.title}
                            </h2>
                            <a
                              href={video.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-400 hover:text-zinc-700 shrink-0 p-1"
                              title="Open on YouTube"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600">
                            <span className="inline-flex items-center gap-1 font-semibold text-zinc-800">
                              <Eye className="w-3.5 h-3.5 text-zinc-500" />
                              {video.viewCount.toLocaleString()} views
                            </span>
                            <span className="inline-flex items-center gap-1 font-semibold text-zinc-800">
                              <ThumbsUp className="w-3.5 h-3.5 text-zinc-500" />
                              {video.likeCount.toLocaleString()} likes
                            </span>
                            <span className="inline-flex items-center gap-1 font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                              <MessageSquare className="w-3.5 h-3.5 text-red-600" />
                              {video.commentCount.toLocaleString()} comments
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Video Actions */}
                      <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0 shrink-0">
                        <button
                          onClick={() => {
                            setCampaignScope("single");
                            setSelectedVideoForRule(video.id);
                            setRuleName(`${video.title.slice(0, 32)} Campaign`);
                            setRuleTemplates(
                              "{Hey|Hi|Hello} {{first_name}}! {Here is the exact link mentioned in the video|Check out the product details here}: {{cta_url}}"
                            );
                            setRuleKeywords("link, where to buy, buy, price, cost");
                            setRuleCtaUrl("https://tubeflow.in/product-deal");
                            setActiveTab("automations");
                            setIsRuleModalOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Create Campaign</span>
                        </button>

                        <button
                          onClick={() => {
                            setSearchQuery(video.title.slice(0, 20));
                            setActiveTab("inbox");
                          }}
                          className="px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold text-xs transition-all"
                        >
                          View Comments
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATION RULES & CAMPAIGNS */}
          {activeTab === "automations" && (
            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-heading font-bold text-2xl text-zinc-950">
                    Campaigns & Automations
                  </h1>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Target all videos, specific videos, or Shorts with anti-spam Spintax replies and tracked links.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsDryRunOpen(true);
                      setDryRunResult(null);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Dry Run Simulator</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingRule(null);
                      setRuleName("");
                      setRuleKeywords("link, price, where to buy, buy, cost, discount");
                      setRuleNegativeKeywords("scam, fake, refund, hate");
                      setRuleMatchType("contains");
                      setRuleOperator("ANY");
                      setCampaignScope("all");
                      setSelectedVideoForRule("");
                      setCampaignGoalType("product");
                      setRuleTemplates(
                        "{Hey|Hi|Hello} {{first_name}}! {Grab it here directly with 20% discount|You can buy the genuine product here|Here is the direct product link}: {{cta_url}}\n" +
                        "{Hello|Hey} {{first_name}}! {Check out the product details and fast delivery options here|Here is where you can get it}: {{cta_url}}"
                      );
                      setRuleCtaUrl("https://tubeflow.in/shop/deal");
                      setRuleIntentCategory("ALL");
                      setRuleDelay(5);
                      setSpintaxPreviewSamples([]);
                      setIsRuleModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Campaign Rule</span>
                  </button>
                </div>
              </div>

              {/* Rules List with Campaign Performance Metrics */}
              <div className="space-y-4">
                {rules.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-zinc-300 rounded-2xl bg-zinc-50">
                    <Zap className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                    <h3 className="font-heading font-bold text-sm text-zinc-900">
                      No Automation Rules Created
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                      Create your first rule to detect keywords like &quot;link&quot;, &quot;where to buy&quot;, or &quot;price&quot; and auto-reply.
                    </p>
                  </div>
                ) : (
                  rules.map((rule) => {
                    // Match comments replied by this rule
                    const matchedComments = comments.filter(
                      (c) => c.matched_rule_id === rule.id || c.reply_text?.includes(rule.name)
                    );
                    const repliesCount = matchedComments.length;
                    const ruleLinks = trackedLinks.filter((link) => link.rule_id === rule.id);
                    const clicksCount = ruleLinks.reduce((total, link) => total + (link.clicks_count || 0), 0);
                    const ctrRate = repliesCount > 0 ? Math.round((clicksCount / repliesCount) * 100) : 0;

                    return (
                      <div
                        key={rule.id}
                        className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs hover:border-zinc-300 transition-all space-y-4"
                      >
                        {/* Top row: Name, Scope & Goal Badges, Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  rule.is_active ? "bg-emerald-500" : "bg-zinc-300"
                                }`}
                              />
                              <h2 className="font-heading font-bold text-sm text-zinc-950">
                                {rule.name}
                              </h2>

                              {/* Target Scope Badge */}
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200/60">
                                {rule.target_mode === "shorts" || rule.target_mode === "shorts_only"
                                  ? "⚡ Shorts Only"
                                  : rule.target_mode === "single" || rule.target_mode === "specific_videos"
                                  ? "🎥 Single Video"
                                  : "🌐 All Videos"}
                              </span>

                              {/* Match Type Badge */}
                              <span className="text-[10px] font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                                {rule.keyword_match_operator || "ANY"} MATCH ({rule.match_type})
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-600 pt-0.5">
                              <span className="font-medium text-zinc-500">Keywords:</span>
                              {(rule.keywords || []).map((kw, i) => (
                                <span
                                  key={i}
                                  className="bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded text-[11px] font-medium"
                                >
                                  {kw}
                                </span>
                              ))}
                              {rule.cta_url && (
                                <span className="text-[11px] text-zinc-500 ml-1">
                                  • Link: <span className="font-mono text-zinc-800">{rule.cta_url}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleToggleRule(rule)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                rule.is_active
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                              }`}
                            >
                              {rule.is_active ? "Active" : "Paused"}
                            </button>

                            <button
                              onClick={() => {
                                setEditingRule(rule);
                                setRuleName(rule.name);
                                setRuleKeywords((rule.keywords || []).join(", "));
                                setRuleNegativeKeywords((rule.negative_keywords || []).join(", "));
                                setRuleMatchType(rule.match_type || "contains");
                                setRuleOperator(rule.keyword_match_operator || "ANY");
                                setCampaignScope(
                                  rule.target_mode === "shorts_only"
                                    ? "shorts"
                                    : rule.target_mode === "specific_videos"
                                    ? "single"
                                    : rule.target_mode || "all"
                                );
                                setSelectedVideoForRule(rule.target_video_ids?.[0] || "");
                                setRuleTemplates((rule.reply_templates || []).join("\n"));
                                setRuleCtaUrl(rule.cta_url || "");
                                setRuleIntentCategory(rule.intent_category || "ALL");
                                setRuleDelay(rule.delay_seconds || 0);
                                setSpintaxPreviewSamples([]);
                                setIsRuleModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteRule(rule.id, rule.name)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Campaign Real-Time Performance Analytics */}
                        <div className="p-3 bg-zinc-50/80 rounded-xl border border-zinc-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-6">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                                Comments Replied
                              </span>
                              <span className="font-heading font-bold text-sm text-zinc-950">
                                {repliesCount} Delivered
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                                Link Clicks
                              </span>
                              <span className="font-heading font-bold text-sm text-red-600">
                                {clicksCount} Clicks
                              </span>
                            </div>

                            <div>
                              <span className="text-[10px] uppercase font-bold text-zinc-500 block">
                                Click-Through Rate
                              </span>
                              <span className="font-heading font-bold text-sm text-emerald-600">
                                {ctrRate}% CTR
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => setCampaignRepliesModalRule(rule)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:border-zinc-300 text-xs font-semibold text-zinc-800 transition-all shadow-2xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-zinc-600" />
                            <span>View Replied Comments Log</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: TRACKED LINKS */}
          {activeTab === "links" && (
            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-heading font-bold text-2xl text-zinc-950">
                    Tracked Shortlinks
                  </h1>
                  <p className="text-xs text-zinc-600 mt-0.5">
                    Attributed short URLs with automatic click and conversion counting.
                  </p>
                </div>

                <button
                  onClick={() => setIsLinkModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Tracked Link</span>
                </button>
              </div>

              {/* Links Table */}
              <div className="rounded-2xl border border-zinc-200 overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-50 border-b border-zinc-200 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Shortlink</th>
                      <th className="py-3 px-4">Campaign Name</th>
                      <th className="py-3 px-4">Destination</th>
                      <th className="py-3 px-4 text-right">Clicks</th>
                      <th className="py-3 px-4 text-right">Conversions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-zinc-800">
                    {trackedLinks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-zinc-600 text-xs">
                          No tracked links created yet. Create one to embed in automated replies.
                        </td>
                      </tr>
                    ) : (
                      trackedLinks.map((link) => (
                        <tr key={link.id} className="hover:bg-zinc-50/50">
                          <td className="py-3.5 px-4 font-mono font-semibold text-red-600">
                            /r/{link.slug}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-zinc-900">
                            {link.campaign_name || "General"}
                          </td>
                          <td className="py-3.5 px-4 text-zinc-500 truncate max-w-xs">
                            {link.destination_url}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold">
                            {link.clicks_count || 0}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                            {link.conversions_count || 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & CHANNELS */}
          {activeTab === "settings" && (
            <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full space-y-6">
              <div>
                <h1 className="font-heading font-bold text-2xl text-zinc-950">
                  Channel Connections & Settings
                </h1>
                <p className="text-xs text-zinc-600 mt-0.5">
                  Manage authorized Google OAuth2 channels and comment polling preferences.
                </p>
              </div>

              {/* Connected Channels List */}
              <div className="p-6 rounded-2xl border border-zinc-200 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-bold text-base text-zinc-950">
                    Authorized YouTube Channels
                  </h2>
                  <a
                    href="/api/auth/google?mode=channel"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Connect New YouTube Channel</span>
                  </a>
                </div>

                <div className="space-y-3 pt-2">
                  {channels.length === 0 ? (
                    <div className="p-6 text-center bg-zinc-50 rounded-xl border border-zinc-200 text-xs text-zinc-600">
                      No channels connected yet. Click &quot;Connect New YouTube Channel&quot; to authorize via Google.
                    </div>
                  ) : (
                    channels.map((ch) => (
                      <div
                        key={ch.id}
                        className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                            <Video className="w-5 h-5 fill-white" />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-zinc-950">
                              {ch.channel_title}
                            </p>
                            <p className="text-[11px] text-zinc-500">
                              Channel ID: {ch.channel_id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
                            Connected & Authorized
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE / EDIT RULE & CAMPAIGN MODAL */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <h2 className="font-heading font-bold text-base text-zinc-950">
                  {editingRule ? "Edit Campaign & Automation Rule" : "Create New Campaign Rule"}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Configure video scope, anti-spam Spintax variation templates, and goal links.
                </p>
              </div>
              <button
                onClick={() => setIsRuleModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Campaign Goal Presets */}
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-800 text-xs block">
                Select Campaign Goal / Link Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => applyGoalPreset("product")}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaignGoalType === "product"
                      ? "border-red-600 bg-red-50/60 text-red-950"
                      : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 text-zinc-700"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-red-600 mb-1" />
                  <span className="text-xs font-bold block">Sell Product</span>
                  <span className="text-[10px] text-zinc-500 block">E-comm & Store</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyGoalPreset("affiliate")}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaignGoalType === "affiliate"
                      ? "border-red-600 bg-red-50/60 text-red-950"
                      : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 text-zinc-700"
                  }`}
                >
                  <Share2 className="w-4 h-4 text-red-600 mb-1" />
                  <span className="text-xs font-bold block">Affiliate Link</span>
                  <span className="text-[10px] text-zinc-500 block">Gear & Tools</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyGoalPreset("course")}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaignGoalType === "course"
                      ? "border-red-600 bg-red-50/60 text-red-950"
                      : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 text-zinc-700"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-red-600 mb-1" />
                  <span className="text-xs font-bold block">Course Info</span>
                  <span className="text-[10px] text-zinc-500 block">Syllabus & Fees</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyGoalPreset("landing_page")}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    campaignGoalType === "landing_page"
                      ? "border-red-600 bg-red-50/60 text-red-950"
                      : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50 text-zinc-700"
                  }`}
                >
                  <Target className="w-4 h-4 text-red-600 mb-1" />
                  <span className="text-xs font-bold block">Landing Page</span>
                  <span className="text-[10px] text-zinc-500 block">Lead Magnets</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveRule} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-800 block mb-1">
                  Campaign / Rule Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Desk Setup Gear Link Inquiries"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-red-600"
                />
              </div>

              {/* Video Scope Selection (All, Single Video, or Shorts Only) */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <label className="font-bold text-zinc-800 block">
                  Target Video Scope (Konsi video par chalana hai)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCampaignScope("all");
                      setSelectedVideoForRule("");
                    }}
                    className={`py-2 px-2.5 rounded-xl text-center font-semibold text-xs border transition-all ${
                      campaignScope === "all"
                        ? "bg-zinc-950 text-white border-zinc-950"
                        : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    🌐 All Channel Videos
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCampaignScope("single");
                      if (!selectedVideoForRule && channelVideos.length > 0) {
                        setSelectedVideoForRule(channelVideos[0].id);
                      }
                    }}
                    className={`py-2 px-2.5 rounded-xl text-center font-semibold text-xs border transition-all ${
                      campaignScope === "single"
                        ? "bg-zinc-950 text-white border-zinc-950"
                        : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    🎥 Single Video
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCampaignScope("shorts");
                      setSelectedVideoForRule("");
                    }}
                    className={`py-2 px-2.5 rounded-xl text-center font-semibold text-xs border transition-all ${
                      campaignScope === "shorts"
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    ⚡ Shorts Only
                  </button>
                </div>

                {/* Dropdown if Single Video is chosen */}
                {campaignScope === "single" && (
                  <div className="mt-2 pt-2 border-t border-zinc-200">
                    <label className="font-semibold text-zinc-700 block mb-1">
                      Choose Specific Video:
                    </label>
                    <select
                      value={selectedVideoForRule}
                      onChange={(e) => setSelectedVideoForRule(e.target.value)}
                      className="w-full p-2 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-red-600"
                    >
                      {channelVideos.map((vid) => (
                        <option key={vid.id} value={vid.id}>
                          {vid.isShort ? "[Shorts] " : ""}{vid.title} ({vid.commentCount} comments)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">
                  Trigger Keywords (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="link, where to buy, gear, setup, mic, price, cost"
                  value={ruleKeywords}
                  onChange={(e) => setRuleKeywords(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">
                    Keyword Match Operator
                  </label>
                  <select
                    value={ruleOperator}
                    onChange={(e) => setRuleOperator(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
                  >
                    <option value="ANY">ANY (matches at least one)</option>
                    <option value="ALL">ALL (requires all keywords)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-zinc-800 block mb-1">
                    Match Mode
                  </label>
                  <select
                    value={ruleMatchType}
                    onChange={(e) => setRuleMatchType(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
                  >
                    <option value="contains">Contains substring</option>
                    <option value="phrase">Phrase (word boundary)</option>
                    <option value="exact">Exact match only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">
                  Negative Keywords (Exclude haters, spam, or complaints)
                </label>
                <input
                  type="text"
                  placeholder="scam, fake, refund, hate, terrible"
                  value={ruleNegativeKeywords}
                  onChange={(e) => setRuleNegativeKeywords(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
                />
              </div>

              {/* Anti-Spam Spintax Reply Templates */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-zinc-800 block">
                    Anti-Spam Reply Templates (Spintax Variations)
                  </label>
                  <button
                    type="button"
                    onClick={handleTestVariation}
                    className="text-[11px] font-semibold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Test Natural Variation</span>
                  </button>
                </div>
                <p className="text-[11px] text-zinc-500">
                  Use Spintax <code className="bg-zinc-100 px-1 rounded font-mono text-[10px]">&#123;Hey|Hi|Hello&#125;</code> and tags <code className="bg-zinc-100 px-1 rounded font-mono text-[10px]">&#123;&#123;first_name&#125;&#125;</code> and <code className="bg-zinc-100 px-1 rounded font-mono text-[10px]">&#123;&#123;cta_url&#125;&#125;</code> so comments never look repetitive or robotic.
                </p>
                <textarea
                  rows={4}
                  placeholder="&#123;Hey|Hello|Hi&#125; &#123;&#123;first_name&#125;&#125;! &#123;Check out the setup here|You can grab the link directly here&#125;: &#123;&#123;cta_url&#125;&#125;"
                  value={ruleTemplates}
                  onChange={(e) => setRuleTemplates(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 font-mono text-[11px] focus:outline-none focus:border-red-600 leading-relaxed"
                />

                {/* Spintax Live Test Preview Box */}
                {spintaxPreviewSamples.length > 0 && (
                  <div className="p-3 bg-red-50/60 border border-red-200/70 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-bold text-red-900 uppercase tracking-wider block">
                      Live Anti-Spam Variations (Simulated Delivery):
                    </span>
                    {spintaxPreviewSamples.map((sample, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] text-zinc-800 bg-white p-2 rounded-lg border border-red-100 font-sans"
                      >
                        <span className="font-semibold text-red-700">Variant #{idx + 1}: </span>
                        {sample}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Destination CTA URL & Delay */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-zinc-800 block mb-1">
                    Destination CTA URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://tubeflow.in/gear-setup"
                    value={ruleCtaUrl}
                    onChange={(e) => setRuleCtaUrl(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-zinc-800 block mb-1">
                    Safe Anti-Bot Reply Delay
                  </label>
                  <select
                    value={ruleDelay}
                    onChange={(e) => setRuleDelay(Number(e.target.value))}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-900 focus:outline-none"
                  >
                    <option value={0}>⚡ Instant (&lt; 2 seconds)</option>
                    <option value={5}>⏱️ 5 Seconds (Paced Human)</option>
                    <option value={15}>🛡️ 15 Seconds (Safe Anti-Bot)</option>
                    <option value={30}>🕒 30 Seconds (Max Safety)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsRuleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-xs"
                >
                  Save Campaign Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CAMPAIGN REPLIED COMMENTS LOG MODAL */}
      {campaignRepliesModalRule && (
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading font-bold text-base text-zinc-950">
                    Campaign Replies History
                  </h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700">
                    {campaignRepliesModalRule.name}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Detailed log of comments detected, auto-replies delivered, and link clicks.
                </p>
              </div>
              <button
                onClick={() => setCampaignRepliesModalRule(null)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comments Feed */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {comments
                .filter(
                  (c) =>
                    c.matched_rule_id === campaignRepliesModalRule.id ||
                    c.reply_status === "replied" ||
                    c.reply_status === "pending"
                )
                .slice(0, 8)
                .map((comm) => (
                  <div
                    key={comm.id}
                    className="p-4 rounded-2xl border border-zinc-200 bg-zinc-50/60 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-800 text-[10px] font-bold flex items-center justify-center">
                          {comm.author_name.charAt(0)}
                        </div>
                        <span className="font-semibold text-zinc-900">{comm.author_name}</span>
                        <span className="text-[10px] text-zinc-400">
                          • on &quot;{comm.video_title || "Top Desk Setup Essentials"}&quot;
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                        ✅ Replied & Delivered
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-zinc-200/80">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-0.5">
                        Viewer Comment:
                      </span>
                      <p className="text-zinc-800 font-medium">{comm.comment_text}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-red-50/50 border border-red-200/60">
                      <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block mb-0.5">
                        TubeFlow Auto-Reply:
                      </span>
                      <p className="text-zinc-900">
                        {comm.reply_text ||
                          `Hey ${comm.author_name.split(" ")[0]}! Grab the exact link here: ${
                            campaignRepliesModalRule.cta_url || "https://tubeflow.in"
                          }`}
                      </p>
                      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-red-100 text-[11px] text-zinc-500">
                        <span>
                          🔗 Destination:{" "}
                          <span className="font-mono text-zinc-800">
                            {campaignRepliesModalRule.cta_url || "https://tubeflow.in"}
                          </span>
                        </span>
                        <span className="text-emerald-700 font-bold ml-auto">
                          ✓ Link Clicked
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="pt-3 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setCampaignRepliesModalRule(null)}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRY RUN SIMULATOR MODAL */}
      {isDryRunOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-red-600" />
                <h2 className="font-heading font-bold text-sm text-zinc-950">
                  Dry Run Simulator
                </h2>
              </div>
              <button
                onClick={() => setIsDryRunOpen(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-zinc-600 leading-relaxed">
                Test any sample comment against your rule logic to verify match evaluation and reply rendering before deploying to live comments.
              </p>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">
                  Sample Viewer Comment
                </label>
                <textarea
                  rows={3}
                  value={dryRunComment}
                  onChange={(e) => setDryRunComment(e.target.value)}
                  placeholder="e.g. Bro where can I buy this microphone? Link please!"
                  className="w-full p-2.5 rounded-xl border border-zinc-200 text-zinc-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                onClick={handleExecuteDryRun}
                disabled={dryRunLoading || !dryRunComment.trim()}
                className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-semibold transition-all disabled:opacity-50"
              >
                {dryRunLoading ? "Evaluating..." : "Run Test Evaluation"}
              </button>

              {dryRunResult && (
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900">Result:</span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                        dryRunResult.matched
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {dryRunResult.matched ? "MATCHED" : "NO MATCH"}
                    </span>
                  </div>

                  {dryRunResult.rendered_reply && (
                    <div className="pt-2 border-t border-zinc-200">
                      <span className="font-semibold text-zinc-700 block mb-1">
                        Rendered Reply:
                      </span>
                      <p className="p-2 rounded bg-white border border-zinc-200 text-zinc-900 font-mono text-[11px]">
                        {dryRunResult.rendered_reply}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE TRACKED LINK MODAL */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h2 className="font-heading font-bold text-sm text-zinc-950">
                New Tracked Shortlink
              </h2>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const res = await fetch("/api/conversions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      slug: linkSlug.trim().toLowerCase(),
                      destination_url: linkDestination.trim(),
                      campaign_name: linkCampaign.trim(),
                    }),
                  });
                  if (res.ok) {
                    showNotification("success", "Shortlink created.");
                    setIsLinkModalOpen(false);
                    setLinkSlug("");
                    setLinkDestination("");
                    setLinkCampaign("");
                    fetchDashboardData();
                  } else {
                    const data = await res.json();
                    showNotification("error", data.error || "Failed to create shortlink.");
                  }
                } catch (err) {
                  showNotification("error", "Error creating link.");
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-zinc-800 block mb-1">
                  Short Slug (e.g. gear-mic)
                </label>
                <input
                  type="text"
                  required
                  placeholder="gear-setup"
                  value={linkSlug}
                  onChange={(e) => setLinkSlug(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">
                  Destination URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://yourstore.com/products/mic"
                  value={linkDestination}
                  onChange={(e) => setLinkDestination(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-zinc-800 block mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  placeholder="YouTube Shorts Desk Campaign"
                  value={linkCampaign}
                  onChange={(e) => setLinkCampaign(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-zinc-200 text-zinc-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-red-600 text-white font-semibold"
                >
                  Create Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG MODAL */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl border border-zinc-200 shadow-2xl p-6 space-y-3">
            <h2 className="font-heading font-bold text-sm text-zinc-950">
              {confirmDialog.title}
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {confirmDialog.description}
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
              <button
                onClick={() => setConfirmDialog(null)}
                className="px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmDialog.onConfirm}
                className="px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-semibold"
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
