import { google } from "googleapis";

export function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  return "https://bigredhub.info";
}

export interface CustomGcpCredentials {
  clientId?: string | null;
  clientSecret?: string | null;
}

export function getOAuth2Client(redirectUri?: string, customCreds?: CustomGcpCredentials) {
  const uri = redirectUri || `${getAppUrl()}/api/auth/callback/google`;
  const clientId = customCreds?.clientId?.trim() || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = customCreds?.clientSecret?.trim() || process.env.GOOGLE_CLIENT_SECRET;
  return new google.auth.OAuth2(
    clientId,
    clientSecret,
    uri
  );
}

export const oauth2Client = getOAuth2Client();

export const YOUTUBE_SCOPES = [
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/youtube.force-ssl",
  "https://www.googleapis.com/auth/youtube.readonly",
];

export function getAuthUrl(redirectUri?: string, customCreds?: CustomGcpCredentials) {
  const client = getOAuth2Client(redirectUri, customCreds);
  return client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: YOUTUBE_SCOPES,
    include_granted_scopes: true,
  });
}

export function getYoutubeClient(accessToken: string, refreshToken?: string, customCreds?: CustomGcpCredentials) {
  const clientId = customCreds?.clientId?.trim() || process.env.GOOGLE_CLIENT_ID;
  const clientSecret = customCreds?.clientSecret?.trim() || process.env.GOOGLE_CLIENT_SECRET;
  const client = new google.auth.OAuth2(
    clientId,
    clientSecret
  );

  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return google.youtube({
    version: "v3",
    auth: client,
  });
}

export interface ChannelTokenData {
  id: string;
  access_token: string;
  refresh_token?: string | null;
  token_expiry?: string | null;
}

/**
 * Retrieves an authenticated YouTube API client, automatically refreshing
 * the access token via the stored refresh token if the current token has expired
 * or is within 3 minutes of expiry. Persists refreshed tokens in Supabase.
 */
export async function getValidYoutubeClient(channel: ChannelTokenData, customCreds?: CustomGcpCredentials) {
  let activeAccessToken = channel.access_token;
  const now = Date.now();
  const expiryTime = channel.token_expiry ? new Date(channel.token_expiry).getTime() : 0;
  const isExpiringSoon = expiryTime > 0 && expiryTime - now < 3 * 60 * 1000;

  if (isExpiringSoon && channel.refresh_token) {
    try {
      const clientId = customCreds?.clientId?.trim() || process.env.GOOGLE_CLIENT_ID;
      const clientSecret = customCreds?.clientSecret?.trim() || process.env.GOOGLE_CLIENT_SECRET;
      const client = new google.auth.OAuth2(
        clientId,
        clientSecret
      );
      client.setCredentials({ refresh_token: channel.refresh_token });
      const { credentials } = await client.refreshAccessToken();

      if (credentials.access_token) {
        activeAccessToken = credentials.access_token;
        const newExpiry = credentials.expiry_date
          ? new Date(credentials.expiry_date).toISOString()
          : new Date(now + 3600 * 1000).toISOString();

        // Update database with refreshed token
        const { supabaseAdmin } = await import("./supabase");
        await supabaseAdmin
          .from("youtube_channels")
          .update({
            access_token: activeAccessToken,
            token_expiry: newExpiry,
            updated_at: new Date().toISOString(),
          })
          .eq("id", channel.id);
      }
    } catch (refreshErr) {
      console.error(`Token refresh failed for channel ${channel.id}:`, refreshErr);
      // Fallback: continue with current access token
    }
  }

  return getYoutubeClient(activeAccessToken, channel.refresh_token || undefined, customCreds);
}

export function isYoutubeQuotaError(error: unknown): boolean {
  if (!error) return false;
  const errStr = (
    error instanceof Error
      ? `${error.message} ${error.name} ${error.stack || ""}`
      : typeof error === "object"
      ? JSON.stringify(error)
      : String(error)
  ).toLowerCase();

  return (
    errStr.includes("quotaexceeded") ||
    errStr.includes("quota exceeded") ||
    errStr.includes("daily limit exceeded") ||
    errStr.includes("user_rate_limit_exceeded")
  );
}

export function isYoutubeTokenRevoked(error: unknown): boolean {
  if (!error) return false;
  const errStr = (
    error instanceof Error
      ? `${error.message} ${error.name} ${error.stack || ""}`
      : typeof error === "object"
      ? JSON.stringify(error)
      : String(error)
  ).toLowerCase();

  return (
    errStr.includes("invalid_grant") ||
    errStr.includes("token has been expired or revoked") ||
    errStr.includes("revoked")
  );
}
