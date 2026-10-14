/**
 * Channel rows must never be serialised to a client with their OAuth
 * credentials attached.
 *
 * Two separate endpoints did `select("*")` on `youtube_channels` and returned
 * the whole row, which published `access_token` and `refresh_token` to any
 * signed-in user. The refresh token is long lived and does not expire on its
 * own, so this is account-takeover grade rather than cosmetic - the holder can
 * act as the creator on YouTube indefinitely, without ever signing in here.
 *
 * It was fixed once in `/api/channels/videos` and the same bug stayed live in
 * `/api/campaigns`, so the rule lives here instead of being retyped per route.
 *
 * The fix is a deny-list rather than an allow-list on purpose: a column added to
 * the table later is stripped by default, instead of being published until
 * somebody remembers to add it to a second list.
 */
const CREDENTIAL_COLUMNS = ["access_token", "refresh_token", "client_secret", "token_expiry"];

export type PublicChannel<T> = Omit<T, "access_token" | "refresh_token">;

export function publicChannel<T extends Record<string, unknown>>(
  channel: T
): PublicChannel<T> {
  if (!channel) return channel as PublicChannel<T>;

  const safe: Record<string, unknown> = { ...channel };
  for (const column of CREDENTIAL_COLUMNS) {
    delete safe[column];
  }
  return safe as PublicChannel<T>;
}