-- Run this file manually in the Supabase SQL Editor after reviewing it.
-- It creates private per-user profile rows and an owner-writable avatar bucket.

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 80),
  bio text check (bio is null or char_length(bio) <= 280),
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

revoke all on table public.profiles from public, anon, authenticated;
grant usage on schema public to authenticated;
grant select, insert, update on table public.profiles to authenticated;

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own profile"
on public.profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke all on function public.set_profile_updated_at() from public, anon, authenticated;

create trigger set_profile_updated_at
before update on public.profiles
for each row execute function public.set_profile_updated_at();

-- AVATAR STORAGE
-- This bucket is public for image reads only. Public URLs are simple to render on
-- a static Vercel site. Upload, replacement, and deletion still require an
-- authenticated owner whose user ID matches the first path segment.
--
-- The app always writes one object per user at: <auth-user-id>/avatar
-- Allowed MIME types: PNG, JPEG, and WebP. Maximum size: 2 MiB.

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'avatars',
  'avatars',
  true,
  2097152,
  array['image/png', 'image/jpeg', 'image/webp']
);

create policy "Users can read their own avatar object"
on storage.objects for select
to authenticated
using (
  bucket_id = 'avatars'
  and name = (select auth.uid())::text || '/avatar'
);

create policy "Users can upload their own avatar"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and name = (select auth.uid())::text || '/avatar'
);

create policy "Users can replace their own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars'
  and name = (select auth.uid())::text || '/avatar'
)
with check (
  bucket_id = 'avatars'
  and name = (select auth.uid())::text || '/avatar'
);

create policy "Users can delete their own avatar"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
  and name = (select auth.uid())::text || '/avatar'
);
