import { getAuthContext } from "@/lib/auth";
import {
  createSideQuestPlusCheckout,
  getCheckoutReturnOrigin,
} from "@/lib/stripe";
import { getSubscriptionState } from "@/lib/subscriptions";
import {
  isEmptyJsonObject,
  readJsonRequest,
} from "@/lib/request-validation";

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

  const parsed = await readJsonRequest(request, {
    maxBytes: 1024,
    invalidJsonMessage: "Send a valid subscription request.",
    unsupportedMediaMessage: "Send the subscription request as JSON.",
    tooLargeMessage: "The subscription request is too large.",
  });

  if (parsed.error) {
    return jsonResponse({ error: parsed.error.message }, parsed.error.status);
  }

  const body = parsed.data;

  if (!isEmptyJsonObject(body)) {
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
