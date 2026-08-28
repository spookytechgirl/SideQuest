import {
  checkFeedbackRateLimit,
  createFeedbackRateLimitResponse,
  createFeedbackRateLimitUnavailableResponse,
} from "@/lib/rate-limit";
import { getAuthContext } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  MAX_FEEDBACK_BODY_LENGTH,
  validateFeedback,
} from "@/lib/feedback-validation";

export const runtime = "nodejs";

const MAX_BODY_LENGTH = MAX_FEEDBACK_BODY_LENGTH;

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request) {
  let rateLimit;

  try {
    rateLimit = await checkFeedbackRateLimit(request);
  } catch {
    return createFeedbackRateLimitUnavailableResponse();
  }

  if (!rateLimit.success) {
    return createFeedbackRateLimitResponse(rateLimit);
  }

  const contentType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return jsonResponse({ error: "Send feedback as JSON." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);

  if (!Number.isFinite(contentLength) || contentLength > MAX_BODY_LENGTH) {
    return jsonResponse({ error: "The feedback request is too large." }, 413);
  }

  let rawBody;

  try {
    rawBody = await request.text();
  } catch {
    return jsonResponse({ error: "The feedback request could not be read." }, 400);
  }

  if (!rawBody || rawBody.length > MAX_BODY_LENGTH) {
    return jsonResponse(
      { error: rawBody ? "The feedback request is too large." : "Send feedback as valid JSON." },
      rawBody ? 413 : 400,
    );
  }

  let body;

  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "Send feedback as valid JSON." }, 400);
  }

  const validation = validateFeedback(body);

  if (validation.error) {
    return jsonResponse({ error: validation.error }, 400);
  }

  const { user } = await getAuthContext();

  try {
    const admin = getSupabaseAdminClient();
    const { error } = await admin.from("feedback").insert({
      ...validation.value,
      user_id: user?.id || null,
    });

    if (error) {
      console.error("[feedback] insert_failed");
      return jsonResponse(
        { error: "Feedback could not be saved right now. Please try again." },
        500,
      );
    }

    return jsonResponse({ message: "Thanks for the feedback!" }, 201);
  } catch (error) {
    if (error?.code === "missing_supabase_secret") {
      return jsonResponse(
        { error: "Feedback is not configured yet. Please try again later." },
        503,
      );
    }

    console.error("[feedback] unexpected_insert_failure");
    return jsonResponse(
      { error: "Feedback could not be saved right now. Please try again." },
      500,
    );
  }
}
