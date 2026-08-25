-- Run this file manually in the Supabase SQL Editor after reviewing it.
-- It stores server-granted paid feature entitlements for authenticated users.

create table public.user_entitlements (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  entitlement_key text not null
    check (entitlement_key in ('ai_quest_remix')),
  stripe_checkout_session_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, entitlement_key),
  unique (stripe_checkout_session_id)
);

create index user_entitlements_user_created_idx
on public.user_entitlements (user_id, created_at desc);

alter table public.user_entitlements enable row level security;

revoke all on table public.user_entitlements from public, anon, authenticated;
revoke all on sequence public.user_entitlements_id_seq from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select on table public.user_entitlements to authenticated;
grant select, insert on table public.user_entitlements to service_role;
grant usage, select on sequence public.user_entitlements_id_seq to service_role;

create policy "Users can read their own entitlements"
on public.user_entitlements for select
to authenticated
using ((select auth.uid()) = user_id);

-- No INSERT, UPDATE, or DELETE grants or policies are given to anon or
-- authenticated. Entitlements are written only by the trusted server after
-- Stripe payment verification.
