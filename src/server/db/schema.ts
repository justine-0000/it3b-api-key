
import { sql } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

// Keep project prefix
export const createTable = pgTableCreator((name) => `it3b-api-key_${name}`);

export const apiKeys = createTable("api_keys", (d) => ({
  id: d.text("id").primaryKey(),
  name: d.varchar("name", { length: 256 }).notNull(),
  period: d.varchar("period", { length: 100 }).notNull(),
  origin: d.varchar("origin", { length: 100 }).notNull(),
  value: d.integer("value").notNull(),
  imageUrl: d.text("image_url"),
  hashedKey: d.text("hashed_key").notNull(),
  last4: d.varchar("last4", { length: 4 }).notNull(),
  createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  revoked: d.boolean("revoked").notNull().default(false),
}));

// NEW: Add subscriptions table
export const subscriptions = createTable("subscriptions", (d) => ({
  id: d.text("id").primaryKey(),
  userId: d.text("user_id").notNull().unique(),
  tier: d.text("tier").notNull().default("free"),
  keysCreatedToday: d.integer("keys_created_today").notNull().default(0),
  lastResetDate: d.text("last_reset_date").notNull(),
  createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
}));
