-- Run this file manually in the Supabase SQL Editor before testing public
-- database-backed quest pages. It grants read-only access to the trusted,
-- server-only Supabase role used by Next.js. Anonymous browser clients remain
-- unable to query public.quests directly, and existing RLS/policies are unchanged.

grant select on table public.quests to service_role;
