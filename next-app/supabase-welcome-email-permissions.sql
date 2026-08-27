-- Run this file manually in the Supabase SQL Editor after reviewing it.
-- It gives the existing trusted server-only client only the profile-column
-- access required to check and record welcome-email delivery.

grant usage on schema public to service_role;

grant select (user_id, display_name, welcome_email_sent_at)
on table public.profiles
to service_role;

grant update (welcome_email_sent_at)
on table public.profiles
to service_role;
