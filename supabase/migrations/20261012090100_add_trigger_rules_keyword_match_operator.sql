-- Add the missing keyword_match_operator column to public.trigger_rules.
--
-- src/lib/db-schema.sql previously declared this column in an ALTER statement
-- placed *before* the CREATE TABLE for the same table. On a database where the
-- table did not yet exist the ALTER failed, and because the subsequent
-- `CREATE TABLE IF NOT EXISTS` was then skipped (the table already existed), the
-- column was never added. The dashboard reads and writes this field in five
-- places, so the rule editor silently degraded to the 'ANY' default.
--
-- `IF NOT EXISTS` keeps this safe to re-run. Existing rows backfill to 'ANY',
-- which matches the behaviour the dashboard was already falling back to.

alter table public.trigger_rules
  add column if not exists keyword_match_operator text not null default 'ANY';