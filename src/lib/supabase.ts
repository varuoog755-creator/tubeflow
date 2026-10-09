import "server-only";
import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

const supabaseUrl = requiredEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
const supabaseServiceKey = requiredEnv("SUPABASE_SERVICE_ROLE_KEY");

// Public/anon client. Database permissions must still be enforced by RLS.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only privileged client. Never expose this client or key to browser code.
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
