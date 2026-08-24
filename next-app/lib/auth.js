import { cache } from "react";
import { redirect } from "next/navigation";
import { getLoginPath, getSafeReturnPath } from "@/lib/auth-paths";
import { createClient } from "@/lib/supabase/server";

export const getAuthContext = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return {
    supabase,
    user: error ? null : user,
  };
});

export const getViewerContext = cache(async () => {
  const context = await getAuthContext();

  if (!context.user) {
    return { ...context, role: null, roleError: null };
  }

  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.user.id)
    .maybeSingle();

  return {
    ...context,
    role: error ? null : data?.role || "user",
    roleError: error,
  };
});

export async function requireUser(returnTo) {
  const context = await getAuthContext();

  if (!context.user) {
    redirect(getLoginPath(getSafeReturnPath(returnTo, "/")));
  }

  return context;
}
