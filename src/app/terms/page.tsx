import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  // See the note in src/app/privacy/page.tsx: the root layout supplies the
  // " | BigRedHub" suffix, so repeating the brand here doubled it.
  title: "Terms of Service",
  description:
    "BigRedHub terms of service: acceptable use under YouTube and Google policies, plans and limits, tracked link attribution, termination, and limitation of liability.",
  // See the note in src/app/privacy/page.tsx: this override replaces the
  // inherited openGraph object, so the og:image has to be named again here.
  openGraph: {
    title: "Terms of Service | BigRedHub",
    description:
      "Acceptable use under YouTube and Google policies, plan limits, tracked link attribution, termination, and limitation of liability.",
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
      "Acceptable use under YouTube and Google policies, plan limits, tracked link attribution, termination, and limitation of liability.",
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
      <h2 className="text-lg font-bold text-white">{heading}</h2>
      {children}
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <header className="border-b border-slate-800 bg-slate-900/60 p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black">
              BR
            </div>
            <span className="font-extrabold text-lg text-white">BigRedHub</span>
          </Link>
          <Link href="/" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto p-6 md:p-12 space-y-8 text-xs sm:text-sm leading-relaxed text-slate-300">
        <div className="space-y-2 border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-black text-white">Terms of Service</h1>
          <p className="text-slate-500">Effective Date: October 13, 2026</p>
        </div>

        <Section id="acceptance" heading="1. Acceptance of Terms">
          <p>
            By creating an account or using bigredhub.info (the &ldquo;Service&rdquo;),
            you agree to these Terms of Service and to our{" "}
            <Link href="/privacy" className="text-red-400 underline hover:text-red-300">
              Privacy Policy
            </Link>
            . If you do not agree, do not use the Service. You confirm you are at
            least 18 years old and that the YouTube channels you connect are yours to
            authorise actions on.
          </p>
        </Section>

        <Section id="service" heading="2. What BigRedHub Does">
          <p>
            BigRedHub polls comments on YouTube channels you connect, applies the
            trigger rules you configure, and posts automated replies on your behalf
            using the YouTube Data API v3. It also issues short links, records clicks
            and lets you attach conversions and order values to those links.
          </p>
          <p>
            BigRedHub is an independent productivity software product. It is not
            affiliated with, endorsed by, or sponsored by YouTube, Google LLC, or any
            channel owner whose comments pass through it.
          </p>
        </Section>

        <Section id="account" heading="3. Your Account">
          <p>
            You sign in with a Google account. You are responsible for activity
            performed through your account, for keeping your Google credentials
            secure, and for all replies posted to your channels. One person or
            organisation may hold one account; create a separate account rather than
            sharing credentials.
          </p>
          <p>
            You may close your account at any time by emailing{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-red-400 underline hover:text-red-300 font-mono"
            >
              {CONTACT_EMAIL}
            </a>
            . Closing an account removes its channels, comment history, campaigns and
            conversion records.
          </p>
        </Section>

        <Section id="acceptable-use" heading="4. Acceptable Use">
          <p>
            Automated replies are published under your name on your channel. You are
            solely responsible for that content and for how your rules behave.
            You must not use BigRedHub to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              configure repetitive or keyword-stuffed triggers whose only purpose is
              to dump a link on every comment;
            </li>
            <li>post deceptive, misleading, or otherwise spam content;</li>
            <li>
              construct or participate in redirect loops, or use shortened or
              disguised links to evade moderation;
            </li>
            <li>
              harass, threaten, target, or impersonate individuals, or reply to
              anyone on the basis of a protected characteristic;
            </li>
            <li>direct comments to illegal goods or services;</li>
            <li>
              attempt to post on a channel you are not authorised to manage, or to
              access another workspace&rsquo;s data;
            </li>
            <li>
              scrape, resell, or attempt to extract bulk comment data from the
              Service.
            </li>
          </ul>
          <p>
            Spintax variation, reply delays, cooldowns and daily caps exist to keep
            replies readable and reduce spam signals. Setting them to defeat platform
            spam detection is a breach of this section, even though the feature is
            available.
          </p>
        </Section>

        <Section id="platform-compliance" heading="5. Platform Policies">
          <p>
            Your use of the Service must comply with the{" "}
            <a
              href="https://www.youtube.com/static?template=terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 underline hover:text-red-300"
            >
              YouTube Terms of Service
            </a>
            , the{" "}
            <a
              href="https://www.youtube.com/static?template=community-guidelines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 underline hover:text-red-300"
            >
              YouTube Community Guidelines
            </a>
            , and the{" "}
            <a
              href="https://developers.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 underline hover:text-red-300"
            >
              Google API Services Terms
            </a>
            . Using BigRedHub does not transfer any of those responsibilities to us.
          </p>
          <p>
            YouTube may change its API, restrict a channel&rsquo;s quota, or remove
            the ability to post through the API. BigRedHub depends on that access to
            function. We are not liable for replies that fail to post because of a
            platform-side change, quota exhaustion, or action taken against your
            channel.
          </p>
        </Section>

        <Section id="content" heading="6. Your Content and Ownership">
          <p>
            You keep ownership of your channels, your campaign configuration, and any
            reply templates you write. We claim no ownership over them and grant you a
            licence to use them only to operate the Service for you.
          </p>
          <p>
            You confirm that you have the right to reply to the comments you are
            automating replies to, and that your reply templates do not infringe
            anyone&rsquo;s copyright, trademark or other rights. Comments themselves
            remain the property of the people who wrote them; we process them only as
            described in the Privacy Policy.
          </p>
          <p>
            You give us permission to store your content for as long as your account
            is active, and to display excerpts of it back to you in the dashboard.
          </p>
        </Section>

        <Section id="links" heading="7. Tracked Links, Attribution and Revenue">
          <p>
            Short links issued by BigRedHub resolve to a destination you supply. We
            record clicks and any conversions and order values you report, and show
            them back to you. Reported revenue is shown as you supplied it; we do not
            audit or verify it.
          </p>
          <p>
            We are not a party to any transaction that happens after a click, have no
            relationship with the merchant or buyer, and take no responsibility for
            what is sold, how refunds are handled, or whether you are paid. Keep your
            destination URLs lawful and your own responsibility.
          </p>
        </Section>

        <Section id="plans" heading="8. Plans, Limits and Billing">
          <p>
            The Service is offered in three plans &mdash; Free, Pro and Business
            &mdash; described on our pricing page. A plan sets a limit on the
            number of YouTube channels you may connect and on the number of
            automated replies BigRedHub may post for your account in a billing
            period. Those limits are on the pricing page, and they count replies
            BigRedHub posts, not comments it merely sees.
          </p>
          <p>
            We may change plan limits and pricing by updating the pricing page. If
            a change reduces a limit you are already using, we will give you
            reasonable notice before it takes effect and will not apply it
            mid-cycle.
          </p>
          <p>
            Where a plan is paid, fees are billed in advance each cycle. You can
            cancel at any time; cancellation takes effect at the end of the current
            cycle and you keep access until then. If you cancel within 7 days of a
            renewal you are charged, we refund that renewal in full. Beyond that
            window, prepaid fees for the remainder of the cycle are not refundable
            except where the law requires otherwise.
          </p>
          <p>
            If you exceed a plan limit we will tell you and give you a chance to
            upgrade or reduce usage before anything is suspended.
          </p>
        </Section>

        <Section id="availability" heading="9. Availability and Changes">
          <p>
            We aim to keep the Service available but do not guarantee uninterrupted
            operation. Comment polling runs on a scheduled cycle, so the exact time a
            comment is seen, and therefore the time a reply is posted, depends on that
            cycle and on YouTube&rsquo;s API. We may modify or discontinue features,
            and will give notice before a change that materially reduces core
            functionality on a paid plan.
          </p>
        </Section>

        <Section id="termination" heading="10. Suspension and Termination">
          <p>
            You may stop using the Service and delete your account at any time. We
            may suspend or terminate an account that breaches section 4, breaches
            the Terms or Privacy Policy, infringes someone&rsquo;s rights, or is used
            to post unlawful content. Where practical we will tell you why and give
            you a chance to fix the problem first.
          </p>
          <p>
            On termination your channels, comments, campaigns, links and conversion
            data are deleted in line with section 6 of the Privacy Policy. You may
            export your own campaign configuration before closing the account.
          </p>
        </Section>

        <Section id="warranty" heading="11. Disclaimer of Warranties">
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;,
            without warranties of any kind, express or implied, including fitness for
            a particular purpose, merchantability, non-infringement, and any implied
            warranty that the Service will be uninterrupted or error-free.
          </p>
          <p>
            We do not warrant that automated replies will be delivered, that comment
            classification will be accurate, or that using the Service will avoid a
            spam classification, a platform penalty, or a channel strike. You decide
            what is posted to your channel; that decision is yours.
          </p>
        </Section>

        <Section id="liability" heading="12. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, BigRedHub and its operators are
            not liable for indirect, incidental, special, consequential or punitive
            damages, or for loss of profits, revenue, data, subscribers, goodwill or
            channel standing, arising out of your use of the Service — including any
            channel strike, quota suspension, loss of monetisation, or wrongful
            removal of content.
          </p>
          <p>
            Where liability cannot be excluded, our total aggregate liability to you
            for all claims arising in any twelve-month period is limited to the
            amount you paid us for the Service in that period, or ₹1,000 if you paid
            nothing.
          </p>
          <p>
            Nothing here excludes liability that cannot lawfully be excluded, including
            for death or personal injury caused by negligence, or for fraud.
          </p>
        </Section>

        <Section id="indemnity" heading="13. Indemnity">
          <p>
            You agree to indemnify and hold harmless BigRedHub and its operators
            against claims, losses and reasonable costs arising from your content, the
            destination URLs you send traffic to, your breach of these Terms, or your
            breach of YouTube&rsquo;s or Google&rsquo;s policies.
          </p>
        </Section>

        <Section id="third-parties" heading="14. Third-Party Services">
          <p>
            The Service depends on Google, Supabase, Vercel and Cloudflare. Their
            outages or policy changes can affect the Service, and we do not control
            them. Links to third-party sites are provided for convenience; we are not
            responsible for third-party content or privacy practices.
          </p>
        </Section>

        <Section id="changes" heading="15. Changes to These Terms">
          <p>
            We may update these Terms. The effective date at the top reflects the
            current version. Material changes will be announced by email to account
            holders before they take effect. Continuing to use the Service after a
            change takes effect means you accept the updated Terms.
          </p>
        </Section>

        <Section id="law" heading="16. Governing Law and Disputes">
          <p>
            These Terms are governed by the laws of India, and the courts of India
            have exclusive jurisdiction over any dispute arising from them, without
            affecting any mandatory consumer protection rights available to you where
            you live. We will try to resolve a dispute informally by email first.
          </p>
        </Section>

        <Section id="contact" heading="17. Contact">
          <p>
            Questions about these Terms can be sent to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-red-400 underline hover:text-red-300 font-mono"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </Section>
      </main>

      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        © 2026 BigRedHub. All rights reserved.
      </footer>
    </div>
  );
}