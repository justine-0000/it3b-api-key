import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { apiKeys } from "~/server/db/schema";
import { verifyKey } from "~/server/key";
import { ratelimiter } from "~/server/ratelimit";

type EchoRequestBody = {
  postBody: string;
};

//  GET /api/echo
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  const { success, remaining, limit, reset } = await ratelimiter.limit(apiKey);
  if (!success) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(
          Math.max(1, Math.ceil((+reset - Date.now()) / 1000))
        ),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(Math.max(0, remaining)),
      },
    });
  }

  return Response.json(
    {
      ok: true,
      message: "Hello GET",
      keyId: result.keyId,
    },
    {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(Math.max(0, remaining)),
      },
    }
  );
}

//  POST /api/echo
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
  }

  const { success, remaining, limit, reset } = await ratelimiter.limit(apiKey);
  if (!success) {
    return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(
          Math.max(1, Math.ceil((+reset - Date.now()) / 1000))
        ),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(Math.max(0, remaining)),
      },
    });
  }

  let body: EchoRequestBody;
  try {
    body = (await req.json()) as EchoRequestBody;
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const getName = await db
    .select({ id: apiKeys.id, name: apiKeys.name })
    .from(apiKeys)
    .where(eq(apiKeys.name, body.postBody));

  if (!getName.length) {
    return Response.json(
      { error: "No matching API key name found" },
      {
        status: 401,
        headers: {
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(Math.max(0, remaining)),
        },
      }
    );
  }

  return Response.json(
    {
      ok: true,
      message: "Hello POST",
      received: getName,
      keyId: result.keyId,
    },
    {
      status: 200,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(Math.max(0, remaining)),
      },
    }
  );
}


export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://it3b-api-key-act6.vercel.app/",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key, Authorization",
      "Access-Control-Max-Age": "600",
    },
  });
}
