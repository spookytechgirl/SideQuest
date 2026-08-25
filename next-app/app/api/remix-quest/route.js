import OpenAI from "openai";
import {
  createQuestRemix,
  validateQuestRemixInput,
} from "@/lib/quest-remix";

export const runtime = "nodejs";

function jsonResponse(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Send the remix request as valid JSON." }, 400);
  }

  const validation = validateQuestRemixInput(body);

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
