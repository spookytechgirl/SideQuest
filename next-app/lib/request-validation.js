import "server-only";

const DEFAULT_MAX_JSON_BYTES = 16_384;

function createError(status, message) {
  return { error: { status, message } };
}

export function isEmptyJsonObject(value) {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  );
}

export async function readJsonRequest(
  request,
  {
    maxBytes = DEFAULT_MAX_JSON_BYTES,
    invalidJsonMessage = "Send the request as valid JSON.",
    unsupportedMediaMessage = "Send the request as JSON.",
    tooLargeMessage = "The request is too large.",
  } = {},
) {
  const contentType = request.headers
    .get("content-type")
    ?.split(";", 1)[0]
    .trim()
    .toLowerCase();

  if (contentType !== "application/json") {
    return createError(415, unsupportedMediaMessage);
  }

  const contentLengthHeader = request.headers.get("content-length");

  if (contentLengthHeader !== null) {
    const normalizedLength = contentLengthHeader.trim();

    if (!/^\d+$/.test(normalizedLength)) {
      return createError(400, invalidJsonMessage);
    }

    if (Number(normalizedLength) > maxBytes) {
      return createError(413, tooLargeMessage);
    }
  }

  let rawBody;

  try {
    rawBody = await request.text();
  } catch {
    return createError(400, invalidJsonMessage);
  }

  if (!rawBody.trim()) {
    return createError(400, invalidJsonMessage);
  }

  if (new TextEncoder().encode(rawBody).byteLength > maxBytes) {
    return createError(413, tooLargeMessage);
  }

  try {
    return { data: JSON.parse(rawBody) };
  } catch {
    return createError(400, invalidJsonMessage);
  }
}
