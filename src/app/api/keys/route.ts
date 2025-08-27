import type { NextRequest } from "next/server";
import { insertKey, listKeys, revokeKey } from "~/server/key";
import { CreateKeySchema, DeleteKeySchema } from "~/server/validation";
import { NextResponse } from "next/server";

// Define KeyRow type
type KeyRow = {
  id: string;
  name: string;
  last4: string;
  createdAt: string;
  revoked: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { name: string };
    const { name } = CreateKeySchema.parse(body);
    const created = await insertKey(name);
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function GET() {
  const result = await listKeys();
  
  // Map safely to KeyRow[]
  const rows: KeyRow[] = Array.isArray(result)
    ? result.map((r) => ({
        id: String(r.id),
        name: String(r.name),
        last4: String(r.last4),
        createdAt: String(r.createdAt),
        revoked: Boolean(r.revoked),
      }))
    : [];

  const items = rows.map((row) => ({
    id: row.id,
    name: row.name,
    masked: `sk_live_...${row.last4}`,
    createdAt: row.createdAt,
    revoked: row.revoked,
  }));

  return NextResponse.json({ items });
}

export async function DELETE(req: NextRequest) {
  try {
    const keyId = new URL(req.url).searchParams.get("keyId") ?? "";
    const { keyId: parsedId } = DeleteKeySchema.parse({ keyId });
    const ok = await revokeKey(parsedId);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Invalid request";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
