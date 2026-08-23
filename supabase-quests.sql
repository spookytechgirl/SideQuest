-- Run this file manually in the Supabase SQL Editor.
-- It creates the homework CRUD table and restricts all access to authenticated users.

create table public.quests (
  id bigint generated always as identity primary key,
  quest_text text not null
    check (char_length(trim(quest_text)) between 1 and 240),
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
  created_at timestamptz not null default now()
);

alter table public.quests enable row level security;

revoke all on table public.quests from public, anon, authenticated;
revoke all on sequence public.quests_id_seq from public, anon, authenticated;

grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.quests to authenticated;
grant usage, select on sequence public.quests_id_seq to authenticated;

create policy "Authenticated users can read quests"
on public.quests for select
to authenticated
using ((select auth.uid()) is not null);

create policy "Authenticated users can create quests"
on public.quests for insert
to authenticated
with check ((select auth.uid()) is not null);

create policy "Authenticated users can update quests"
on public.quests for update
to authenticated
using ((select auth.uid()) is not null)
with check ((select auth.uid()) is not null);

create policy "Authenticated users can delete quests"
on public.quests for delete
to authenticated
using ((select auth.uid()) is not null);
