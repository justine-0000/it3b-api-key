
export type Tier = "free" | "pro" | "premium" | "premium_plus";

export const TIER_LIMITS = {
  free: {
    keysPerDay: 10,
    rateLimit: { requests: 3, window: "10 s" as const },
  },
  pro: {
    keysPerDay: 50,
    rateLimit: { requests: 10, window: "10 s" as const },
  },
  premium: {
    keysPerDay: 200,
    rateLimit: { requests: 50, window: "10 s" as const },
  },
  premium_plus: {
    keysPerDay: 1000,
    rateLimit: { requests: 200, window: "10 s" as const },
  },
} as const;

export function getTierLimit(tier: Tier): number {
  return TIER_LIMITS[tier].keysPerDay;
}

export function getTierName(tier: Tier): string {
  const names: Record<Tier, string> = {
    free: "Free",
    pro: "Pro",
    premium: "Premium",
    premium_plus: "Premium+",
  };
  return names[tier];
}

export function getRateLimit(tier: Tier) {
  return TIER_LIMITS[tier].rateLimit;
}
