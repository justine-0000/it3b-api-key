import type { NextRequest } from "next/server";
import { insertKey, listKeys, revokeKey } from "~/server/key";
import { CreateKeySchema, DeleteKeySchema } from "~/server/validation";
import { NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); // keep as unknown
    const parsed = CreateKeySchema.safeParse(body);
    if (!parsed.success) throw new Error("Invalid request body");
    const { name } = parsed.data;

    const created = await insertKey(name);
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function GET() {
  const rows = await listKeys();
  const items = rows.map((row) => ({
    id: String(row.id),
    name: String(row.name),
    masked: `sk_live_...${String(row.last4)}`,
    createdAt: String(row.createdAt),
    revoked: !!row.revoked,
  }));
  return NextResponse.json({ items });
}

export async function DELETE(req: NextRequest) {
  try {
    const keyId = new URL(req.url).searchParams.get("keyId") ?? "";
    const parsed = DeleteKeySchema.safeParse({ keyId });
    if (!parsed.success) throw new Error("Invalid keyId");
    const ok = await revokeKey(parsed.data.keyId);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
