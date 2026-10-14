import type { MetadataRoute } from "next";

const SITE_URL = "https://bigredhub.info";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Signed-in surfaces and the short-link redirect. Crawling /dashboard
        // yields a 307 to the login page and /r/<slug> resolves other people's
        // tracked links, neither of which belongs in an index.
        disallow: ["/dashboard", "/api/", "/login", "/r/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}