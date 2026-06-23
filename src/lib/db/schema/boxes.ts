import { sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

import {
  BOX_PRIORITIES,
  BOX_STATUSES,
  DEFAULT_BOX_PRIORITY,
  DEFAULT_BOX_STATUS,
} from "@/constants";

import { moves } from "./moves";

export const boxes = sqliteTable(
  "boxes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    moveId: integer("move_id")
      .notNull()
      .references(() => moves.id, { onDelete: "cascade" }),

    // Per-move label number. Assigned once at creation, never renumbered on delete.
    number: integer("number").notNull(),

    // Empty `name` on insert is rewritten to `Box #<number>` by the
    // `boxes_set_default_name` trigger (see drizzle/0006_box_numbers.sql).
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
  },
  (table) => [uniqueIndex("boxes_move_id_number_unique").on(table.moveId, table.number)],
);

export type Box = typeof boxes.$inferSelect;
export type NewBox = typeof boxes.$inferInsert;
