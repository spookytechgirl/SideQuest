import "server-only";

import { grantEntitlement } from "@/lib/entitlements";
import {
  SIDEQUEST_PLUS,
  SUPPORT_PACK,
  retrieveSideQuestPlusSubscription,
  verifySideQuestPlusCheckout,
  verifySupportPackCheckout,
} from "@/lib/stripe";
import { saveSubscriptionRecord } from "@/lib/subscriptions";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isTrustedUserId(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

function getCheckoutUserId(session) {
  const metadataUserId = session?.metadata?.user_id;
  const referenceUserId = session?.client_reference_id;

  if (
    metadataUserId !== referenceUserId ||
    !isTrustedUserId(metadataUserId)
  ) {
    return null;
  }

  return metadataUserId;
}

async function processCheckoutCompleted(session) {
  const userId = getCheckoutUserId(session);

  if (!userId) {
    return { processed: false, reason: "invalid_user_binding" };
  }

  if (
    session.mode === "payment" &&
    session.metadata?.product_key === SUPPORT_PACK.productKey &&
    session.metadata?.entitlement_key === SUPPORT_PACK.entitlementKey
  ) {
    const verified = await verifySupportPackCheckout(session.id, userId);

    if (!verified) {
      return { processed: false, reason: "invalid_support_pack_checkout" };
    }

    await grantEntitlement({
      userId,
      entitlementKey: SUPPORT_PACK.entitlementKey,
      checkoutSessionId: verified.id,
    });

    return { processed: true, action: "entitlement_granted" };
  }

  if (
    session.mode === "subscription" &&
    session.metadata?.product_key === SIDEQUEST_PLUS.productKey &&
    session.metadata?.subscription_key === SIDEQUEST_PLUS.subscriptionKey
  ) {
    const verified = await verifySideQuestPlusCheckout(session.id, userId);

    if (!verified) {
      return { processed: false, reason: "invalid_subscription_checkout" };
    }

    await saveSubscriptionRecord({
      userId,
      checkoutSessionId: verified.session.id,
      subscription: verified.subscription,
    });

    return { processed: true, action: "subscription_checkout_synced" };
  }

  return { processed: false, reason: "unrelated_checkout" };
}

async function processSubscriptionChange(eventSubscription) {
  const userId = eventSubscription?.metadata?.user_id;

  if (
    !isTrustedUserId(userId) ||
    eventSubscription?.metadata?.product_key !== SIDEQUEST_PLUS.productKey ||
    eventSubscription?.metadata?.subscription_key !==
      SIDEQUEST_PLUS.subscriptionKey
  ) {
    return { processed: false, reason: "unrelated_subscription" };
  }

  const subscription = await retrieveSideQuestPlusSubscription(
    eventSubscription.id,
    userId,
    { requireActive: false },
  );

  if (!subscription) {
    return { processed: false, reason: "invalid_subscription" };
  }

  await saveSubscriptionRecord({ userId, subscription });

  return { processed: true, action: "subscription_synced" };
}

export async function processStripeWebhookEvent(event) {
  if (event?.livemode !== false) {
    return { processed: false, reason: "live_mode_rejected" };
  }

  switch (event.type) {
    case "checkout.session.completed":
      return processCheckoutCompleted(event.data.object);
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      return processSubscriptionChange(event.data.object);
    default:
      return { processed: false, reason: "event_not_handled" };
  }
}
