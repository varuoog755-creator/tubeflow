-- TubeFlow Supabase Database Schema

-- 1. Profiles / Creators
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Connected YouTube Channels
CREATE TABLE IF NOT EXISTS youtube_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  channel_id TEXT NOT NULL,
  channel_title TEXT NOT NULL,
  thumbnail_url TEXT,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expiry TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, channel_id)
);

-- 3. Automation Campaigns (Rules)
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  channel_id UUID REFERENCES youtube_channels(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  -- All videos or specific video IDs
  target_mode TEXT DEFAULT 'all' CHECK (target_mode IN ('all', 'specific', 'shorts_only')),
  video_ids TEXT[] DEFAULT '{}',
  -- Keywords matching
  keywords TEXT[] NOT NULL,
  match_type TEXT DEFAULT 'contains' CHECK (match_type IN ('exact', 'contains')),
  -- Auto-reply template with spintax support
  reply_templates TEXT[] NOT NULL,
  auto_like BOOLEAN DEFAULT true,
  auto_heart BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Processed Comment Logs (Prevents duplicate replies and stores analytics)
CREATE TABLE IF NOT EXISTS comment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  channel_id UUID REFERENCES youtube_channels(id) ON DELETE CASCADE NOT NULL,
  video_id TEXT NOT NULL,
  comment_id TEXT UNIQUE NOT NULL,
  author_name TEXT,
  author_channel_id TEXT,
  comment_text TEXT NOT NULL,
  reply_sent TEXT,
  status TEXT DEFAULT 'replied' CHECK (status IN ('replied', 'skipped', 'failed', 'flagged_spam')),
  processed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own channels" ON youtube_channels
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own campaigns" ON campaigns
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own comment logs" ON comment_logs
  FOR SELECT USING (
    channel_id IN (SELECT id FROM youtube_channels WHERE user_id = auth.uid())
  );
