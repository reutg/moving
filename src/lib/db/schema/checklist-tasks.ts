import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import { CHECKLIST_SECTIONS, DEFAULT_CHECKLIST_SECTION } from "@/constants";

import { moves } from "./moves";

export const checklistTasks = sqliteTable(
  "checklist_tasks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    moveId: integer("move_id")
      .notNull()
      .references(() => moves.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    section: text("section", { enum: CHECKLIST_SECTIONS })
      .notNull()
      .default(DEFAULT_CHECKLIST_SECTION),
    isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(false),
    position: integer("position").notNull().default(0),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index("checklist_tasks_move_id_idx").on(table.moveId),
    index("checklist_tasks_move_section_idx").on(table.moveId, table.section),
  ],
);

export type ChecklistTask = typeof checklistTasks.$inferSelect;
export type NewChecklistTask = typeof checklistTasks.$inferInsert;
