import "server-only";

import { createClient } from "@supabase/supabase-js";

let adminClient;

function createConfigurationError() {
  const error = new Error("The trusted Supabase client is not configured.");
  error.code = "missing_supabase_secret";
  return error;
}

export function getSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const secretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!url || !secretKey) {
    throw createConfigurationError();
  }

  adminClient ??= createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });

  return adminClient;
}
