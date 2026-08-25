import "server-only";

import OpenAI from "openai";

export const SIDEQUEST_GUIDE_PROMPT = `You are the SideQuest Guide, a friendly and playful adventure companion inside the SideQuest app. Help users discover small, realistic activities they can do based on their mood, energy level, available time, and interests. Keep suggestions encouraging, specific, and low-pressure. Favor achievable small adventures over huge plans. Match the cozy, playful SideQuest tone and avoid overwhelming the user with too many options. Ask one brief follow-up question when essential details are missing; otherwise, offer one clear recommendation with an optional alternative.`;

export const CHAT_MODEL = "gpt-5.4-mini";
export const MAX_CHAT_MESSAGES = 24;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_CONVERSATION_LENGTH = 12000;

export function validateChatMessages(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return { error: "Add a message before asking the SideQuest Guide." };
  }

  if (value.length > MAX_CHAT_MESSAGES) {
    return {
      error: "This chat has reached its session limit. Refresh to start a new adventure.",
    };
  }

  const messages = [];
  let conversationLength = 0;

  for (const item of value) {
    if (
      !item ||
      (item.role !== "user" && item.role !== "assistant") ||
      typeof item.content !== "string"
    ) {
      return { error: "The conversation contains an invalid message." };
    }

    const content = item.content.trim();

    if (!content || content.length > MAX_MESSAGE_LENGTH) {
      return {
        error: `Each message must be between 1 and ${MAX_MESSAGE_LENGTH} characters.`,
      };
    }

    conversationLength += content.length;
    messages.push({ role: item.role, content });
  }

  if (conversationLength > MAX_CONVERSATION_LENGTH) {
    return {
      error: "This chat has reached its session limit. Refresh to start a new adventure.",
    };
  }

  if (messages.at(-1)?.role !== "user") {
    return { error: "The latest chat message must come from the user." };
  }

  return { messages };
}

export async function createGuideReply(messages) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const error = new Error("OPENAI_API_KEY is not configured.");
    error.code = "missing_api_key";
    throw error;
  }

  const openai = new OpenAI({ apiKey });
  const response = await openai.responses.create({
    model: CHAT_MODEL,
    instructions: SIDEQUEST_GUIDE_PROMPT,
    input: messages,
    max_output_tokens: 350,
    reasoning: { effort: "none" },
    store: false,
  });

  const reply = response.output_text?.trim();

  if (!reply) {
    throw new Error("The AI provider returned an empty response.");
  }

  return reply;
}
