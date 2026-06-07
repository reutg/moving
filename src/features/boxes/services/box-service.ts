import "server-only";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { BOX_PRIORITIES, BOX_STATUSES } from "@/constants";
import { db } from "@/lib/db/client";
import { boxes, type Box } from "@/lib/db/schema";
import { internal, notFound } from "@/lib/errors";

export const CreateBoxInputSchema = z
  .object({
    name: z.string().trim().max(200).optional(),
    description: z.string().max(2000).optional(),
    sourceRoom: z.string().trim().max(100).nullable().optional(),
    destinationRoom: z.string().trim().max(100).nullable().optional(),
    status: z.enum(BOX_STATUSES).optional(),
    priority: z.enum(BOX_PRIORITIES).optional(),
  })
  .strict();

export type CreateBoxInput = z.infer<typeof CreateBoxInputSchema>;

export async function listBoxes(): Promise<Box[]> {
  return db.select().from(boxes).orderBy(boxes.id);
}

export async function createBox(input: CreateBoxInput): Promise<Box> {
  const inserted = db
    .insert(boxes)
    .values(input)
    .returning({ id: boxes.id })
    .all();

  const created = inserted[0];
  if (!created) throw internal("Insert returned no rows");

  // Re-select to capture the row state AFTER the `boxes_set_default_name`
  // trigger has run. SQLite's RETURNING fires before AFTER triggers, so
  // a trigger-filled `name` would not appear in the insert's return value.
  const fresh = db.select().from(boxes).where(eq(boxes.id, created.id)).all();
  const box = fresh[0];
  if (!box) throw notFound(`Box ${created.id} not found after insert`);

  return box;
}
