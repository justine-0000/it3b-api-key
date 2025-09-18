import { sql } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

// Keep project prefix
export const createTable = pgTableCreator((name) => `it3b-api-key_${name}`);

export const apiKeys = createTable("api_keys", (d) => ({
  id: d.text("id").primaryKey(),

  // Artifact fields
  name: d.varchar("name", { length: 256 }).notNull(),
  period: d.varchar("period", { length: 100 }).notNull(),
  origin: d.varchar("origin", { length: 100 }).notNull(),
  value: d.integer("value").notNull(),
  imageUrl: d.text("image_url"),

  // API key fields
  hashedKey: d.text("hashed_key").notNull(),
  last4: d.varchar("last4", { length: 4 }).notNull(),
  createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  revoked: d.boolean("revoked").notNull().default(false),
}));
