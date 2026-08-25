import { getAuthContext } from "@/lib/auth";
import {
  cancelSideQuestPlusSubscription,
} from "@/lib/stripe";
import {
  getSubscriptionState,
  saveSubscriptionRecord,
} from "@/lib/subscriptions";

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

  const contentLength = Number(request.headers.get("content-length") || 0);

  if (!Number.isFinite(contentLength) || contentLength > 1024) {
    return jsonResponse({ error: "The cancellation request is too large." }, 413);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ error: "Send the cancellation request as JSON." }, 415);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Send a valid cancellation request." }, 400);
  }

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
