import type { MetadataRoute } from "next";

const SITE_URL = "https://bigredhub.info";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Only the pages that are genuinely public. /dashboard requires a session and
  // redirects to the login screen; /login is deliberately left out because it is
  // a waypoint rather than something anyone searches for.
  return [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/guide`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}