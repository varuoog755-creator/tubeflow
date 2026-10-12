-- Baseline: mark the production schema as already applied.
--
-- This project was built before `supabase db push` was adopted. The 14 public
-- tables (profiles, workspaces, workspace_members, youtube_channels,
-- trigger_rules, campaigns, comment_logs, processed_comments, tracked_links,
-- click_events, conversions, competitors, notifications, usage_metering) were
-- applied by hand, so the project has no `supabase_migrations` history.
--
-- Without this marker the CLI would try to replay every migration from scratch
-- against a database that already has these tables. Recording the baseline means
-- only migrations with a version *after* this one are applied going forward.
--
-- The statements array is intentionally empty: this migration makes no schema
-- change, it only records where history begins.

insert into supabase_migrations.schema_migrations (version, name, statements)
values (
  '20261012090000',
  'baseline_existing_schema',
  ARRAY[]::text[]
)
on conflict (version) do nothing;