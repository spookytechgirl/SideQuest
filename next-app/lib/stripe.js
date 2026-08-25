import "server-only";
import Stripe from "stripe";
import { SITE_URL } from "@/lib/social-metadata";

export const SUPPORT_PACK = Object.freeze({
  name: "SideQuest Support Pack",
  description: "A small test-mode purchase that supports the SideQuest adventure.",
  amount: 500,
  currency: "usd",
  metadataKey: "sidequest-support-pack",
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

export function getCheckoutReturnOrigin(request) {
  const requestUrl = new URL(request.url);
  const isLocal =
    requestUrl.hostname === "127.0.0.1" || requestUrl.hostname === "localhost";
  const isVercelDeployment = requestUrl.hostname.endsWith(".vercel.app");

  if (isLocal || requestUrl.origin === SITE_URL || isVercelDeployment) {
    return requestUrl.origin;
  }

  return SITE_URL;
}

export async function createSupportPackCheckout(origin) {
  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
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
      purchase: SUPPORT_PACK.metadataKey,
    },
    success_url: `${origin}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/purchase-cancelled`,
  });

  if (!session.url) {
    throw new Error("Stripe did not return a Checkout URL.");
  }

  return session.url;
}

export async function verifySupportPackCheckout(sessionId) {
  if (!/^cs_test_[A-Za-z0-9]+$/.test(sessionId || "")) {
    return false;
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  return (
    session.livemode === false &&
    session.mode === "payment" &&
    session.status === "complete" &&
    session.payment_status === "paid" &&
    session.amount_total === SUPPORT_PACK.amount &&
    session.currency === SUPPORT_PACK.currency &&
    session.metadata?.purchase === SUPPORT_PACK.metadataKey
  );
}
