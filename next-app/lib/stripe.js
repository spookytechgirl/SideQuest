import "server-only";
import Stripe from "stripe";
import { AI_QUEST_REMIX_ENTITLEMENT } from "@/lib/entitlements";
import { SITE_URL } from "@/lib/social-metadata";
import { SIDEQUEST_PLUS_SUBSCRIPTION } from "@/lib/subscriptions";

export const SUPPORT_PACK = Object.freeze({
  name: "SideQuest Support Pack",
  description: "A small test-mode purchase that supports the SideQuest adventure.",
  amount: 500,
  currency: "usd",
  productKey: "sidequest_support_pack",
  entitlementKey: AI_QUEST_REMIX_ENTITLEMENT,
});

export const SIDEQUEST_PLUS = Object.freeze({
  name: "SideQuest Plus",
  description: "A monthly subscription for more SideQuest adventures.",
  amount: 300,
  currency: "usd",
  interval: "month",
  productKey: "sidequest_plus",
  subscriptionKey: SIDEQUEST_PLUS_SUBSCRIPTION,
});

let stripeClient;

function createConfigurationError(code) {
  return Object.assign(new Error("Stripe is not configured for test checkout."), {
    code,
  });
}

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!secretKey) {
    throw createConfigurationError("missing_stripe_key");
  }

  if (!secretKey.startsWith("sk_test_")) {
    throw createConfigurationError("stripe_test_mode_required");
  }

  stripeClient ??= new Stripe(secretKey);
  return stripeClient;
}

function getFirstHeaderValue(value) {
  return value?.split(",")[0]?.trim() || "";
}

export function getCheckoutReturnOrigin(request) {
  const requestUrl = new URL(request.url);
  const requestHost =
    getFirstHeaderValue(request.headers.get("x-forwarded-host")) ||
    getFirstHeaderValue(request.headers.get("host"));
  const forwardedProtocol = getFirstHeaderValue(
    request.headers.get("x-forwarded-proto"),
  );
  const protocol = ["http", "https"].includes(forwardedProtocol)
    ? forwardedProtocol
    : requestUrl.protocol.slice(0, -1);
  let returnUrl = requestUrl;

  if (/^[a-z0-9.-]+(?::\d+)?$/i.test(requestHost)) {
    returnUrl = new URL(`${protocol}://${requestHost}`);
  }

  const requestIsLocal =
    requestUrl.hostname === "127.0.0.1" || requestUrl.hostname === "localhost";
  const returnIsLocal =
    returnUrl.hostname === "127.0.0.1" || returnUrl.hostname === "localhost";
  const vercelHost = process.env.VERCEL_URL?.trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  const isCurrentVercelDeployment =
    Boolean(vercelHost) && returnUrl.host === vercelHost;

  if (
    (requestIsLocal && returnIsLocal) ||
    returnUrl.origin === SITE_URL ||
    isCurrentVercelDeployment
  ) {
    return returnUrl.origin;
  }

  return SITE_URL;
}

export async function createSupportPackCheckout(origin, userId) {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    client_reference_id: userId,
    line_items: [
      {
        price_data: {
          currency: SUPPORT_PACK.currency,
          product_data: {
            name: SUPPORT_PACK.name,
            description: SUPPORT_PACK.description,
          },
          unit_amount: SUPPORT_PACK.amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: userId,
      entitlement_key: SUPPORT_PACK.entitlementKey,
      product_key: SUPPORT_PACK.productKey,
    },
    success_url: `${origin}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/purchase-cancelled`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL.");
  }

  return session.url;
}

export async function verifySupportPackCheckout(sessionId, userId) {
  if (!/^cs_test_[A-Za-z0-9]+$/.test(sessionId || "")) {
    return null;
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const isVerified =
    session.livemode === false &&
    session.mode === "payment" &&
    session.status === "complete" &&
    session.payment_status === "paid" &&
    session.amount_total === SUPPORT_PACK.amount &&
    session.currency === SUPPORT_PACK.currency &&
    session.client_reference_id === userId &&
    session.metadata?.user_id === userId &&
    session.metadata?.product_key === SUPPORT_PACK.productKey &&
    session.metadata?.entitlement_key === SUPPORT_PACK.entitlementKey;

  return isVerified ? session : null;
}

function getStripeId(value) {
  return typeof value === "string" ? value : value?.id || null;
}

const SIDEQUEST_PLUS_STATUSES = new Set([
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
]);

export function isExpectedSideQuestPlusSubscription(
  subscription,
  userId,
  { requireActive = true } = {},
) {
  const items = subscription?.items?.data || [];
  const hasExpectedStatus = requireActive
    ? ["active", "trialing"].includes(subscription?.status)
    : SIDEQUEST_PLUS_STATUSES.has(subscription?.status);

  if (
    subscription?.livemode !== false ||
    !hasExpectedStatus ||
    subscription.metadata?.user_id !== userId ||
    subscription.metadata?.product_key !== SIDEQUEST_PLUS.productKey ||
    subscription.metadata?.subscription_key !== SIDEQUEST_PLUS.subscriptionKey ||
    items.length !== 1
  ) {
    return false;
  }

  const item = items[0];
  const price = item.price;
  const product = price?.product;

  return (
    item.quantity === 1 &&
    price?.type === "recurring" &&
    price?.unit_amount === SIDEQUEST_PLUS.amount &&
    price?.currency === SIDEQUEST_PLUS.currency &&
    price?.recurring?.interval === SIDEQUEST_PLUS.interval &&
    price?.recurring?.interval_count === 1 &&
    typeof product === "object" &&
    product?.deleted !== true &&
    product?.name === SIDEQUEST_PLUS.name
  );
}

export async function retrieveSideQuestPlusSubscription(
  subscriptionId,
  userId,
  { requireActive = false } = {},
) {
  if (!/^sub_[A-Za-z0-9]+$/.test(subscriptionId || "")) {
    return null;
  }

  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price.product"],
  });

  return isExpectedSideQuestPlusSubscription(subscription, userId, {
    requireActive,
  })
    ? subscription
    : null;
}

export async function createSideQuestPlusCheckout(origin, userId) {
  const stripe = getStripeClient();
  const metadata = {
    user_id: userId,
    subscription_key: SIDEQUEST_PLUS.subscriptionKey,
    product_key: SIDEQUEST_PLUS.productKey,
  };
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    client_reference_id: userId,
    line_items: [
      {
        price_data: {
          currency: SIDEQUEST_PLUS.currency,
          product_data: {
            name: SIDEQUEST_PLUS.name,
            description: SIDEQUEST_PLUS.description,
          },
          unit_amount: SIDEQUEST_PLUS.amount,
          recurring: { interval: SIDEQUEST_PLUS.interval },
        },
        quantity: 1,
      },
    ],
    metadata,
    subscription_data: { metadata },
    success_url: `${origin}/subscription-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/subscription-cancelled`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a subscription Checkout URL.");
  }

  return session.url;
}

export async function verifySideQuestPlusCheckout(sessionId, userId) {
  if (!/^cs_test_[A-Za-z0-9]+$/.test(sessionId || "")) {
    return null;
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const subscriptionId = getStripeId(session.subscription);

  if (!subscriptionId) {
    return null;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price.product"],
  });
  const sessionCustomerId = getStripeId(session.customer);
  const subscriptionCustomerId = getStripeId(subscription.customer);
  const sessionIsVerified =
    session.livemode === false &&
    session.mode === "subscription" &&
    session.status === "complete" &&
    session.payment_status === "paid" &&
    session.amount_total === SIDEQUEST_PLUS.amount &&
    session.currency === SIDEQUEST_PLUS.currency &&
    session.client_reference_id === userId &&
    session.metadata?.user_id === userId &&
    session.metadata?.product_key === SIDEQUEST_PLUS.productKey &&
    session.metadata?.subscription_key === SIDEQUEST_PLUS.subscriptionKey &&
    sessionCustomerId &&
    sessionCustomerId === subscriptionCustomerId;

  if (
    !sessionIsVerified ||
    !isExpectedSideQuestPlusSubscription(subscription, userId)
  ) {
    return null;
  }

  return { session, subscription };
}

export async function cancelSideQuestPlusSubscription(
  stripeSubscriptionId,
  userId,
) {
  const subscription = await retrieveSideQuestPlusSubscription(
    stripeSubscriptionId,
    userId,
    { requireActive: true },
  );

  if (!subscription) {
    return null;
  }

  if (subscription.cancel_at_period_end) {
    return subscription;
  }

  return getStripeClient().subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: true,
  });
}
