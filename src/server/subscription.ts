
import { db } from "./db";
import { subscriptions } from "./db/schema";
import { eq, sql as drizzleSql } from "drizzle-orm";
import { randomUUID } from "crypto";
import { getTierLimit, getTierName, type Tier } from "./pricing";

// Get today's date in YYYY-MM-DD format (UTC)
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0]!;
}

// Get or create subscription for user
export async function getOrCreateSubscription(userId: string) {
  const today = getTodayDate();

  // Try to find existing subscription
  const existing = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    const sub = existing[0]!;

    // Check if we need to reset daily counter
    if (sub.lastResetDate !== today) {
      // Reset counter for new day
      const updated = await db
        .update(subscriptions)
        .set({
          keysCreatedToday: 0,
          lastResetDate: today,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.userId, userId))
        .returning();

      return updated[0]!;
    }

    return sub;
  }

  // Create new subscription with free tier
  const newSub = await db
    .insert(subscriptions)
    .values({
      id: randomUUID(),
      userId,
      tier: "free",
      keysCreatedToday: 0,
      lastResetDate: today,
    })
    .returning();

  return newSub[0]!;
}

// Check if user can create a key
export async function canCreateKey(userId: string): Promise<{
  allowed: boolean;
  reason?: string;
  current: number;
  limit: number;
  tier: Tier;
}> {
  const sub = await getOrCreateSubscription(userId);
  const limit = getTierLimit(sub.tier as Tier);

  if (sub.keysCreatedToday >= limit) {
    return {
      allowed: false,
      reason: `Daily limit reached (${limit} keys per day for ${getTierName(sub.tier as Tier)} tier)`,
      current: sub.keysCreatedToday,
      limit,
      tier: sub.tier as Tier,
    };
  }

  return {
    allowed: true,
    current: sub.keysCreatedToday,
    limit,
    tier: sub.tier as Tier,
  };
}

// Increment key creation counter
export async function incrementKeyCounter(userId: string): Promise<void> {
  const today = getTodayDate();
  
  await db
    .update(subscriptions)
    .set({
      keysCreatedToday: drizzleSql`${subscriptions.keysCreatedToday} + 1`,
      lastResetDate: today,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId));
}

// Update user's tier
export async function updateSubscriptionTier(userId: string, tier: Tier): Promise<void> {
  await getOrCreateSubscription(userId); // Ensure subscription exists

  await db
    .update(subscriptions)
    .set({
      tier,
      updatedAt: new Date(),
    })
    .where(eq(subscriptions.userId, userId));
}

// Get subscription info
export async function getSubscriptionInfo(userId: string) {
  const sub = await getOrCreateSubscription(userId);
  const limit = getTierLimit(sub.tier as Tier);
  const remaining = Math.max(0, limit - sub.keysCreatedToday);

  return {
    tier: sub.tier as Tier,
    tierName: getTierName(sub.tier as Tier),
    keysCreatedToday: sub.keysCreatedToday,
    limit,
    remaining,
  };
}