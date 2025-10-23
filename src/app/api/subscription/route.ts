
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getSubscriptionInfo, updateSubscriptionTier } from "~/server/subscription";

const UpdateTierSchema = z.object({
  tier: z.enum(["free", "pro", "premium", "premium_plus"]),
});

// GET: Fetch user's subscription info
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const info = await getSubscriptionInfo(userId);
    return NextResponse.json(info);
  } catch (error) {
    console.error("GET /api/subscription failed:", error);
    return NextResponse.json({ error: "Failed to fetch subscription" }, { status: 500 });
  }
}

// POST: Update user's subscription tier
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { tier } = UpdateTierSchema.parse(body);

    await updateSubscriptionTier(userId, tier);
    const info = await getSubscriptionInfo(userId);

    return NextResponse.json(info);
  } catch (error) {
    console.error("POST /api/subscription failed:", error);
    const errorMessage = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
