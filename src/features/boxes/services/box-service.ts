import "server-only";

import { and, count, eq, inArray, like, or } from "drizzle-orm";
import { z } from "zod";

import { BOX_PRIORITIES, BOX_STATUS_LABELS, BOX_STATUSES, type BoxStatus } from "@/constants";
import {
  COMMON_LOCATIONS,
  type CommonLocationKey,
  getLocationKeyByName,
} from "@/constants/common-locations";
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

const LOCATION_KEYS = Object.keys(COMMON_LOCATIONS) as [CommonLocationKey, ...CommonLocationKey[]];

const parseCommaSeparated = (value: string | undefined) =>
  value
    ?.split(",")
    .map((part) => part.trim())
    .filter(Boolean) ?? [];

export const SearchBoxesQuerySchema = z.object({
  query: z.string().trim().min(1),
});

export type SearchBoxesQuery = z.infer<typeof SearchBoxesQuerySchema>;

export const FilterBoxesQuerySchema = z.object({
  status: z
    .string()
    .optional()
    .transform(parseCommaSeparated)
    .pipe(z.array(z.enum(BOX_STATUSES))),
  destinationRoom: z
    .string()
    .optional()
    .transform(parseCommaSeparated)
    .pipe(z.array(z.enum(LOCATION_KEYS))),
});

export type FilterBoxesQuery = z.infer<typeof FilterBoxesQuerySchema>;

const matchesSearchTerm = (value: string, search: string) =>
  value.toLowerCase().includes(search.toLowerCase());

export async function listBoxes(): Promise<Box[]> {
  return db.select().from(boxes).orderBy(boxes.id);
}

export async function searchBoxes({ query }: SearchBoxesQuery): Promise<Box[]> {
  const term = `%${query}%`;

  const matchingRoomKeys = (Object.entries(COMMON_LOCATIONS) as [CommonLocationKey, string][])
    .filter(
      ([roomKey, roomLabel]) =>
        matchesSearchTerm(roomKey, query) || matchesSearchTerm(roomLabel, query),
    )
    .map(([roomKey]) => roomKey);

  const matchingStatuses = BOX_STATUSES.filter(
    (status) =>
      matchesSearchTerm(status, query) || matchesSearchTerm(BOX_STATUS_LABELS[status], query),
  );

  const conditions = [
    like(boxes.name, term),
    like(boxes.description, term),
    like(boxes.destinationRoom, term),
    like(boxes.status, term),
  ];

  if (matchingRoomKeys.length > 0) {
    conditions.push(inArray(boxes.destinationRoom, matchingRoomKeys));
  }

  if (matchingStatuses.length > 0) {
    conditions.push(inArray(boxes.status, matchingStatuses));
  }

  return db
    .select()
    .from(boxes)
    .where(or(...conditions))
    .orderBy(boxes.id);
}

export async function filterBoxes({ status, destinationRoom }: FilterBoxesQuery): Promise<Box[]> {
  const conditions = [];

  if (status.length > 0) {
    conditions.push(inArray(boxes.status, status));
  }

  if (destinationRoom.length > 0) {
    conditions.push(inArray(boxes.destinationRoom, destinationRoom));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  return db.select().from(boxes).where(where).orderBy(boxes.id);
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

  const byStatus = Object.fromEntries(
    BOX_STATUSES.map((status) => [status, 0]),
  ) as Record<BoxStatus, number>;
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
