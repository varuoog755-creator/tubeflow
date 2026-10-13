import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  // No brand suffix here: the root layout applies a "%s | BigRedHub" template,
  // so spelling the brand out again produced "Privacy Policy — BigRedHub |
  // BigRedHub" in the tab title and in every share preview.
  title: "Privacy Policy",
  description:
    "How BigRedHub collects, uses, stores and deletes data, including YouTube API data and comment content processed under Google's Limited Use requirements.",
  // The root layout pins a site-wide og:title tuned for the landing page, and
  // every child route inherits it. Without this override, sharing a link to the
  // privacy policy advertised it as the homepage sales pitch.
  //
  // Declaring `openGraph` here also drops the og:image the root
  // `opengraph-image.tsx` file convention injects, so the card has to name the
  // image explicitly. metadataBase in the root layout resolves the relative
  // path to https://bigredhub.info/opengraph-image.
  openGraph: {
    title: "Privacy Policy | BigRedHub",
    description:
      "What BigRedHub collects, how YouTube API data is handled under Google's Limited Use requirements, and how to request deletion.",
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
    title: "Privacy Policy | BigRedHub",
    description:
      "What BigRedHub collects, how YouTube API data is handled under Google's Limited Use requirements, and how to request deletion.",
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

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
          <p className="text-slate-500">Effective Date: October 13, 2026</p>
        </div>

        <p className="text-slate-400">
          This policy describes what BigRedHub (&ldquo;we&rdquo;, &ldquo;us&rdquo;) actually
          collects and stores when you use bigredhub.info (the &ldquo;Service&rdquo;). It
          is written against the running system rather than a generic template: if a
          table or field is not named here, we do not store it.
        </p>

        <Section id="collect" heading="1. Information We Collect">
          <p>
            <strong className="text-white">Account data.</strong> When you sign in
            with Google we store your email address, your Google display name and
            your Google profile picture URL, together with your BigRedHub workspace
            name and plan.
          </p>
          <p>
            <strong className="text-white">YouTube channel data.</strong> When you
            connect a channel we store its channel ID, title, custom URL, thumbnail,
            subscriber count, video count and view count, plus the OAuth access and
            refresh tokens needed to act on your behalf.
          </p>
          <p>
            <strong className="text-white">Comment data — including data about other
            people.</strong> This is the most sensitive category and we want it to be
            explicit. To decide whether to reply, and to prove whether a reply was
            delivered, we store for each comment on your videos:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>the comment text, in full;</li>
            <li>the commenter&rsquo;s display name and YouTube channel ID;</li>
            <li>the video ID and video title it was posted on;</li>
            <li>the buyer-intent category and confidence score we assigned;</li>
            <li>the reply text we posted and YouTube&rsquo;s ID for that reply;</li>
            <li>the delivery status and, if a reply failed, the error message.</li>
          </ul>
          <p>
            These are comments left by members of the public, not by you. We process
            them solely to deliver the automation you configured on your own channel.
            We do not use them to build any profile of those commenters, and we do
            not share them with anyone except as described in section 4.
          </p>
          <p>
            <strong className="text-white">Your campaign configuration.</strong> The
            keywords, negative keywords, reply templates, CTA URLs, spintax settings,
            reply delays, daily caps, cooldowns and targeting rules you create.
          </p>
          <p>
            <strong className="text-white">Tracked links and conversions.</strong> The
            short link slug, its destination URL, campaign name, click count, lead
            and conversion counts, and attributed revenue. When you report a
            conversion, you may supply a customer identifier and an order value; we
            store those on your workspace so the attribution can be shown back to
            you.
          </p>
          <p>
            <strong className="text-white">Visitor telemetry on your tracked
            links.</strong> Device type, country, HTTP referrer, a salted hash of the
            visitor&rsquo;s IP address, and browser user-agent string. The IP hash is
            one-way and is not reversible back into an address.
          </p>
          <p>
            <strong className="text-white">Usage data.</strong> Number of channels
            connected, replies sent, tracked clicks and API calls attributable to
            your workspace in the current billing period.
          </p>
          <p>
            <strong className="text-white">Competitor information.</strong> If you
            use the competitor tracking feature we store the public channel ID,
            title, thumbnail and public statistics of the channels you add.
          </p>
        </Section>

        <Section id="use" heading="2. How We Use It">
          <p>
            We use this data to operate the Service: authenticating you, polling
            comments on the channels you connected, classifying buyer intent, posting
            the replies your rules authorise, recording that a reply succeeded,
            resolving short links, attributing clicks and conversions to your
            campaigns, enforcing the limits attached to your plan, and notifying you
            when a channel needs reauthorisation or a reply fails.
          </p>
          <p>
            We do not sell your data. We do not use your workspace content to train
            general-purpose models. We do not run third-party advertising or
            behavioural tracking scripts on bigredhub.info.
          </p>
        </Section>

        <Section id="youtube-api" heading="3. YouTube API Data and Limited Use">
          <p>
            The Service uses the official YouTube Data API v3. Authorised scopes let
            us read comments on the videos on channels you connect, read public
            channel statistics, and post comments as part of your automation.
          </p>
          <p>
            YouTube API data is handled under the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 underline hover:text-red-300"
            >
              Google API Services User Data Policy
            </a>{" "}
            and its Limited Use requirements. Concretely, that means we:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>use API data only to provide and improve the Service you asked for;</li>
            <li>
              keep it in encrypted transit and at rest, and never expose comment
              content to another workspace;
            </li>
            <li>
              not transfer it to any third party except the service providers named
              in section 4, who process it on our instructions under equivalent
              confidentiality obligations;
            </li>
            <li>
              not use it to serve advertising, and not sell or share it to build
              audiences for unrelated products;
            </li>
            <li>retain it only for as long as section 6 describes.</li>
          </ul>
        </Section>

        <Section id="cookies" heading="4. Cookies and Session Data">
          <p>
            We set one essential cookie, <code className="text-white font-mono">brh_session_token</code>,
            which holds a signed session token identifying you to the Service. It is
            HTTP-only, marked <code className="text-white font-mono">SameSite=Lax</code>, sent
            only over HTTPS in production, and expires after 30 days. Signing out
            clears it.
          </p>
          <p>
            A second short-lived cookie,{" "}
            <code className="text-white font-mono">brh_user_email</code>, is read by
            the conversion and logging endpoints so that server-side records can be
            attributed to your workspace.
          </p>
          <p>
            We do not set advertising, analytics or cross-site tracking cookies, and
            we do not use cookies to build a profile of you across other websites.
          </p>
        </Section>

        <Section id="providers" heading="5. Service Providers">
          <p>
            These providers process data on our behalf to run the Service. Each is
            used only for the purpose listed.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="py-2 pr-4 font-semibold text-white">Provider</th>
                  <th className="py-2 font-semibold text-white">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                <tr>
                  <td className="py-2 pr-4 text-white">Google</td>
                  <td className="py-2">Sign-in via OAuth; YouTube Data API v3 access to read comments and post replies.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-white">Supabase</td>
                  <td className="py-2">Managed Postgres database and authentication that hold the data listed in section 1.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-white">Vercel</td>
                  <td className="py-2">Hosting and serverless runtime that execute this application.</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 text-white">Cloudflare</td>
                  <td className="py-2">DNS, CDN and edge layer in front of bigredhub.info, including request metadata in edge logs.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Section>

        <Section id="retention" heading="6. Retention and Deletion">
          <p>
            <strong className="text-white">Revoking Google access.</strong> You can
            revoke BigRedHub&rsquo;s access at any time from your{" "}
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 underline hover:text-red-300"
            >
              Google account permissions
            </a>{" "}
            page. That immediately stops the Service using your token.
          </p>
          <p>
            <strong className="text-white">Disconnecting a channel.</strong> A
            channel is disconnected by removing it from your workspace. On removal,
            the row holding its OAuth tokens is deleted, and the stored comments and
            reply history attached to that channel are deleted with it through
            cascading foreign keys. Tracked links survive but lose the link to that
            channel, because they may still be resolving for links already posted.
          </p>
          <p>
            <strong className="text-white">Access tokens.</strong> OAuth refresh
            tokens are held only on the channel row and are destroyed when that row
            is deleted. We do not keep a second copy.
          </p>
          <p>
            <strong className="text-white">Account deletion.</strong> To delete your
            account and everything attached to your workspace, email us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-red-400 underline hover:text-red-300 font-mono"
            >
              {CONTACT_EMAIL}
            </a>
            . We action account deletion requests within 30 days and confirm
            completion by email.
          </p>
          <p>
            <strong className="text-white">What we keep after deletion.</strong>
            Aggregated, non-identifying counts needed for billing and abuse
            prevention may be retained in de-identified form. Comment text and
            commenter identifiers are deleted with the workspace and are not
            retained.
          </p>
        </Section>

        <Section id="security" heading="7. Security">
          <p>
            Traffic is served only over HTTPS. Session cookies are HTTP-only and
            signed, so a tampered token is rejected rather than trusted. Server-side
            access to the database uses a service-role key that exists only on the
            server and is never sent to the browser. Administrative access is
            restricted to accounts configured on the deployment, and the list of
            those accounts is not published in source.
          </p>
          <p>
            No system is perfectly secure. If a breach affects your personal data we
            will notify you and any regulator as required by applicable law.
          </p>
        </Section>

        <Section id="rights" heading="8. Your Rights">
          <p>
            Depending on where you live, you may have the right to access, correct,
            delete, restrict or object to processing of your personal data, to
            receive it in a portable format, and to withdraw consent. Because the
            Service is authorised through a Google account and operates on your own
            YouTube channel, we cannot create an account for a child — see section 10.
          </p>
          <p>
            To exercise any of these rights, email{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-red-400 underline hover:text-red-300 font-mono"
            >
              {CONTACT_EMAIL}
            </a>
            . We respond within 30 days. You also have the right to complain to your
            local data protection authority.
          </p>
          <p className="text-slate-400">
            Note on comment data: we hold comment text and commenter names on behalf of
            the channel owner whose videos received those comments. If you commented
            on a channel that uses BigRedHub and want that comment removed, contact
            us and we will forward your request to that channel owner, who controls
            the channel.
          </p>
        </Section>

        <Section id="transfers" heading="9. International Transfers">
          <p>
            Our providers process data outside your country. Supabase, Vercel and
            Google process in the regions they operate, and Cloudflare serves
            traffic from points of presence worldwide. Where data leaves your
            jurisdiction we rely on the providers&rsquo; standard contractual
            protections.
          </p>
        </Section>

        <Section id="children" heading="10. Children&rsquo;s Privacy">
          <p>
            BigRedHub is not directed at children under 13 (or under 16 where that
            is the applicable threshold) and we do not knowingly collect their
            personal data. Because accounts are tied to a Google login connected to
            a real YouTube channel, the Service is intended for adults operating
            their own channels. If you believe a child has provided us personal data,
            email us and we will delete it.
          </p>
        </Section>

        <Section id="changes" heading="11. Changes to This Policy">
          <p>
            We will update this page when our data practices change. The effective
            date at the top always reflects the current version. Material changes
            affecting existing users will be announced by email before they take
            effect.
          </p>
        </Section>

        <Section id="contact" heading="12. Contact">
          <p>
            For privacy questions, data requests, or to reach our data protection
            contact, write to{" "}
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