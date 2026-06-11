import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import {
  BOX_PRIORITIES,
  BOX_STATUSES,
  DEFAULT_BOX_PRIORITY,
  DEFAULT_BOX_STATUS,
} from "@/constants";

export const boxes = sqliteTable("boxes", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  // Empty `name` on insert is rewritten to `Box #<id>` by the
  // `boxes_set_default_name` trigger (see drizzle/0001_box_name_default.sql).
  name: text("name").notNull().default(""),
  description: text("description").notNull().default(""),

  sourceRoom: text("source_room"),
  destinationRoom: text("destination_room").notNull(),

  status: text("status", { enum: BOX_STATUSES }).notNull().default(DEFAULT_BOX_STATUS),

  priority: text("priority", { enum: BOX_PRIORITIES }).notNull().default(DEFAULT_BOX_PRIORITY),

  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
});

export type Box = typeof boxes.$inferSelect;
export type NewBox = typeof boxes.$inferInsert;
