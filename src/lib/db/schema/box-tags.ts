import { index, integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { boxes } from "./boxes";

export const boxTags = sqliteTable(
  "box_tags",
  {
    boxId: integer("box_id")
      .notNull()
      .references(() => boxes.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (t) => [primaryKey({ columns: [t.boxId, t.tag] }), index("box_tags_tag_idx").on(t.tag)],
);

export type BoxTag = typeof boxTags.$inferSelect;
export type NewBoxTag = typeof boxTags.$inferInsert;
