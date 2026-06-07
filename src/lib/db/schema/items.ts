import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { boxes } from "./boxes";

export const items = sqliteTable(
  "items",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    boxId: integer("box_id")
      .notNull()
      .references(() => boxes.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    fragile: integer("fragile", { mode: "boolean" }).notNull().default(false),

    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (t) => [index("items_box_id_idx").on(t.boxId)],
);

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
