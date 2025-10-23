
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { TIER_LIMITS, type Tier } from "./pricing";

export function keyFromCtx({ apiKeyId, ip }: { apiKeyId: string; ip: string }) {
  if (apiKeyId) return `key:${apiKeyId}`;
  return `ip:${ip ?? "unknown"}`;
}

// Create tier-specific rate limiters
export const rateLimiters = {
  free: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(
      TIER_LIMITS.free.rateLimit.requests,
      TIER_LIMITS.free.rateLimit.window
    ),
    analytics: true,
    prefix: "@upstash/ratelimit/free",
  }),
  pro: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(
      TIER_LIMITS.pro.rateLimit.requests,
      TIER_LIMITS.pro.rateLimit.window
    ),
    analytics: true,
    prefix: "@upstash/ratelimit/pro",
  }),
  premium: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(
      TIER_LIMITS.premium.rateLimit.requests,
      TIER_LIMITS.premium.rateLimit.window
    ),
    analytics: true,
    prefix: "@upstash/ratelimit/premium",
  }),
  premium_plus: new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(
      TIER_LIMITS.premium_plus.rateLimit.requests,
      TIER_LIMITS.premium_plus.rateLimit.window
    ),
    analytics: true,
    prefix: "@upstash/ratelimit/premium_plus",
  }),
};

export function getRateLimiter(tier: Tier) {
  return rateLimiters[tier];
}

// Keep the old ratelimiter for backwards compatibility
export const ratelimiter = rateLimiters.free;