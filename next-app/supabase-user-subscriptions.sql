-- Run this file manually in the Supabase SQL Editor after reviewing it.
-- It stores trusted Stripe subscription state for authenticated SideQuest users.

create table public.user_subscriptions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_key text not null
    check (subscription_key in ('sidequest_plus')),
  stripe_customer_id text,
  stripe_subscription_id text not null,
  stripe_checkout_session_id text,
  status text not null
    check (
      status in (
        'incomplete',
        'incomplete_expired',
        'trialing',
        'active',
        'past_due',
        'canceled',
        'unpaid',
        'paused'
      )
    ),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, subscription_key),
  unique (stripe_subscription_id),
  unique (stripe_checkout_session_id)
);

create index user_subscriptions_user_updated_idx
on public.user_subscriptions (user_id, updated_at desc);

create or replace function public.set_user_subscriptions_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_user_subscriptions_updated_at
before update on public.user_subscriptions
for each row execute function public.set_user_subscriptions_updated_at();

alter table public.user_subscriptions enable row level security;

revoke all on table public.user_subscriptions from public, anon, authenticated;
revoke all on sequence public.user_subscriptions_id_seq from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select on table public.user_subscriptions to authenticated;
grant select, insert, update on table public.user_subscriptions to service_role;
grant usage, select on sequence public.user_subscriptions_id_seq to service_role;

create policy "Users can read their own subscription"
on public.user_subscriptions for select
to authenticated
using ((select auth.uid()) = user_id);

-- No INSERT, UPDATE, or DELETE grants or policies are given to anon or
-- authenticated. Trusted subscription writes happen only after server-side
-- Stripe verification through the server-only Supabase client.
