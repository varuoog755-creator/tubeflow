import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://tusyzwhocjikonvqwgsq.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1c3l6d2hvY2ppa29udnF3Z3NxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE0MzAwODcsImV4cCI6MjEwNzAwNjA4N30.ulO8QQ5rwlds1qMg2DsM8NJAt730Bw0rvcW0B5SWVIw";
const DEFAULT_SUPABASE_SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1c3l6d2hvY2ppa29udnF3Z3NxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTQzMDA4NywiZXhwIjoyMTA3MDA2MDg3fQ.K5SfUBp8MtHCW7l9TAxTSXcNknvS2T9F87zFLgdHFss";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || DEFAULT_SUPABASE_SERVICE_KEY;

// Browser / Client-safe instance with fallback guaranteed for static build phase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin / Server-side worker instance (bypasses RLS for automated cron/webhooks)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);
