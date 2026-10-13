// Administrators are configured through the environment, never in source.
// Previously this file hardcoded two email addresses. Because the repository is
// public, those addresses were readable by anyone, which turned `isAdmin` into
// a role that anyone who knew the repo could obtain.
//
// Configure with either:
//   ADMIN_EMAIL=you@example.com            (single admin, preferred)
//   ADMIN_EMAILS=you@example.com,other@x.com (comma separated, multiple)
//
// If neither is set, `isAdmin` always returns false and the admin surface is
// closed rather than falling open.
function getAdminEmails(): string[] {
  const single = process.env.ADMIN_EMAIL?.trim();
  const multiple = process.env.ADMIN_EMAILS?.split(",");
  const list = [single, ...(multiple || [])]
    .map((value) => value?.trim().toLowerCase())
    .filter((value): value is string => Boolean(value));
  return [...new Set(list)];
}

export function isAdmin(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.toLowerCase().trim();
  return getAdminEmails().includes(cleanEmail);
}

// The plan catalogue and the rules that apply to it live in
// src/lib/plan-limits.ts. They are re-exported here because several routes
// already imported PLAN_CONFIGS from this module, and moving the definition
// out is what lets it be unit tested: node --test cannot resolve the `@/`
// alias or the Supabase client, but it can load a module with no imports.
export { PLAN_CONFIGS } from "./plan-limits";
export type { PlanConfig } from "./plan-limits";
