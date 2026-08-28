import {
  createSupportPackCheckout,
  getCheckoutReturnOrigin,
} from "@/lib/stripe";
import { getAuthContext } from "@/lib/auth";
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
  const { user } = await getAuthContext();

  if (!user) {
    return jsonResponse(
      { error: "Sign in before unlocking AI Quest Remix." },
      401,
    );
  }

  const parsed = await readJsonRequest(request, {
    maxBytes: 1024,
    invalidJsonMessage: "Send a valid checkout request.",
    unsupportedMediaMessage: "Send the checkout request as JSON.",
    tooLargeMessage: "The checkout request is too large.",
  });

  if (parsed.error) {
    return jsonResponse({ error: parsed.error.message }, parsed.error.status);
  }

  const body = parsed.data;

  if (!isEmptyJsonObject(body)) {
    return jsonResponse(
      { error: "Product and price details are set securely by SideQuest." },
      400,
    );
  }

  try {
    const origin = getCheckoutReturnOrigin(request);
    const url = await createSupportPackCheckout(origin, user.id);
    return jsonResponse({ url });
  } catch (error) {
    if (error?.code === "missing_stripe_key") {
      return jsonResponse(
        { error: "Test checkout is not configured yet. Please try again later." },
        503,
      );
    }

    if (error?.code === "stripe_test_mode_required") {
      return jsonResponse(
        { error: "Checkout is available in Stripe test mode only." },
        503,
      );
    }

    return jsonResponse(
      { error: "Stripe Checkout could not start. Please try again." },
      502,
    );
  }
}
