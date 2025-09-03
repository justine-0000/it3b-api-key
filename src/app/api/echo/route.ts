import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { db } from "~/server/db";
import { apiKeys } from "~/server/db/schema";
import { verifyKey } from "~/server/key";

type EchoRequestBody = {
  postBody: string;
};

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key") ?? "";
  const result = await verifyKey(apiKey);

  if (!result.valid) {
    return Response.json({ error: result.reason }, { status: 401 });
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

  return Response.json(
    {
      ok: true,
      message: "Hello POST",
      received: getName,
      keyId: result.keyId,
    },
    { status: 200 }
  );
}
