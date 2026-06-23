import "server-only";

import { and, count, desc, eq, inArray, like, max, or } from "drizzle-orm";
import { z } from "zod";

import { BOX_PRIORITIES, BOX_STATUS_LABELS, BOX_STATUSES, type BoxStatus } from "@/constants";
import {
  COMMON_LOCATIONS,
  type CommonLocationKey,
  getLocationKeyByName,
} from "@/constants/common-locations";
import { getCurrentMoveId } from "@/features/moves/services/move-service";
import type { BoxStatusCounts } from "@/features/boxes/types/box-status-counts";
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

const getNextBoxNumber = async (moveId: number): Promise<number> => {
  const [row] = await db
    .select({ maxNumber: max(boxes.number) })
    .from(boxes)
    .where(eq(boxes.moveId, moveId));

  return (row?.maxNumber ?? 0) + 1;
};

export async function listBoxes(): Promise<Box[]> {
  const moveId = await getCurrentMoveId();

  return db
    .select()
    .from(boxes)
    .where(eq(boxes.moveId, moveId))
    .orderBy(boxes.number);
}

export async function listRecentlyUpdatedBoxes(limit = 3): Promise<Box[]> {
  const moveId = await getCurrentMoveId();

  return db
    .select()
    .from(boxes)
    .where(eq(boxes.moveId, moveId))
    .orderBy(desc(boxes.updatedAt))
    .limit(limit);
}

export async function searchBoxes({ query }: SearchBoxesQuery): Promise<Box[]> {
  const moveId = await getCurrentMoveId();
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

  const numericQuery = Number(query);
  if (!Number.isNaN(numericQuery)) {
    conditions.push(eq(boxes.number, numericQuery));
  }

  if (matchingRoomKeys.length > 0) {
    conditions.push(inArray(boxes.destinationRoom, matchingRoomKeys));
  }

  if (matchingStatuses.length > 0) {
    conditions.push(inArray(boxes.status, matchingStatuses));
  }

  return db
    .select()
    .from(boxes)
    .where(and(eq(boxes.moveId, moveId), or(...conditions)))
    .orderBy(boxes.number);
}

export async function filterBoxes({ status, destinationRoom }: FilterBoxesQuery): Promise<Box[]> {
  const moveId = await getCurrentMoveId();
  const conditions = [eq(boxes.moveId, moveId)];

  if (status.length > 0) {
    conditions.push(inArray(boxes.status, status));
  }

  if (destinationRoom.length > 0) {
    conditions.push(inArray(boxes.destinationRoom, destinationRoom));
  }

  return db
    .select()
    .from(boxes)
    .where(and(...conditions))
    .orderBy(boxes.number);
}

export async function getBoxById(id: number): Promise<Box> {
  const moveId = await getCurrentMoveId();
  const rows = await db
    .select()
    .from(boxes)
    .where(and(eq(boxes.id, id), eq(boxes.moveId, moveId)))
    .all();
  const box = rows[0];
  if (!box) throw notFound(`Box ${id} not found`);
  return box;
}

export async function deleteBox(id: number): Promise<void> {
  const moveId = await getCurrentMoveId();
  const result = await db
    .delete(boxes)
    .where(and(eq(boxes.id, id), eq(boxes.moveId, moveId)))
    .run();
  if (result.rowsAffected === 0) throw notFound(`Box ${id} not found`);
}

export async function updateBox(id: number, input: UpdateBoxInput): Promise<Box> {
  const moveId = await getCurrentMoveId();
  const updated = await db
    .update(boxes)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(boxes.id, id), eq(boxes.moveId, moveId)))
    .returning()
    .all();

  const box = updated[0];
  if (!box) throw notFound(`Box ${id} not found`);
  return box;
}

export type { BoxStatusCounts } from "@/features/boxes/types/box-status-counts";

export type BoxesSummary = {
  byStatus: Record<BoxStatus, number>;
  byDestinationRoom: Record<string, number>;
};

const loadStatusCounts = async (moveId: number): Promise<Record<BoxStatus, number>> => {
  const statusRows = await db
    .select({ status: boxes.status, count: count() })
    .from(boxes)
    .where(eq(boxes.moveId, moveId))
    .groupBy(boxes.status)
    .all();

  const byStatus = Object.fromEntries(
    BOX_STATUSES.map((status) => [status, 0]),
  ) as Record<BoxStatus, number>;

  for (const row of statusRows) {
    byStatus[row.status as BoxStatus] = row.count;
  }

  return byStatus;
};

export const getBoxStatusCounts = async (): Promise<BoxStatusCounts> => {
  const moveId = await getCurrentMoveId();
  const byStatus = await loadStatusCounts(moveId);
  const total = BOX_STATUSES.reduce((sum, status) => sum + byStatus[status], 0);

  return { ...byStatus, total };
};

export async function getBoxesSummary(): Promise<BoxesSummary> {
  const moveId = await getCurrentMoveId();

  const [byStatus, roomRows] = await Promise.all([
    loadStatusCounts(moveId),
    db
      .select({ room: boxes.destinationRoom, count: count() })
      .from(boxes)
      .where(eq(boxes.moveId, moveId))
      .groupBy(boxes.destinationRoom)
      .all(),
  ]);

  const byDestinationRoom: Record<string, number> = {};
  for (const row of roomRows) {
    byDestinationRoom[row.room] = row.count;
  }

  return { byStatus, byDestinationRoom };
}

export async function createBox(input: CreateBoxInput): Promise<Box> {
  const moveId = await getCurrentMoveId();
  const number = await getNextBoxNumber(moveId);

  const inserted = await db
    .insert(boxes)
    .values({ ...input, moveId, number })
    .returning()
    .all();

  const box = inserted[0];
  if (!box) throw internal("Insert returned no rows");

  return box;
}
