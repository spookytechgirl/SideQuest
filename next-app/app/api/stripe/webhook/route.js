import { getStripeClient } from "@/lib/stripe";
import { processStripeWebhookEvent } from "@/lib/stripe-webhooks";

export const runtime = "nodejs";

const MAX_WEBHOOK_BYTES = 1024 * 1024;

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function getWebhookSecret() {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

  if (!secret || !secret.startsWith("whsec_")) {
    const error = new Error("Stripe webhook verification is not configured.");
    error.code = "missing_webhook_secret";
    throw error;
  }

  return secret;
}

export async function POST(request) {
  const signature = request.headers.get("stripe-signature")?.trim();

  if (!signature || signature.length > 4096) {
    return jsonResponse({ error: "A valid Stripe signature is required." }, 400);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);

  if (!Number.isFinite(contentLength) || contentLength > MAX_WEBHOOK_BYTES) {
    return jsonResponse({ error: "The webhook payload is too large." }, 413);
  }

  let payload;

  try {
    payload = await request.text();
  } catch {
    return jsonResponse({ error: "The webhook payload could not be read." }, 400);
  }

  if (!payload) {
    return jsonResponse({ error: "A webhook payload is required." }, 400);
  }

  if (new TextEncoder().encode(payload).byteLength > MAX_WEBHOOK_BYTES) {
    return jsonResponse({ error: "The webhook payload is too large." }, 413);
  }

  let event;

  try {
    event = getStripeClient().webhooks.constructEvent(
      payload,
      signature,
      getWebhookSecret(),
    );
  } catch (error) {
    if (
      error?.code === "missing_webhook_secret" ||
      error?.code === "missing_stripe_key" ||
      error?.code === "stripe_test_mode_required"
    ) {
      return jsonResponse(
        { error: "Stripe webhook verification is not configured." },
        503,
      );
    }

    return jsonResponse({ error: "The Stripe signature is invalid." }, 400);
  }

  if (event.livemode !== false) {
    return jsonResponse({ error: "Live Stripe events are not accepted." }, 400);
  }

  try {
    const result = await processStripeWebhookEvent(event);
    return jsonResponse({ received: true, ...result });
  } catch {
    return jsonResponse(
      { error: "The verified Stripe event could not be processed." },
      500,
    );
  }
}
