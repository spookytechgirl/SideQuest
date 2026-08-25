import { getAuthContext } from "@/lib/auth";
import {
  createSideQuestPlusCheckout,
  getCheckoutReturnOrigin,
} from "@/lib/stripe";
import { getSubscriptionState } from "@/lib/subscriptions";

export const runtime = "nodejs";

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request) {
  const { supabase, user } = await getAuthContext();

  if (!user) {
    return jsonResponse({ error: "Sign in before subscribing." }, 401);
  }

  const subscriptionState = await getSubscriptionState(supabase, user.id);

  if (subscriptionState.error) {
    return jsonResponse(
      { error: "Subscription status could not be checked right now." },
      503,
    );
  }

  if (subscriptionState.isActive) {
    return jsonResponse(
      { error: "SideQuest Plus is already active for this account." },
      409,
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);

  if (!Number.isFinite(contentLength) || contentLength > 1024) {
    return jsonResponse({ error: "The subscription request is too large." }, 413);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ error: "Send the subscription request as JSON." }, 415);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Send a valid subscription request." }, 400);
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).length > 0
  ) {
    return jsonResponse(
      { error: "Subscription product and price are set securely by SideQuest." },
      400,
    );
  }

  try {
    const origin = getCheckoutReturnOrigin(request);
    const url = await createSideQuestPlusCheckout(origin, user.id);
    return jsonResponse({ url });
  } catch (error) {
    if (error?.code === "missing_stripe_key") {
      return jsonResponse(
        { error: "Test subscription checkout is not configured yet." },
        503,
      );
    }

    if (error?.code === "stripe_test_mode_required") {
      return jsonResponse(
        { error: "Subscriptions are available in Stripe test mode only." },
        503,
      );
    }

    return jsonResponse(
      { error: "Stripe subscription Checkout could not start. Try again." },
      502,
    );
  }
}
