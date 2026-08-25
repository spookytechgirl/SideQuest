import OpenAI from "openai";
import {
  createGuideReply,
  validateChatMessages,
} from "@/lib/sidequest-guide";

export const runtime = "nodejs";

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Send the conversation as valid JSON." },
      { status: 400 },
    );
  }

  const validation = validateChatMessages(body?.messages);

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
