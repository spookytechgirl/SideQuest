import OpenAI from "openai";
import {
  createGuideReply,
  validateChatMessages,
} from "@/lib/sidequest-guide";
import {
  checkAiRateLimit,
  createRateLimitResponse,
  createRateLimitUnavailableResponse,
} from "@/lib/rate-limit";
import { readJsonRequest } from "@/lib/request-validation";

export const runtime = "nodejs";

const MAX_CHAT_REQUEST_BYTES = 32_000;
const ALLOWED_BODY_FIELDS = new Set(["messages"]);

export async function POST(request) {
  let rateLimit;

  try {
    rateLimit = await checkAiRateLimit(request, "chat");
  } catch {
    return createRateLimitUnavailableResponse();
  }

  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit);
  }

  const parsed = await readJsonRequest(request, {
    maxBytes: MAX_CHAT_REQUEST_BYTES,
    invalidJsonMessage: "Send the conversation as valid JSON.",
    unsupportedMediaMessage: "Send the conversation as JSON.",
    tooLargeMessage: "The conversation request is too large.",
  });

  if (parsed.error) {
    return Response.json(
      { error: parsed.error.message },
      { status: parsed.error.status },
    );
  }

  const body = parsed.data;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return Response.json(
      { error: "Send the conversation as a JSON object." },
      { status: 400 },
    );
  }

  if (Object.keys(body).some((field) => !ALLOWED_BODY_FIELDS.has(field))) {
    return Response.json(
      { error: "The conversation request contains an unsupported field." },
      { status: 400 },
    );
  }

  const validation = validateChatMessages(body.messages);

  if (validation.error) {
    return Response.json({ error: validation.error }, { status: 400 });
  }

  try {
    const message = await createGuideReply(validation.messages);
    return Response.json({ message });
  } catch (error) {
    if (error?.code === "missing_api_key") {
      return Response.json(
        {
          error:
            "The SideQuest Guide is not configured yet. Add the server API key and try again.",
        },
        { status: 503 },
      );
    }

    if (error instanceof OpenAI.APIError && error.status === 429) {
      return Response.json(
        { error: "The guide is taking a quick breather. Please try again shortly." },
        { status: 429 },
      );
    }

    return Response.json(
      { error: "The guide could not answer right now. Please try again." },
      { status: 502 },
    );
  }
}
