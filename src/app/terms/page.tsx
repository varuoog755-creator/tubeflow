import Link from "next/link";
import { ArrowLeft, ShieldAlert, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Terms of Service",
  description:
    "BigRedHub Terms of Service: terms of use, complete disclaimer of platform liability, acceptable use under YouTube policies, indemnity, and dispute resolution.",
  openGraph: {
    title: "Terms of Service | BigRedHub",
    description:
      "Acceptable use under YouTube policies, plan limits, limitation of liability, and platform disclaimers.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "BigRedHub — YouTube Shorts comments, turned into tracked sales.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | BigRedHub",
    description:
      "Acceptable use under YouTube policies, plan limits, limitation of liability, and platform disclaimers.",
    images: ["/opengraph-image"],
  },
};

const CONTACT_EMAIL = "varuoog755@gmail.com";

function Section({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-3 scroll-mt-8">
      <h2 className="text-base sm:text-lg font-bold text-white border-b border-slate-800 pb-1.5">
        {heading}
      </h2>
      <div className="space-y-2.5 text-slate-300 leading-relaxed text-xs sm:text-sm">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-900 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md p-5 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-red-600/30">
              BR
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              BigRed<span className="text-red-500">Hub</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto p-6 md:p-12 space-y-10 text-xs sm:text-sm leading-relaxed text-slate-300">
        <div className="space-y-3 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legally Binding Agreement</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Terms of Service & Platform Agreement
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Last Updated & Effective Date: October 16, 2026
          </p>
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-100">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>IMPORTANT LEGAL NOTICE & MANDATORY AGREEMENT</span>
            </div>
            <p className="leading-relaxed">
              Please read these Terms of Service carefully before accessing or using BigRedHub.
              By creating an account, selecting the agreement checkbox, connecting a YouTube channel,
              or using any service provided at <strong>bigredhub.info</strong>, you enter into a legally
              binding contract. If you do not agree unconditionally to all terms, do not access or use the Service.
            </p>
          </div>
        </div>

        {/* 1. Acceptance & Electronic Contract */}
        <Section id="acceptance" heading="1. Acceptance of Terms & Affirmative Electronic Consent">
          <p>
            These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally enforceable electronic contract
            between you (individually or the entity you represent, &ldquo;User&rdquo;, &ldquo;Customer&rdquo;, or &ldquo;You&rdquo;)
            and BigRedHub (&ldquo;BigRedHub&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), governed under
            the Information Technology Act, 2000 and applicable international digital contract regulations.
          </p>
          <p>
            By ticking the affirmative consent checkbox during sign-in or channel connection, or by otherwise accessing
            our services, you certify that:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You are at least 18 years of age and legally competent to enter into binding agreements;</li>
            <li>You hold full legal authority and copyright rights to manage all YouTube channels you connect;</li>
            <li>You have read, understood, and accept these Terms and our <Link href="/privacy" className="text-red-400 underline hover:text-red-300">Privacy Policy</Link>;</li>
            <li>You accept sole responsibility for all automated replies, content, links, and YouTube policy compliance.</li>
          </ul>
        </Section>

        {/* 2. Nature of Service */}
        <Section id="service" heading="2. Nature of Service & Independent Status">
          <p>
            BigRedHub is an independent, technical productivity and workflow automation software tool.
            The Service monitors public comments on YouTube channels connected by you, applies automated intent
            and keyword matching criteria configured exclusively by you, and publishes automated comment replies
            through the official YouTube Data API v3 on your behalf. BigRedHub also generates trackable short links
            and attributes engagement analytics.
          </p>
          <p className="font-semibold text-white">
            BigRedHub is strictly an independent software provider. It is NOT affiliated with, authorized by,
            sponsored by, endorsed by, or in any way officially connected with Google LLC, YouTube LLC, or any of
            their subsidiaries or affiliates.
          </p>
        </Section>

        {/* 3. Absolute Platform Risk & YouTube Immunity */}
        <Section id="platform-disclaimer" heading="3. Complete Disclaimer of Platform Liability & Channel Risk">
          <p>
            You expressly acknowledge and agree that automated interaction on YouTube carries inherent platform risks.
            While BigRedHub incorporates protective features such as spintax variations, randomized response delays,
            and daily reply caps, YouTube algorithms and enforcement systems operate autonomously and are subject
            to change without warning.
          </p>
          <p className="font-bold text-red-300 bg-red-950/20 p-3 rounded-lg border border-red-900/40">
            UNDER NO CIRCUMSTANCES SHALL BIGREDHUB, ITS FOUNDERS, OWNERS, OPERATORS, EMPLOYEES, OR AGENTS BE LIABLE
            FOR ANY ACTION TAKEN BY YOUTUBE, GOOGLE LLC, OR ANY THIRD-PARTY PLATFORM AGAINST YOUR YOUTUBE CHANNEL,
            ACCOUNT, OR BUSINESS.
          </p>
          <p>
            This exclusion of liability includes, without limitation:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Community Guidelines strikes, warning notices, or copyright claims;</li>
            <li>Comment section bans, comment filtering, or temporary reply restrictions;</li>
            <li>Demonetization, removal from the YouTube Partner Program, or loss of ad revenue;</li>
            <li>Algorithmic reach suppression, impression drops, or shadowbans;</li>
            <li>API quota exhaustion, Google Cloud project suspensions, or channel terminations.</li>
          </ul>
          <p>
            You use BigRedHub at your sole discretion and risk. You bear 100% legal and operational responsibility
            for all activity conducted on your channel.
          </p>
        </Section>

        {/* 4. User Responsibility for Content & AI */}
        <Section id="user-content" heading="4. User Ownership, Content & AI Reply Responsibility">
          <p>
            You are the sole author, commissioner, and publisher of all content dispatched through your account.
            BigRedHub acts solely as a technical conduit. All comment templates, spintax patterns, destination URLs,
            and AI-assisted prompts are selected, edited, configured, and initiated entirely by you.
          </p>
          <p>
            BigRedHub does not review, pre-screen, verify, or endorse your replies. You represent and warrant that:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your replies do not contain spam, phishing links, malware, or deceptive redirect chains;</li>
            <li>Your replies do not promote illegal goods, counterfeit items, unauthorized financial advice, or prohibited medical claims;</li>
            <li>Your replies do not harass, defame, impersonate, or infringe upon the intellectual property or privacy of any third party;</li>
            <li>All commercial disclosures, affiliate disclosures, and consumer laws applicable in your jurisdiction are adhered to by you.</li>
          </ul>
          <p>
            BigRedHub bears zero liability for defamation, deceptive trade practice claims, intellectual property
            infringement, or regulatory penalties arising from comments or links dispatched from your channel.
          </p>
        </Section>

        {/* 5. Acceptable Use Policy */}
        <Section id="acceptable-use" heading="5. Acceptable Use Policy & Zero Tolerance for Abuse">
          <p>
            To protect our infrastructure and ensure fair service for all users, you agree not to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Deploy automated replies designed to evade spam detection or dump links onto unrelated comments;</li>
            <li>Bypass platform rate limits, exploit vulnerabilities, or reverse-engineer the Service;</li>
            <li>Use the Service for mass political spam, hate speech, violent extremism, or adult content;</li>
            <li>Resell, sublicense, scrape, or extract bulk data from the Service without express written consent;</li>
            <li>Connect channels that you do not own or hold documented written authorization to manage.</li>
          </ul>
          <p>
            Any violation of this Acceptable Use Policy may result in immediate suspension or permanent termination
            of your account without refund and without prior notice.
          </p>
        </Section>

        {/* 6. Platform Policies Compliance */}
        <Section id="platform-compliance" heading="6. Compliance with YouTube & Google API Policies">
          <p>
            Your use of BigRedHub is conditioned upon strict compliance with:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <a href="https://www.youtube.com/static?template=terms" target="_blank" rel="noopener noreferrer" className="text-red-400 underline hover:text-red-300">
                YouTube Terms of Service
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/static?template=community-guidelines" target="_blank" rel="noopener noreferrer" className="text-red-400 underline hover:text-red-300">
                YouTube Community Guidelines
              </a>
            </li>
            <li>
              <a href="https://developers.google.com/terms" target="_blank" rel="noopener noreferrer" className="text-red-400 underline hover:text-red-300">
                Google API Services Terms
              </a>
            </li>
            <li>
              <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-red-400 underline hover:text-red-300">
                Google API Services User Data Policy
              </a>
            </li>
          </ul>
          <p>
            You agree that Google and YouTube may modify API quotas, pricing, or access permissions at any time,
            and BigRedHub is not responsible for interruptions caused by upstream platform modifications.
          </p>
        </Section>

        {/* 7. BYOK (Bring Your Own Key) */}
        <Section id="byok" heading="7. Dedicated Google Cloud Quota (BYOK)">
          <p>
            If you enable the Bring Your Own Key (BYOK) feature to utilize private Google Cloud Platform (GCP)
            credentials, you are solely responsible for:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Creating, maintaining, and securing your Google Cloud project, Client ID, and Client Secret;</li>
            <li>Managing your own Google Cloud billing, quota limits, and API usage charges (if any);</li>
            <li>Ensuring your GCP project complies with Google developer policies and OAuth verification requirements.</li>
          </ul>
          <p>
            BigRedHub does not access your Google Cloud billing and bears no liability for GCP quota exhaustion,
            billing overages, or credential compromises resulting from your handling of API secrets.
          </p>
        </Section>

        {/* 8. Links, Conversions & E-Commerce Disclaimer */}
        <Section id="ecommerce" heading="8. Tracked Links, E-Commerce & Third-Party Conversions">
          <p>
            BigRedHub generates short redirect links and tracks visitor engagement, clicks, and conversion events.
            BigRedHub is solely a technical telemetry provider and is NOT a merchant, broker, escrow agent, payment
            processor, or affiliate network.
          </p>
          <p>
            We take no responsibility for:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>The legality, safety, quality, or delivery of products or services sold through your links;</li>
            <li>Payment disputes, chargebacks, customer refunds, or fulfillment failures;</li>
            <li>Discrepancies in affiliate tracking, commissions, or third-party ad network reporting.</li>
          </ul>
          <p>
            All commercial transactions remain exclusively between you and your customers or affiliate partners.
          </p>
        </Section>

        {/* 9. Plans, Subscriptions & Refunds */}
        <Section id="billing" heading="9. Subscription Plans, Billing & Refunds">
          <p>
            BigRedHub offers tiered subscriptions (Free, Pro, Scale, Agency) as detailed on our pricing schedule.
            Paid subscriptions are billed in advance on a recurring monthly or annual basis.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Cancellation:</strong> You may cancel your subscription at any time via your dashboard or by
              contacting support. Cancellation takes effect at the conclusion of your current paid billing period.
            </li>
            <li>
              <strong>7-Day Renewal Window:</strong> If you are charged for an automatic subscription renewal and
              request cancellation within seven (7) calendar days of the charge date, we will issue a full refund.
            </li>
            <li>
              <strong>Non-Refundable Usage:</strong> Beyond the 7-day renewal window, subscription fees are strictly
              non-refundable, except where mandatory consumer protection statutes prohibit such limitation.
            </li>
          </ul>
        </Section>

        {/* 10. Disclaimer of Warranties */}
        <Section id="warranty" heading="10. Disclaimer of Warranties (&ldquo;AS IS&rdquo;)">
          <p>
            THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS, WITHOUT WARRANTIES
            OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. BIGREDHUB EXPRESSLY DISCLAIMS ALL
            IMPLIED WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, QUIET ENJOYMENT,
            AND NON-INFRINGEMENT.
          </p>
          <p>
            WE DO NOT WARRANT THAT:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>THE SERVICE WILL MEET YOUR BUSINESS REQUIREMENTS OR GENERATE ANY SALES OR REVENUE;</li>
            <li>OPERATION WILL BE UNINTERRUPTED, BUG-FREE, OR ERROR-FREE;</li>
            <li>AUTOMATED REPLIES WILL BE DELIVERED INSTANTANEOUSLY OR WITHOUT QUEUE DELAYS;</li>
            <li>YOUTUBE WILL NOT ALTER ITS API, CLASSIFY COMMENTS AS SPAM, OR TAKE REGULATORY ACTIONS.</li>
          </ul>
        </Section>

        {/* 11. Strict Limitation of Liability */}
        <Section id="liability" heading="11. Strict Limitation of Liability & Maximum Damage Cap">
          <p>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL BIGREDHUB, ITS FOUNDERS,
            DIRECTORS, OPERATORS, AFFILIATES, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL,
            SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES WHATSOEVER, INCLUDING LOSS OF PROFITS, REVENUE, DATA,
            SUBSCRIBERS, MONETIZATION, GOODWILL, BUSINESS INTERRUPTION, OR REPUTATIONAL DAMAGE.
          </p>
          <p className="font-bold text-white bg-slate-900 p-3 rounded-lg border border-slate-800">
            IN ALL CIRCUMSTANCES, OUR TOTAL AGGREGATE LIABILITY ARISING OUT OF OR IN CONNECTION WITH THESE TERMS
            OR YOUR USE OF THE SERVICE, UNDER ANY CAUSE OF ACTION (WHETHER IN CONTRACT, TORT, STRICT LIABILITY, OR
            NEGLIGENCE), SHALL NOT EXCEED THE TOTAL AMOUNT ACTUALLY PAID BY YOU TO BIGREDHUB IN THE THIRTY (30)
            DAYS IMMEDIATELY PRECEDING THE CLAIM, OR ₹1,000 (ONE THOUSAND INDIAN RUPEES), WHICHEVER IS LESS.
          </p>
        </Section>

        {/* 12. Full Indemnification (Hold Harmless) */}
        <Section id="indemnity" heading="12. Comprehensive Indemnification (&ldquo;Hold Harmless&rdquo;)">
          <p>
            You agree to defend, indemnify, and hold harmless BigRedHub, its owners, operators, developers,
            agents, and service providers from and against any and all claims, demands, liabilities, damages,
            losses, judgments, fines, penalties, settlements, and costs (including reasonable legal fees and
            litigation expenses) arising out of or resulting from:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Your access to or use of the Service;</li>
            <li>Any comment, reply, template, message, or link posted from your connected YouTube channels;</li>
            <li>Your breach of these Terms, the Privacy Policy, or YouTube/Google platform rules;</li>
            <li>Any infringement by your content of third-party intellectual property, privacy, or proprietary rights;</li>
            <li>Any commercial transactions, product defect disputes, or consumer complaints relating to your business.</li>
          </ul>
        </Section>

        {/* 13. Dispute Resolution & Mandatory Arbitration */}
        <Section id="dispute-resolution" heading="13. Governing Law, Binding Arbitration & Class Action Waiver">
          <p>
            These Terms and any dispute or controversy arising out of or relating to BigRedHub shall be governed
            by and construed in accordance with the substantive laws of India, without regard to conflict of law principles.
          </p>
          <p>
            <strong>Mandatory Individual Arbitration:</strong> Any dispute, controversy, or claim arising out of or
            relating to these Terms shall be settled by binding arbitration conducted under the Arbitration and Conciliation
            Act, 1996 by a sole arbitrator appointed mutually or in accordance with Indian arbitral rules.
            The arbitration seat and venue shall be in India, and the proceedings shall be conducted in English.
          </p>
          <p className="font-bold text-white">
            CLASS ACTION WAIVER: YOU EXPRESSLY AGREE THAT ALL DISPUTES MUST BE RESOLVED ON AN INDIVIDUAL BASIS.
            YOU WAIVE ANY RIGHT TO COMMENCE, JOIN, OR PARTICIPATE IN ANY CLASS ACTION, COLLECTIVE ARBITRATION,
            OR REPRESENTATIVE LITIGATION AGAINST BIGREDHUB OR ITS OPERATORS.
          </p>
        </Section>

        {/* 14. Account Deletion & Termination */}
        <Section id="termination" heading="14. Account Termination & Data Purge">
          <p>
            You may terminate your account at any time by written request to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-red-400 underline font-mono hover:text-red-300">
              {CONTACT_EMAIL}
            </a>
            . Upon termination, all stored OAuth tokens, channel connections, campaign configurations, and comment
            records are purged in compliance with our Privacy Policy.
          </p>
          <p>
            BigRedHub reserves the right to suspend or terminate any account immediately, without liability, if we
            determine in our sole discretion that your account violates platform guidelines, exhibits fraudulent behavior,
            or poses legal risk.
          </p>
        </Section>

        {/* 15. Severability & Entire Agreement */}
        <Section id="general" heading="15. Severability & Entire Agreement">
          <p>
            If any provision of these Terms is deemed unlawful, void, or unenforceable by an arbitrator or court of
            competent jurisdiction, that provision shall be severed without affecting the validity and enforceability
            of the remaining provisions.
          </p>
          <p>
            These Terms, together with our Privacy Policy, constitute the complete and exclusive agreement between you
            and BigRedHub regarding the Service, superseding all prior proposals, discussions, or understandings.
          </p>
        </Section>

        {/* 16. Contact */}
        <Section id="contact" heading="16. Legal Inquiries & Official Notices">
          <p>
            For legal notices, policy inquiries, or support requests regarding these Terms, contact our legal desk at:
          </p>
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <p className="font-semibold text-white">BigRedHub Legal & Operations Desk</p>
            <p className="text-slate-400">
              Email:{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-red-400 underline hover:text-red-300 font-mono"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
            <p className="text-slate-500 text-xs mt-1">
              Portal: <a href="https://bigredhub.info" className="underline hover:text-slate-300">https://bigredhub.info</a>
            </p>
          </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 space-y-2">
          <p>© {new Date().getFullYear()} BigRedHub. All rights reserved.</p>
          <p className="text-[11px] text-slate-600">
            YouTube and Google are trademarks of Google LLC. BigRedHub operates as an independent software utility.
          </p>
        </div>
      </footer>
    </div>
  );
}