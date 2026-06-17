import "server-only";

import { count, eq } from "drizzle-orm";
import { z } from "zod";

import { BOX_PRIORITIES, BOX_STATUSES, type BoxStatus } from "@/constants";
import { getLocationKeyByName } from "@/constants/common-locations";
import { db } from "@/lib/db/client";
import { type Box, boxes } from "@/lib/db/schema";
import { internal, notFound } from "@/lib/errors";

const DestinationRoomSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value, ctx) => {
    const key = getLocationKeyByName(value);
    if (!key) {
      ctx.addIssue({ code: "custom", message: `Unknown room: ${value}` });
      return z.NEVER;
    }
    return key;
  });

export const CreateBoxInputSchema = z
  .object({
    name: z.string().trim().max(200).optional(),
    description: z.string().max(2000).optional(),
    sourceRoom: z.string().trim().max(100).nullable().optional(),
    destinationRoom: DestinationRoomSchema,
    status: z.enum(BOX_STATUSES).optional(),
    priority: z.enum(BOX_PRIORITIES).optional(),
  })
  .strict();

export type CreateBoxInput = z.infer<typeof CreateBoxInputSchema>;

export const UpdateBoxInputSchema = CreateBoxInputSchema.partial();

export type UpdateBoxInput = z.infer<typeof UpdateBoxInputSchema>;

export async function listBoxes(): Promise<Box[]> {
  return db.select().from(boxes).orderBy(boxes.id);
}

export async function getBoxById(id: number): Promise<Box> {
  const rows = await db.select().from(boxes).where(eq(boxes.id, id)).all();
  const box = rows[0];
  if (!box) throw notFound(`Box ${id} not found`);
  return box;
}

export async function deleteBox(id: number): Promise<void> {
  const result = await db.delete(boxes).where(eq(boxes.id, id)).run();
  if (result.rowsAffected === 0) throw notFound(`Box ${id} not found`);
}

export async function updateBox(id: number, input: UpdateBoxInput): Promise<Box> {
  const updated = await db
    .update(boxes)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(boxes.id, id))
    .returning()
    .all();

  const box = updated[0];
  if (!box) throw notFound(`Box ${id} not found`);
  return box;
}

export type BoxesSummary = {
  byStatus: Record<BoxStatus, number>;
  byDestinationRoom: Record<string, number>;
};

export async function getBoxesSummary(): Promise<BoxesSummary> {
  const [statusRows, roomRows] = await Promise.all([
    db.select({ status: boxes.status, count: count() }).from(boxes).groupBy(boxes.status).all(),
    db
      .select({ room: boxes.destinationRoom, count: count() })
      .from(boxes)
      .groupBy(boxes.destinationRoom)
      .all(),
  ]);

  const byStatus = Object.fromEntries(BOX_STATUSES.map((s) => [s, 0])) as Record<BoxStatus, number>;
  for (const row of statusRows) {
    byStatus[row.status] = row.count;
  }

  const byDestinationRoom: Record<string, number> = {};
  for (const row of roomRows) {
    byDestinationRoom[row.room] = row.count;
  }

  return { byStatus, byDestinationRoom };
}

export async function createBox(input: CreateBoxInput): Promise<Box> {
  const inserted = await db.insert(boxes).values(input).returning({ id: boxes.id }).all();

  const created = inserted[0];
  if (!created) throw internal("Insert returned no rows");

  const fresh = await db.select().from(boxes).where(eq(boxes.id, created.id)).all();
  const box = fresh[0];
  if (!box) throw notFound(`Box ${created.id} not found after insert`);

  return box;
}
