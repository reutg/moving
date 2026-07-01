import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { DEFAULT_MOVE_STATUS, MOVE_STATUSES } from "@/constants";

import { users } from "./auth";

export const moves = sqliteTable("moves", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  address: text("address").notNull().default(""),
  moveDate: integer("move_date", { mode: "timestamp_ms" }),
  status: text("status", { enum: MOVE_STATUSES }).notNull().default(DEFAULT_MOVE_STATUS),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export type Move = typeof moves.$inferSelect & {
  boxesCount?: number;
};
export type NewMove = typeof moves.$inferInsert;
