import {
  createSupportPackCheckout,
  getCheckoutReturnOrigin,
} from "@/lib/stripe";

export const runtime = "nodejs";

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request) {
  const contentLength = Number(request.headers.get("content-length") || 0);

  if (!Number.isFinite(contentLength) || contentLength > 1024) {
    return jsonResponse({ error: "The checkout request is too large." }, 413);
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return jsonResponse({ error: "Send the checkout request as JSON." }, 415);
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Send a valid checkout request." }, 400);
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).length > 0
  ) {
    return jsonResponse(
      { error: "Product and price details are set securely by SideQuest." },
      400,
    );
  }

  try {
    const origin = getCheckoutReturnOrigin(request);
    const url = await createSupportPackCheckout(origin);
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
