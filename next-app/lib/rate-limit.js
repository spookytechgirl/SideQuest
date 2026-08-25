import "server-only";

import { isIP } from "node:net";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const AI_RATE_LIMIT = 10;
export const AI_RATE_LIMIT_WINDOW = "60 s";
export const RATE_LIMIT_ERROR_MESSAGE =
  "Too many requests. Please wait a moment and try again.";

export const UPSTASH_ENV_NAMES = {
  url: "UPSTASH_REDIS_REST_KV_REST_API_URL",
  token: "UPSTASH_REDIS_REST_KV_REST_API_TOKEN",
};

const validScopes = new Set(["chat", "remix"]);
let redis;
const limiters = new Map();

function createConfigurationError() {
  const error = new Error("The AI rate limiter is not configured.");
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
  if (!validScopes.has(scope)) {
    throw new Error("Unsupported AI rate-limit scope.");
  }

  if (!limiters.has(scope)) {
    limiters.set(
      scope,
      new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(AI_RATE_LIMIT, AI_RATE_LIMIT_WINDOW),
        prefix: `sidequest:ai:${scope}`,
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
  let result;

  try {
    result = await getRateLimiter(scope).limit(
      getClientIdentifier(request.headers),
    );
  } catch {
    throw createConfigurationError();
  }

  if (result.reason === "timeout") {
    throw createConfigurationError();
  }

  return result;
}

export function createRateLimitResponse(result) {
  const retryAfter = Math.max(
    1,
    Math.ceil((result.reset - Date.now()) / 1000),
  );

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
