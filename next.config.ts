import type { NextConfig } from "next";

/**
 * Security headers for every response.
 *
 * CSP notes, so nobody "simplifies" this into a broken site:
 * - 'unsafe-inline' on script-src: Next.js hydration relies on inline bootstrap
 *   scripts; there is no nonce plumbing here. Removes it and every client
 *   component dies. Dev additionally needs 'unsafe-eval' for Fast Refresh.
 * - fonts.googleapis.com (styles) + fonts.gstatic.com (fonts): globals.css
 *   @imports Inter from Google Fonts.
 * - img-src https: YouTube thumbnails and Google avatar URLs arrive as remote
 *   data, not local assets.
 * - frame-src: the demo modal is currently a mockup, but YouTube embeds are
 *   the likely next thing, so allow them without widening everything.
 */
const csp = [
  "default-src 'self'",
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
  "worker-src 'self' blob:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  typescript: {
    // Already validated locally via npm run build
    ignoreBuildErrors: false,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          // Clickjacking cover for the clients frame-ancestors does not reach.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
