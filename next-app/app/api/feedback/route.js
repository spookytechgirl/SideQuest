import {
  checkFeedbackRateLimit,
  createFeedbackRateLimitResponse,
  createFeedbackRateLimitUnavailableResponse,
} from "@/lib/rate-limit";
import { getAuthContext } from "@/lib/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const MAX_BODY_LENGTH = 8_000;
const MAX_MESSAGE_LENGTH = 1_000;
const MAX_PAGE_PATH_LENGTH = 300;
const ALLOWED_FEEDBACK_TYPES = new Set(["bug", "idea", "like", "other"]);
const ALLOWED_BODY_KEYS = new Set([
  "feedbackType",
  "rating",
  "message",
  "pagePath",
]);

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function normalizePagePath(value) {
  if (value === undefined || value === null || value === "") {
    return { value: null };
  }

  if (
    typeof value !== "string" ||
    value.length > MAX_PAGE_PATH_LENGTH ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\") ||
    value.includes("?") ||
    value.includes("#") ||
    /[\u0000-\u001f\u007f\s]/.test(value)
  ) {
    return { error: "The feedback page path is not valid." };
  }

  try {
    const parsed = new URL(value, "https://sidequest.invalid");

    if (parsed.origin !== "https://sidequest.invalid" || parsed.pathname !== value) {
      return { error: "The feedback page path is not valid." };
    }
  } catch {
    return { error: "The feedback page path is not valid." };
  }

  return { value };
}

function validateFeedback(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "Send feedback as a JSON object." };
  }

  const bodyKeys = Object.keys(body);

  if (bodyKeys.some((key) => !ALLOWED_BODY_KEYS.has(key))) {
    return { error: "The feedback request contains an unsupported field." };
  }

  if (!ALLOWED_FEEDBACK_TYPES.has(body.feedbackType)) {
    return { error: "Choose a valid feedback type." };
  }

  if (typeof body.message !== "string") {
    return { error: "Please share a feedback message." };
  }

  const message = body.message.trim();

  if (!message) {
    return { error: "Please share a feedback message." };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      error: `Keep feedback to ${MAX_MESSAGE_LENGTH.toLocaleString()} characters or fewer.`,
    };
  }

  let rating = null;

  if (body.rating !== undefined && body.rating !== null && body.rating !== "") {
    if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
      return { error: "Choose a rating from 1 to 5, or leave it blank." };
    }

    rating = body.rating;
  }

  const pagePath = normalizePagePath(body.pagePath);

  if (pagePath.error) {
    return { error: pagePath.error };
  }

  return {
    value: {
      feedback_type: body.feedbackType,
      rating,
      message,
      page_path: pagePath.value,
    },
  };
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
