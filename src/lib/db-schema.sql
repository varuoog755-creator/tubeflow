-- TubeFlow SaaS Production Database Schema
-- Multi-tenant workspace and channel architecture

-- 1. Workspaces
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free', -- free, starter, pro, agency
  plan_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Workspace Members
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'owner', -- owner, admin, member, viewer
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- 3. Enhance YouTube Channels Table
ALTER TABLE public.youtube_channels ADD COLUMN IF NOT EXISTS workspace_id UUID REFERENCES public.workspaces(id) ON DELETE SET NULL;
ALTER TABLE public.youtube_channels ADD COLUMN IF NOT EXISTS subscriber_count BIGINT DEFAULT 0;
ALTER TABLE public.youtube_channels ADD COLUMN IF NOT EXISTS video_count BIGINT DEFAULT 0;
ALTER TABLE public.youtube_channels ADD COLUMN IF NOT EXISTS view_count BIGINT DEFAULT 0;
ALTER TABLE public.youtube_channels ADD COLUMN IF NOT EXISTS custom_url TEXT;

-- 4. Trigger Rules (Upgraded Campaigns)
CREATE TABLE IF NOT EXISTS public.trigger_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES public.youtube_channels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}',
  negative_keywords TEXT[] NOT NULL DEFAULT '{}',
  match_type TEXT NOT NULL DEFAULT 'contains', -- contains, exact, phrase, regex, ai_intent
  target_mode TEXT NOT NULL DEFAULT 'all', -- all, shorts_only, specific_videos
  target_video_ids TEXT[] DEFAULT '{}',
  reply_templates TEXT[] NOT NULL DEFAULT '{}',
  cta_url TEXT,
  tracked_link_id UUID,
  intent_category TEXT DEFAULT 'ALL', -- ALL, BUYING_INTENT, PRICE_REQUEST, LINK_REQUEST, PRODUCT_QUESTION
  ai_confidence_threshold NUMERIC(3,2) DEFAULT 0.85,
  delay_seconds INT DEFAULT 0,
  max_replies_per_day INT DEFAULT 500,
  cooldown_minutes INT DEFAULT 60,
  language TEXT DEFAULT 'en',
  tone TEXT DEFAULT 'friendly',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Tracked Links (Click & Conversion Attribution)
CREATE TABLE IF NOT EXISTS public.tracked_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES public.youtube_channels(id) ON DELETE SET NULL,
  rule_id UUID REFERENCES public.trigger_rules(id) ON DELETE SET NULL,
  slug TEXT UNIQUE NOT NULL,
  destination_url TEXT NOT NULL,
  campaign_name TEXT,
  clicks_count BIGINT NOT NULL DEFAULT 0,
  leads_count BIGINT NOT NULL DEFAULT 0,
  conversions_count BIGINT NOT NULL DEFAULT 0,
  revenue_generated NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Click Events
CREATE TABLE IF NOT EXISTS public.click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracked_link_id UUID NOT NULL REFERENCES public.tracked_links(id) ON DELETE CASCADE,
  device TEXT,
  country TEXT,
  referrer TEXT,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Conversions (Attributed to Click and Comment)
CREATE TABLE IF NOT EXISTS public.conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracked_link_id UUID REFERENCES public.tracked_links(id) ON DELETE SET NULL,
  rule_id UUID REFERENCES public.trigger_rules(id) ON DELETE SET NULL,
  channel_id UUID REFERENCES public.youtube_channels(id) ON DELETE SET NULL,
  conversion_type TEXT NOT NULL DEFAULT 'lead', -- lead, purchase, signup
  order_value NUMERIC(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'INR',
  customer_identifier TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. YouTube Comments & Processing (Idempotency Engine)
CREATE TABLE IF NOT EXISTS public.processed_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES public.youtube_channels(id) ON DELETE CASCADE,
  comment_id TEXT NOT NULL,
  video_id TEXT NOT NULL,
  video_title TEXT,
  author_name TEXT NOT NULL,
  author_channel_id TEXT,
  comment_text TEXT NOT NULL,
  detected_intent TEXT,
  ai_confidence NUMERIC(3,2),
  matched_rule_id UUID REFERENCES public.trigger_rules(id) ON DELETE SET NULL,
  reply_status TEXT NOT NULL DEFAULT 'pending', -- pending, replied, skipped, duplicate, spam, error
  reply_text TEXT,
  youtube_reply_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  UNIQUE(channel_id, comment_id)
);

-- 9. Competitors
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  competitor_channel_id TEXT NOT NULL,
  channel_title TEXT NOT NULL,
  custom_url TEXT,
  thumbnail_url TEXT,
  subscriber_count BIGINT DEFAULT 0,
  video_count BIGINT DEFAULT 0,
  total_views BIGINT DEFAULT 0,
  upload_frequency_per_week NUMERIC(4,2) DEFAULT 0.0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, competitor_channel_id)
);

-- 10. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- auth_expired, reply_failed, quota_warning, conversion_milestone, system
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Usage Metering
CREATE TABLE IF NOT EXISTS public.usage_metering (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  replies_used INT NOT NULL DEFAULT 0,
  ai_intent_credits_used INT NOT NULL DEFAULT 0,
  tracked_clicks INT NOT NULL DEFAULT 0,
  api_calls INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, period_start)
);

-- Indexes for ultra-fast multi-tenant querying
CREATE INDEX IF NOT EXISTS idx_workspaces_owner ON public.workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON public.workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_channels_workspace ON public.youtube_channels(workspace_id);
CREATE INDEX IF NOT EXISTS idx_trigger_rules_channel ON public.trigger_rules(channel_id);
CREATE INDEX IF NOT EXISTS idx_trigger_rules_workspace ON public.trigger_rules(workspace_id);
CREATE INDEX IF NOT EXISTS idx_processed_comments_channel ON public.processed_comments(channel_id);
CREATE INDEX IF NOT EXISTS idx_processed_comments_comment_id ON public.processed_comments(comment_id);
CREATE INDEX IF NOT EXISTS idx_tracked_links_slug ON public.tracked_links(slug);
CREATE INDEX IF NOT EXISTS idx_click_events_link ON public.click_events(tracked_link_id);
CREATE INDEX IF NOT EXISTS idx_conversions_link ON public.conversions(tracked_link_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
