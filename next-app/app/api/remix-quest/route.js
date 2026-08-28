import OpenAI from "openai";
import { getAuthContext } from "@/lib/auth";
import { getEntitlementState } from "@/lib/entitlements";
import {
  createQuestRemix,
  validateQuestRemixInput,
} from "@/lib/quest-remix";
import {
  checkAiRateLimit,
  createRateLimitResponse,
  createRateLimitUnavailableResponse,
} from "@/lib/rate-limit";
import { readJsonRequest } from "@/lib/request-validation";

export const runtime = "nodejs";

const MAX_REMIX_REQUEST_BYTES = 2_000;

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request) {
  const { supabase, user } = await getAuthContext();

  if (!user) {
    return jsonResponse(
      { error: "Sign in and unlock AI Quest Remix before using it." },
      401,
    );
  }

  const entitlement = await getEntitlementState(supabase, user.id);

  if (entitlement.error) {
    return jsonResponse(
      { error: "AI Quest Remix access could not be checked right now." },
      503,
    );
  }

  if (!entitlement.isEntitled) {
    return jsonResponse(
      {
        error:
          "AI Quest Remix is part of the SideQuest Support Pack. Unlock it to continue.",
      },
      403,
    );
  }

  let rateLimit;

  try {
    rateLimit = await checkAiRateLimit(request, "remix");
  } catch {
    return createRateLimitUnavailableResponse();
  }

  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit);
  }

  const parsed = await readJsonRequest(request, {
    maxBytes: MAX_REMIX_REQUEST_BYTES,
    invalidJsonMessage: "Send the remix request as valid JSON.",
    unsupportedMediaMessage: "Send the remix request as JSON.",
    tooLargeMessage: "The remix request is too large.",
  });

  if (parsed.error) {
    return jsonResponse({ error: parsed.error.message }, parsed.error.status);
  }

  const validation = validateQuestRemixInput(parsed.data);

  if (validation.error) {
    return jsonResponse({ error: validation.error }, 400);
  }

  try {
    const quest = await createQuestRemix(validation);
    return jsonResponse({ quest });
  } catch (error) {
    if (error?.code === "missing_api_key") {
      return jsonResponse(
        {
          error:
            "AI Quest Remix is not configured yet. Add the server API key and try again.",
        },
        503,
      );
    }

    if (error instanceof OpenAI.APIError && error.status === 429) {
      return jsonResponse(
        { error: "The remix studio is taking a quick breather. Try again shortly." },
        429,
      );
    }

    return jsonResponse(
      { error: "This quest could not be remixed right now. Please try again." },
      502,
    );
  }
}
