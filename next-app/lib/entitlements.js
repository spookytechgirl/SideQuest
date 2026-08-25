import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const AI_QUEST_REMIX_ENTITLEMENT = "ai_quest_remix";

export async function getEntitlementState(
  supabase,
  userId,
  entitlementKey = AI_QUEST_REMIX_ENTITLEMENT,
) {
  if (!userId) {
    return { isEntitled: false, error: null };
  }

  const { data, error } = await supabase
    .from("user_entitlements")
    .select("id")
    .eq("user_id", userId)
    .eq("entitlement_key", entitlementKey)
    .maybeSingle();

  return {
    isEntitled: Boolean(data),
    error,
  };
}

export async function grantEntitlement({
  userId,
  entitlementKey = AI_QUEST_REMIX_ENTITLEMENT,
  checkoutSessionId,
}) {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("user_entitlements").upsert(
    {
      user_id: userId,
      entitlement_key: entitlementKey,
      stripe_checkout_session_id: checkoutSessionId,
    },
    {
      onConflict: "user_id,entitlement_key",
      ignoreDuplicates: true,
    },
  );

  if (error) {
    const entitlementError = new Error("The entitlement could not be saved.");
    entitlementError.code = "entitlement_write_failed";
    throw entitlementError;
  }
}
