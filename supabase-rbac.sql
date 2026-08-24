-- Run this file manually in the Supabase SQL Editor.
-- It adds role records for Supabase Auth users and restricts quest mutations to admins.

create table public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user'
    check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.user_roles enable row level security;

revoke all on table public.user_roles from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select on table public.user_roles to authenticated;

create policy "Users can read their own role"
on public.user_roles for select
to authenticated
using ((select auth.uid()) = user_id);

-- Give every existing Auth user a normal-user role. This does not grant admin access.
insert into public.user_roles (user_id)
select id
from auth.users
on conflict (user_id) do nothing;

-- Give future Auth users the default normal-user role automatically.
create or replace function public.handle_new_user_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.user_roles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user_role() from public;

create trigger on_auth_user_created_add_role
after insert on auth.users
for each row execute function public.handle_new_user_role();

-- Replace the original authenticated-user mutation policies.
drop policy if exists "Authenticated users can create quests" on public.quests;
drop policy if exists "Authenticated users can update quests" on public.quests;
drop policy if exists "Authenticated users can delete quests" on public.quests;

create policy "Admins can create quests"
on public.quests for insert
to authenticated
with check (
  exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);

create policy "Admins can update quests"
on public.quests for update
to authenticated
using (
  exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);

create policy "Admins can delete quests"
on public.quests for delete
to authenticated
using (
  exists (
    select 1
    from public.user_roles
    where user_id = (select auth.uid())
      and role = 'admin'
  )
);

-- The existing "Authenticated users can read quests" policy remains unchanged.

-- MANUAL ADMIN ASSIGNMENT (run separately after replacing the email below):
-- insert into public.user_roles (user_id, role)
-- select id, 'admin'
-- from auth.users
-- where lower(email) = lower('YOUR-EMAIL@example.com')
-- on conflict (user_id) do update set role = excluded.role;
