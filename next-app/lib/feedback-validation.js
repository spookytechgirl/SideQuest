import "server-only";

export const MAX_FEEDBACK_BODY_LENGTH = 8_000;
export const MAX_FEEDBACK_MESSAGE_LENGTH = 1_000;
export const MAX_FEEDBACK_PAGE_PATH_LENGTH = 300;

const ALLOWED_FEEDBACK_TYPES = new Set(["bug", "idea", "like", "other"]);
const ALLOWED_BODY_KEYS = new Set([
  "feedbackType",
  "rating",
  "message",
  "pagePath",
]);

export function normalizeFeedbackPagePath(value) {
  if (value === undefined || value === null || value === "") {
    return { value: null };
  }

  if (
    typeof value !== "string" ||
    value.length > MAX_FEEDBACK_PAGE_PATH_LENGTH ||
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

export function validateFeedback(body) {
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

  if (message.length > MAX_FEEDBACK_MESSAGE_LENGTH) {
    return {
      error: `Keep feedback to ${MAX_FEEDBACK_MESSAGE_LENGTH.toLocaleString()} characters or fewer.`,
    };
  }

  let rating = null;

  if (body.rating !== undefined && body.rating !== null && body.rating !== "") {
    if (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5) {
      return { error: "Choose a rating from 1 to 5, or leave it blank." };
    }

    rating = body.rating;
  }

  const pagePath = normalizeFeedbackPagePath(body.pagePath);

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
