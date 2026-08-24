-- Run this file manually in the Supabase SQL Editor after reviewing it.
-- It creates authenticated, owner-only custom quest content.

create table public.user_quests (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  quest_text text not null
    check (char_length(btrim(quest_text)) between 1 and 240),
  category text not null
    check (category in (
      'Outdoors',
      'Creative',
      'Food',
      'Local Adventure',
      'Relaxing',
      'Random'
    )),
  effort text not null
    check (effort in (
      'Quick',
      'Easy',
      'A Little Effort',
      'Adventure'
    )),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index user_quests_user_updated_idx
on public.user_quests (user_id, updated_at desc);

alter table public.user_quests enable row level security;

revoke all on table public.user_quests from public, anon, authenticated;
revoke all on sequence public.user_quests_id_seq from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.user_quests to authenticated;
grant usage, select on sequence public.user_quests_id_seq to authenticated;

create policy "Users can read their own quests"
on public.user_quests for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own quests"
on public.user_quests for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own quests"
on public.user_quests for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own quests"
on public.user_quests for delete
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.set_user_quest_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_user_quest_updated_at() from public, anon, authenticated;

create trigger set_user_quest_updated_at
before update on public.user_quests
for each row execute function public.set_user_quest_updated_at();
