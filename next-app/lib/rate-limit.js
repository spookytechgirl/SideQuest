import "server-only";

import { isIP } from "node:net";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const AI_RATE_LIMIT = 10;
export const AI_RATE_LIMIT_WINDOW = "60 s";
export const FEEDBACK_RATE_LIMIT = 5;
export const FEEDBACK_RATE_LIMIT_WINDOW = "600 s";
export const RATE_LIMIT_ERROR_MESSAGE =
  "Too many requests. Please wait a moment and try again.";
export const FEEDBACK_RATE_LIMIT_ERROR_MESSAGE =
  "You’ve shared several notes recently. Please wait a few minutes and try again.";

export const UPSTASH_ENV_NAMES = {
  url: "UPSTASH_REDIS_REST_KV_REST_API_URL",
  token: "UPSTASH_REDIS_REST_KV_REST_API_TOKEN",
};

const rateLimitScopes = {
  chat: {
    limit: AI_RATE_LIMIT,
    window: AI_RATE_LIMIT_WINDOW,
    prefix: "sidequest:ai:chat",
  },
  remix: {
    limit: AI_RATE_LIMIT,
    window: AI_RATE_LIMIT_WINDOW,
    prefix: "sidequest:ai:remix",
  },
  feedback: {
    limit: FEEDBACK_RATE_LIMIT,
    window: FEEDBACK_RATE_LIMIT_WINDOW,
    prefix: "sidequest:feedback",
  },
};
let redis;
const limiters = new Map();

function createConfigurationError(scope = "AI") {
  const error = new Error(`${scope} rate limiting is not configured.`);
  error.code = "rate_limit_unavailable";
  return error;
}

function getRedis() {
  if (redis) {
    return redis;
  }

  const url = process.env[UPSTASH_ENV_NAMES.url];
  const token = process.env[UPSTASH_ENV_NAMES.token];

  if (!url || !token) {
    throw createConfigurationError();
  }

  redis = new Redis({ url, token });
  return redis;
}

function getRateLimiter(scope) {
  const config = rateLimitScopes[scope];

  if (!config) {
    throw new Error("Unsupported rate-limit scope.");
  }

  if (!limiters.has(scope)) {
    limiters.set(
      scope,
      new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(config.limit, config.window),
        prefix: config.prefix,
        analytics: false,
        timeout: 2000,
      }),
    );
  }

  return limiters.get(scope);
}

export function getClientIdentifier(headers) {
  const forwardedFor = headers.get("x-forwarded-for");

  if (forwardedFor) {
    for (const entry of forwardedFor.split(",")) {
      const candidate = entry.trim();

      if (isIP(candidate)) {
        return candidate.toLowerCase();
      }
    }
  }

  return "unknown";
}

export async function checkAiRateLimit(request, scope) {
  if (scope !== "chat" && scope !== "remix") {
    throw new Error("Unsupported AI rate-limit scope.");
  }

  return checkRateLimit(request, scope, "AI");
}

export async function checkFeedbackRateLimit(request) {
  return checkRateLimit(request, "feedback", "Feedback");
}

async function checkRateLimit(request, scope, featureName) {
  let result;

  try {
    result = await getRateLimiter(scope).limit(
      getClientIdentifier(request.headers),
    );
  } catch {
    throw createConfigurationError(featureName);
  }

  if (result.reason === "timeout") {
    throw createConfigurationError(featureName);
  }

  return result;
}

function getRetryAfter(result) {
  return Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
}

export function createRateLimitResponse(result) {
  const retryAfter = getRetryAfter(result);

  return Response.json(
    { error: RATE_LIMIT_ERROR_MESSAGE },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
      },
    },
  );
}

export function createFeedbackRateLimitResponse(result) {
  return Response.json(
    { error: FEEDBACK_RATE_LIMIT_ERROR_MESSAGE },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(getRetryAfter(result)),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(result.reset / 1000)),
      },
    },
  );
}

export function createRateLimitUnavailableResponse() {
  return Response.json(
    {
      error:
        "The AI features are temporarily unavailable. Please try again shortly.",
    },
    {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export function createFeedbackRateLimitUnavailableResponse() {
  return Response.json(
    {
      error:
        "Feedback is temporarily unavailable. Please keep your note and try again shortly.",
    },
    {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}
