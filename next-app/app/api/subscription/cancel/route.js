import { getAuthContext } from "@/lib/auth";
import {
  cancelSideQuestPlusSubscription,
} from "@/lib/stripe";
import {
  getSubscriptionState,
  saveSubscriptionRecord,
} from "@/lib/subscriptions";
import { readJsonRequest } from "@/lib/request-validation";

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
    return jsonResponse({ error: "Sign in to manage SideQuest Plus." }, 401);
  }

  const parsed = await readJsonRequest(request, {
    maxBytes: 1024,
    invalidJsonMessage: "Send a valid cancellation request.",
    unsupportedMediaMessage: "Send the cancellation request as JSON.",
    tooLargeMessage: "The cancellation request is too large.",
  });

  if (parsed.error) {
    return jsonResponse({ error: parsed.error.message }, parsed.error.status);
  }

  const body = parsed.data;

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).length > 0
  ) {
    return jsonResponse(
      { error: "SideQuest securely selects the subscription to cancel." },
      400,
    );
  }

  const state = await getSubscriptionState(supabase, user.id);

  if (state.error) {
    return jsonResponse(
      { error: "Subscription status could not be checked right now." },
      503,
    );
  }

  if (!state.record || !state.isActive) {
    return jsonResponse(
      { error: "No active SideQuest Plus subscription was found." },
      404,
    );
  }

  try {
    const subscription = await cancelSideQuestPlusSubscription(
      state.record.stripe_subscription_id,
      user.id,
    );

    if (!subscription) {
      return jsonResponse(
        { error: "This subscription could not be verified for your account." },
        403,
      );
    }

    await saveSubscriptionRecord({
      userId: user.id,
      checkoutSessionId: state.record.stripe_checkout_session_id,
      subscription,
    });

    return jsonResponse({
      message:
        "SideQuest Plus will cancel at the end of the current billing period.",
    });
  } catch (error) {
    if (error?.code === "missing_stripe_key") {
      return jsonResponse(
        { error: "Test subscription management is not configured yet." },
        503,
      );
    }

    if (error?.code === "stripe_test_mode_required") {
      return jsonResponse(
        { error: "Subscriptions are managed in Stripe test mode only." },
        503,
      );
    }

    return jsonResponse(
      { error: "SideQuest Plus could not be cancelled right now." },
      502,
    );
  }
}
