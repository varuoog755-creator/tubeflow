-- Add BYOK (Bring Your Own Key) columns to workspaces table
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS byok_client_id TEXT;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS byok_client_secret TEXT;
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS byok_enabled BOOLEAN DEFAULT false;
