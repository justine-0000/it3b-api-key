import { createHash, randomBytes, randomUUID } from "crypto";
import { db } from "./db";              
import { apiKeys } from "./db/schema"; 
import { desc, eq } from "drizzle-orm";

const KEY_PREFIX = process.env.KEY_PREFIX ?? "sk_live_";

export function generatePlainKey(bytes = 24) {
  const raw = randomBytes(bytes).toString("base64url");
  const key = `${KEY_PREFIX}${raw}`;
  const last4 = key.slice(-4);
  return { key, last4 };
}

export function sha256(data: string) {
  return createHash("sha256").update(data).digest("hex");
}

export async function insertKey(name: string) {
  const { key, last4 } = generatePlainKey();
  const hashed = sha256(key);
  const id = randomUUID();

  await db.insert(apiKeys).values({ id, name, hashedKey: hashed, last4 }); 
  return { id, name, key, last4 } as const;
}

export async function listKeys() {
  return db.select().from(apiKeys).orderBy(desc(apiKeys.createdAt));
}

export async function revokeKey(id: string) {
  const res = await db
    .update(apiKeys)
    .set({ revoked: true })
    .where(eq(apiKeys.id, id));
  return (res.rowCount ?? 0) > 0;
}
