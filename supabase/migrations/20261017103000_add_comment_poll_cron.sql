-- Background comment polling every 5 minutes.
--
-- The pricing table advertises a polling interval per plan (Free 30 minutes,
-- Pro 10, Scale/Agency 5). The poll route enforces the per-plan interval
-- itself; this migration only guarantees the 5-minute heartbeat exists
-- without any external account: pg_cron ticks the poll endpoint and pg_net
-- makes the HTTP call. Vercel's daily cron and the GitHub workflow remain as
-- backup triggers.
--
-- comment_poll_ticks is the endpoint's throttle: an unauthenticated tick has
-- to book the single row before it may sweep, so the endpoint needs no shared
-- secret in a public repository - a leaked URL can shift polling in time but
-- cannot outpace the schedule.
--
-- pg_cron must register into pg_catalog on Supabase (the plain form is the
-- docs bug supabase/supabase#28261); pg_net registers into `extensions` so it
-- stays out of `public` and satisfies the Security Advisor.

create extension if not exists pg_cron with schema pg_catalog;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;

create extension if not exists pg_net with schema extensions;

create table if not exists comment_poll_ticks (
  id integer primary key check (id = 1),
  last_tick_at timestamptz not null default '1970-01-01T00:00:00Z'
);

-- Service-role only. The anon key ships in the client bundle, so the throttle
-- row must never be reachable through PostgREST.
alter table comment_poll_ticks enable row level security;

insert into comment_poll_ticks (id, last_tick_at)
values (1, '1970-01-01T00:00:00Z')
on conflict (id) do nothing;

select cron.schedule(
  'bigredhub-comment-poll',
  '*/5 * * * *',
  $$
    select net.http_get(
      url := 'https://bigredhub.info/api/cron/poll-comments',
      timeout_milliseconds := 60000
    )
  $$
);
