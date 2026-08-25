import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const SIDEQUEST_PLUS_SUBSCRIPTION = "sidequest_plus";

const ACTIVE_STATUSES = new Set(["active", "trialing"]);

function getStripeId(value) {
  return typeof value === "string" ? value : value?.id || null;
}

export function getCurrentPeriodEnd(subscription) {
  const periodEnds = (subscription?.items?.data || [])
    .map((item) => item.current_period_end)
    .filter((value) => Number.isInteger(value) && value > 0);

  if (!periodEnds.length) {
    return null;
  }

  return new Date(Math.max(...periodEnds) * 1000).toISOString();
}

export function normalizeSubscriptionRecord(record) {
  if (!record) {
    return {
      record: null,
      status: null,
      isActive: false,
      isCanceling: false,
    };
  }

  const isActive = ACTIVE_STATUSES.has(record.status);

  return {
    record,
    status: record.status,
    isActive,
    isCanceling: isActive && record.cancel_at_period_end === true,
  };
}

export async function getSubscriptionState(
  supabase,
  userId,
  subscriptionKey = SIDEQUEST_PLUS_SUBSCRIPTION,
) {
  if (!userId) {
    return { ...normalizeSubscriptionRecord(null), error: null };
  }

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select(
      "id, subscription_key, stripe_customer_id, stripe_subscription_id, stripe_checkout_session_id, status, current_period_end, cancel_at_period_end, updated_at",
    )
    .eq("user_id", userId)
    .eq("subscription_key", subscriptionKey)
    .maybeSingle();

  return {
    ...normalizeSubscriptionRecord(error ? null : data),
    error,
  };
}

export async function saveSubscriptionRecord({
  userId,
  checkoutSessionId,
  subscription,
  subscriptionKey = SIDEQUEST_PLUS_SUBSCRIPTION,
}) {
  const supabase = getSupabaseAdminClient();
  const stripeCustomerId = getStripeId(subscription.customer);

  const { error } = await supabase.from("user_subscriptions").upsert(
    {
      user_id: userId,
      subscription_key: subscriptionKey,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: subscription.id,
      stripe_checkout_session_id: checkoutSessionId || null,
      status: subscription.status,
      current_period_end: getCurrentPeriodEnd(subscription),
      cancel_at_period_end: subscription.cancel_at_period_end === true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,subscription_key" },
  );

  if (error) {
    const subscriptionError = new Error(
      "The subscription record could not be saved.",
    );
    subscriptionError.code = "subscription_write_failed";
    throw subscriptionError;
  }
}
