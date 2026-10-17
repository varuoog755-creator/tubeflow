import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Copy,
  ExternalLink,
  LayoutDashboard,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";
import { PLAN_CONFIGS } from "@/lib/plan-limits";

/**
 * The shared guide body - rendered on the public /guide page and inside the
 * customer dashboard ("Guide & Help" tab), so there is exactly one copy of
 * the instructions and the two surfaces can never drift apart.
 *
 * Deliberately a server-safe component: no hooks, no browser APIs, and the
 * only interactive affordance is the native <details> element, so it renders
 * identically in a server component and inside the dashboard's client tree.
 */

const APP_ORIGIN = "https://bigredhub.info";
const REDIRECT_URI = `${APP_ORIGIN}/api/auth/callback/google`;

// Deterministic formatting: the same string must render on the server (guide
// page) and in the browser (dashboard), otherwise hydration warns and the
// number can flicker between "100,000" and "1,00,000".
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function Section({
  id,
  icon,
  title,
  subtitle,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <details
      id={id}
      className="group scroll-mt-24 rounded-2xl border border-zinc-200/80 bg-white shadow-2xs open:shadow-sm open:border-zinc-300 transition-shadow"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
        <span className="flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700 shrink-0">
            {icon}
          </span>
          <span className="min-w-0">
            <span className="block font-heading font-bold text-sm sm:text-base text-zinc-950">
              {title}
            </span>
            <span className="block text-xs text-zinc-500 truncate">{subtitle}</span>
          </span>
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="border-t border-zinc-100 p-4 sm:p-5 space-y-3 text-sm text-zinc-600 leading-relaxed">
        {children}
      </div>
    </details>
  );
}

function StepRow({
  n,
  title,
  children,
  color = "bg-red-600",
}: {
  n: number;
  title: string;
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`w-6 h-6 rounded-full ${color} text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5`}
      >
        {n}
      </span>
      <div className="min-w-0">
        <p className="font-bold text-zinc-900 text-xs sm:text-sm">{title}</p>
        <div className="text-xs sm:text-sm text-zinc-600 mt-0.5">{children}</div>
      </div>
    </div>
  );
}

function CopyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 p-3 space-y-1">
      <p className="text-[11px] text-indigo-900 font-semibold flex items-center gap-1.5">
        <Copy className="w-3 h-3" />
        {label}
      </p>
      <p className="font-mono text-[11px] sm:text-xs text-indigo-950 break-all">{value}</p>
    </div>
  );
}

export default function GuideContent() {
  const planOrder = ["free", "growth", "scale", "agency"] as const;

  return (
    <div className="space-y-3">
      <p className="text-xs text-zinc-500 flex items-center gap-2 pb-1">
        <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
        Tap any topic to expand it. Everything here matches what the dashboard actually does.
      </p>

      {/* 1. QUICK START */}
      <Section
        id="quick-start"
        icon={<Sparkles className="w-4 h-4" />}
        title="Quick start — live in 3 steps"
        subtitle="From zero to your first automated reply"
      >
        <StepRow n={1} title="Sign in with Google">
          Go to{" "}
          <a href="/login" className="text-red-600 font-semibold hover:underline">
            the login page
          </a>{" "}
          and continue with Google. We only read your basic profile — no password is ever
          stored, and no YouTube permission is requested at this step.
        </StepRow>
        <StepRow n={2} title="Connect your YouTube channel">
          In the dashboard, open <strong>Channels &amp; Setup</strong> (or the Quick Setup
          popup on day one) and click <strong>Connect YouTube Channel</strong>. Google asks
          for comment-management permission on your channel — approve it once.
        </StepRow>
        <StepRow n={3} title="Create your first rule">
          Open <strong>Campaigns &amp; Rules</strong> and create a rule: pick the trigger
          keywords (for example <em>price, kitna, link</em>), write the reply, attach a
          tracked link if you sell something, and save. The polling engine now picks up
          matching comments and posts replies for you.
        </StepRow>
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
          <span>
            The <strong>free trial needs zero setup</strong> — it runs on BigRedHub&apos;s
            shared Google Cloud quota. Nothing to configure in Google Cloud until you move
            to a paid plan (that part is explained in{" "}
            <a href="#your-own-quota" className="font-semibold underline">
              &ldquo;Your own Google quota&rdquo;
            </a>
            ).
          </span>
        </div>
      </Section>

      {/* 2. HOW IT WORKS */}
      <Section
        id="how-it-works-guide"
        icon={<Zap className="w-4 h-4" />}
        title="How the automation works"
        subtitle="What happens between a comment and a reply"
      >
        <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm">
          <li>
            <strong>Scan</strong> — the polling engine reads the latest comment threads on
            your connected channel through the official YouTube Data API.
          </li>
          <li>
            <strong>Understand</strong> — each comment is classified by intent (price
            question, buying signal, question, spam …). Spam never gets a reply.
          </li>
          <li>
            <strong>Match</strong> — your rules decide: keywords, negative keywords,
            target videos or Shorts, intent category, and your safety caps (max replies
            per day, cooldown between replies).
          </li>
          <li>
            <strong>Reply</strong> — a reply template is rendered with the viewer&apos;s
            name, your link, and anti-spam variations, then posted as a real reply under
            your channel.
          </li>
          <li>
            <strong>Track</strong> — every reply and click is recorded, so the Overview &amp;
            ROI tab shows replies sent and conversions your tracked links brought in.
          </li>
        </ol>
        <p className="text-xs text-zinc-500">
          Replies are posted by the background engine, not instantly the second a comment
          appears — your dashboard log shows exactly what was sent and when.
        </p>
      </Section>

      {/* 3. DASHBOARD TOUR */}
      <Section
        id="dashboard-tour"
        icon={<LayoutDashboard className="w-4 h-4" />}
        title="Dashboard tour — every tab explained"
        subtitle="Know where everything lives"
      >
        <ul className="space-y-2 text-xs sm:text-sm">
          {[
            ["Comment Inbox", "Every scanned comment, with its detected intent and reply status. Needs Review shows what the engine held back for you."],
            ["Overview & ROI", "Replies sent, videos synced, clicks and attributed orders — plus your daily automation capacity."],
            ["Channel & Videos", "Your connected channel(s) and the latest synced videos. Switch or reconnect a channel from here."],
            ["Campaigns & Rules", "Create and edit automation rules: keywords, intents, reply templates, target videos, daily caps and cooldowns."],
            ["Tracked Links", "Short links you can paste into replies. Clicks and conversions are attributed back to your videos."],
            ["Channels & Setup", "OAuth channel management, connection health, and the BYOK section (own Google Cloud credentials on paid plans)."],
            ["Pricing & Plans", "Your current plan, usage this month, the full plan comparison, and the WhatsApp button for plan changes."],
            ["Guide & Help", "This guide, plus the Help Desk where you can raise a support ticket."],
          ].map(([name, desc]) => (
            <li key={name} className="flex gap-2">
              <span className="font-bold text-zinc-900 shrink-0">{name}:</span>
              <span className="text-zinc-600">{desc}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* 4. PLANS & BILLING */}
      <Section
        id="plans-billing"
        icon={<Wallet className="w-4 h-4" />}
        title="Plans, limits & billing"
        subtitle="What each plan includes and how upgrades work"
      >
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs sm:text-sm border-collapse min-w-[420px]">
            <thead>
              <tr className="text-left text-zinc-500 border-b border-zinc-200">
                <th className="py-2 pr-3 font-semibold">Plan</th>
                <th className="py-2 pr-3 font-semibold">Replies / month</th>
                <th className="py-2 pr-3 font-semibold">Channels</th>
                <th className="py-2 font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {planOrder.map((id) => {
                const p = PLAN_CONFIGS[id];
                return (
                  <tr key={id} className="border-b border-zinc-100 last:border-0">
                    <td className="py-2 pr-3 font-bold text-zinc-900">{p.name}</td>
                    <td className="py-2 pr-3">{formatNumber(p.monthlyRepliesLimit)}</td>
                    <td className="py-2 pr-3">{p.channelLimit}</td>
                    <td className="py-2">
                      {p.priceMonthlyInr === 0 ? (
                        <span className="text-emerald-700 font-semibold">Free</span>
                      ) : (
                        <>
                          ₹{p.priceMonthlyInr}/mo{" "}
                          <span className="text-zinc-400">
                            (₹{p.priceMonthlyInrYearly}/mo yearly)
                          </span>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-zinc-500">
          Numbers above come straight from the same plan configuration the engine enforces,
          so they can never disagree with your dashboard.
        </p>
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong>How to change your plan:</strong> open <strong>Pricing &amp; Plans</strong>{" "}
            in the dashboard and tap the WhatsApp button — plan changes go through support.
            There is no automatic card charge; nothing is billed until you and support agree
            on the switch.
          </span>
        </div>
      </Section>

      {/* 5. YOUR OWN QUOTA (BYOK) */}
      <Section
        id="your-own-quota"
        icon={<ShieldCheck className="w-4 h-4" />}
        title="Your own Google quota — how trial vs paid works"
        subtitle="Free trial = shared quota · Paid plans = your own client ID & key"
      >
        <p className="text-xs sm:text-sm">
          Google gives every Cloud project a free allowance of{" "}
          <strong>10,000 YouTube API units per day</strong>. That is the quota every scan
          and reply runs on:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <p className="font-bold text-zinc-900 text-xs mb-1">Free trial</p>
            <p className="text-xs text-zinc-600">
              Runs on <strong>BigRedHub&apos;s shared Google Cloud project</strong>. Zero
              setup — you connect your channel and the engine starts working immediately.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
            <p className="font-bold text-purple-900 text-xs mb-1">Paid plans (Pro &amp; above)</p>
            <p className="text-xs text-purple-900/80">
              You can connect <strong>your own Google Cloud client ID &amp; key</strong>.
              Scanning and replies then run on <strong>your private quota</strong> — your
              own limits, no shared pool.
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-zinc-900 pt-1">
          Setting up your own credentials (3–5 minutes, no coding):
        </p>
        <StepRow n={1} title="Create a Google Cloud project" color="bg-purple-600">
          Open{" "}
          <a
            href="https://console.cloud.google.com/projectcreate"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            Google Cloud project creator <ExternalLink className="w-3 h-3" />
          </a>
          , type any name (for example <em>YouTube Automation</em>) and click Create.
        </StepRow>
        <StepRow n={2} title="Enable the YouTube Data API v3" color="bg-purple-600">
          Open the{" "}
          <a
            href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            API page <ExternalLink className="w-3 h-3" />
          </a>{" "}
          and press the blue <strong>Enable</strong> button.
        </StepRow>
        <StepRow n={3} title="Create an OAuth client (Web application)" color="bg-purple-600">
          In{" "}
          <a
            href="https://console.cloud.google.com/apis/credentials/oauthclient"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            Credentials → Create OAuth client <ExternalLink className="w-3 h-3" />
          </a>
          , choose <strong>Web application</strong>, and paste these values exactly:
          <div className="space-y-2 mt-2">
            <CopyValue label="Authorized JavaScript origin" value={APP_ORIGIN} />
            <CopyValue label="Authorized redirect URI" value={REDIRECT_URI} />
          </div>
        </StepRow>
        <StepRow n={4} title="Paste the client ID & key into BigRedHub" color="bg-purple-600">
          Copy <strong>Your Client ID</strong> and <strong>Your Client Secret</strong> from
          Google, then open <strong>Channels &amp; Setup → Your Own Google Cloud Quota</strong>{" "}
          in the dashboard, paste both, and save. (The dashboard has a built-in Beginner
          Setup Guide with the same values if you want it side by side.)
        </StepRow>
        <StepRow n={5} title="Reconnect your YouTube channel — important" color="bg-purple-600">
          Google ties a channel&apos;s authorization to the client that issued it. After
          switching to your own credentials, go to <strong>Channels &amp; Setup →
          Authorized YouTube Channels</strong> and click <strong>Connect / Reconnect</strong>{" "}
          once. From then on, everything runs on your project.
        </StepRow>
        <div className="p-3 rounded-xl bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 space-y-1">
          <p className="font-bold text-zinc-900">Common questions:</p>
          <p>• Does this cost money? No — the 10,000 units/day YouTube Data API allowance is free from Google.</p>
          <p>• Must the Google Cloud account match my YouTube channel? No, any Google account works.</p>
          <p>• What if I skip this? Your paid plan still works on the shared quota; your own credentials just give you a private, dedicated one.</p>
        </div>
      </Section>

      {/* 6. SAFETY */}
      <Section
        id="safety"
        icon={<ShieldCheck className="w-4 h-4" />}
        title="Safety & YouTube compliance"
        subtitle="Why this is safe for your channel"
      >
        <ul className="space-y-1.5 text-xs sm:text-sm">
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Official Google OAuth2 — you never share your password, and you can revoke access anytime from your Google account.</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Replies go out through the official YouTube Data API — no scrapers, no bots that violate YouTube policy.</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>The engine only acts on comments on <strong>your own videos</strong>, never on other channels.</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>Anti-spam variations and your own safety caps (daily limit + cooldown per rule) keep replies human-paced.</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>You stay in control: pause any rule, review held replies in the inbox, or disconnect the channel in one click.</span>
          </li>
        </ul>
      </Section>

      {/* 7. FAQ */}
      <Section
        id="faq"
        icon={<MessageSquare className="w-4 h-4" />}
        title="FAQ & support"
        subtitle="Quick answers to the usual questions"
      >
        <ul className="space-y-2.5 text-xs sm:text-sm">
          <li>
            <strong className="text-zinc-900">How fast are replies posted?</strong>{" "}
            The background polling engine posts them; timing depends on the current polling
            schedule, and every reply appears in your dashboard log the moment it goes out.
          </li>
          <li>
            <strong className="text-zinc-900">What happens when the daily quota runs out?</strong>{" "}
            Replies pause and the dashboard shows a quota notice; they resume automatically
            after the reset — or never hit the shared limit at all once you connect your own
            Google Cloud quota (paid plans).
          </li>
          <li>
            <strong className="text-zinc-900">Will it reply to spam or trolls?</strong>{" "}
            No. Spam is detected and skipped, and replies only come from rules you wrote.
          </li>
          <li>
            <strong className="text-zinc-900">How do I upgrade or cancel?</strong>{" "}
            Open <strong>Pricing &amp; Plans</strong> and use the WhatsApp button, or raise a
            ticket from the Help Desk — support handles plan changes personally.
          </li>
          <li>
            <strong className="text-zinc-900">I&apos;m stuck. Where is help?</strong>{" "}
            The dashboard has a <strong>Help Desk</strong> (bottom of the sidebar) where you
            can open a ticket, and the support team is on WhatsApp and email — see the
            footer for both.
          </li>
        </ul>
      </Section>

      {/* CTA */}
      <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <p className="font-heading font-bold text-white text-sm sm:text-base">
              Ready? Open your dashboard
            </p>
            <p className="text-xs text-zinc-400">
              Sign in with Google — the free trial starts with zero setup.
            </p>
          </div>
        </div>
        <a
          href="/login"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-500 shadow-md shadow-red-600/30 transition-all shrink-0"
        >
          <span>Start free</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
