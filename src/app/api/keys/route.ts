import { NextResponse } from "next/server";
import { insertKey, listKeys, revokeKey } from "~/server/key";
import { CreateKeySchema, DeleteKeySchema } from "~/server/validation";

// --------------------
// GET: List all keys or fetch single key
// --------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("keyId");

    const rows = await listKeys();

    if (keyId) {
      const row = rows.find((r) => r.id === keyId);
      if (!row) return NextResponse.json({ error: "Key not found" }, { status: 404 });

      return NextResponse.json({
        id: row.id,
        name: row.name,
        period: row.period,
        origin: row.origin,
        value: row.value,
        imageUrl: row.imageUrl,
        masked: `sk_live_...${row.last4}`,
        createdAt: row.createdAt,
        revoked: !!row.revoked,
      });
    }

    // No keyId → return all
    const items = rows.map((row) => ({
      id: row.id,
      name: row.name,
      period: row.period,
      origin: row.origin,
      value: row.value,
      imageUrl: row.imageUrl,
      masked: `sk_live_...${row.last4}`,
      createdAt: row.createdAt,
      revoked: !!row.revoked,
    }));

    return NextResponse.json({ items });
  } catch (err: any) {
    console.error("GET /api/keys failed:", err);
    return NextResponse.json({ error: "Failed to fetch keys" }, { status: 500 });
  }
}

// --------------------
// POST: Create a new artifact + key
// --------------------
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, period, origin, value, imageUrl } = CreateKeySchema.parse(body);

    const created = await insertKey({ name, period, origin, value, imageUrl });

    return NextResponse.json(created, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/keys failed:", err);
    return NextResponse.json({ error: err.message ?? "Invalid request" }, { status: 400 });
  }
}

// --------------------
// DELETE: Revoke a key
// --------------------
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyId = searchParams.get("keyId");
    const { keyId: parsedId } = DeleteKeySchema.parse({ keyId });

    const ok = await revokeKey(parsedId);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/keys failed:", err);
    return NextResponse.json({ error: err.message ?? "Invalid request" }, { status: 400 });
  }
}
