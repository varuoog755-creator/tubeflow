import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cachedAdminClient: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient {
  if (cachedAdminClient) return cachedAdminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url) {
    throw new Error("Missing required server environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }
  if (!serviceKey) {
    throw new Error("Missing required server environment variable: SUPABASE_SERVICE_ROLE_KEY");
  }

  cachedAdminClient = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return cachedAdminClient;
}

// The privileged client is created on first use instead of at import time.
//
// It used to be built while this module was being evaluated, and `next build`
// evaluates imported modules, so every build failed if the environment did not
// already hold the service-role key. That made Vercel preview deployments
// impossible to build, because that key is deliberately scoped to Production
// only and we do not want to hand the production service key to preview builds.
//
// Deferring construction keeps the build independent of the environment while
// still failing closed: the moment a request actually touches the database and
// the key is missing, the error surfaces there with a clear message rather than
// at deploy time.
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const client = getAdminClient();
    const value = Reflect.get(client as unknown as object, property);
    return typeof value === "function" ? value.bind(client) : value;
  },
});