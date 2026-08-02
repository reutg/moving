import "server-only";

import { and, count, desc, eq, inArray, like, max, or, type SQL } from "drizzle-orm";
import { z } from "zod";

import { BOX_PRIORITIES, BOX_STATUSES, type BoxStatus } from "@/constants";
import { COMMON_LOCATIONS, type CommonLocationKey } from "@/constants/common-locations";
import { db } from "@/lib/db/client";
import { type Box, boxes, type Room, rooms } from "@/lib/db/schema";
import { badRequest, internal, notFound } from "@/lib/errors";

import type {
  BoxSearchBoxResult,
  BoxSearchItemResult,
  BoxSearchResult,
} from "@/features/boxes/types/box-search-result";
import type { BoxStatusCounts } from "@/features/boxes/types/box-status-counts";
import {
  getCurrentMove,
  getCurrentMoveId,
  getMoveById,
} from "@/features/moves/services/move-service";

export type BoxWithRoom = Box & {
  roomName: string;
  roomType: CommonLocationKey;
};

export const CreateBoxInputSchema = z
  .object({
    name: z.string().trim().max(200).optional(),
    description: z.string().max(2000).optional(),
    sourceRoom: z.string().trim().max(100).nullable().optional(),
    roomId: z.number().int().positive(),
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
  moveId: z.coerce.number().int().positive().optional(),
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

export const ListBoxesQuerySchema = z.object({
  moveId: z.coerce.number().int().positive().optional(),
});

export type ListBoxesQuery = z.infer<typeof ListBoxesQuerySchema>;

const resolveMoveId = async (moveId?: number): Promise<number | null> => {
  if (moveId !== undefined) {
    const move = await getMoveById(moveId);
    return move.id;
  }

  const currentMove = await getCurrentMove();
  return currentMove?.id ?? null;
};

const emptyStatusCounts = (): BoxStatusCounts => {
  const byStatus = Object.fromEntries(BOX_STATUSES.map((status) => [status, 0])) as Record<
    BoxStatus,
    number
  >;

  return { ...byStatus, total: 0 };
};

const findMatchingSegment = (value: string, query: string): string | null => {
  const lowerQuery = query.toLowerCase();
  const segments = value.split(",").map((segment) => segment.trim());
  return segments.find((segment) => segment.toLowerCase().includes(lowerQuery)) ?? null;
};

const getMatchingItems = (description: string, query: string): string[] => {
  const lowerQuery = query.toLowerCase();
  return parseCommaSeparated(description).filter((item) => item.toLowerCase().includes(lowerQuery));
};

const resolveRoomForMove = async (roomId: number, moveId: number): Promise<Room> => {
  const [room] = await db
    .select()
    .from(rooms)
    .where(and(eq(rooms.id, roomId), eq(rooms.moveId, moveId)))
    .all();

  if (!room) throw badRequest(`Room ${roomId} does not belong to this move`);

  return room;
};

const toBoxWithRoom = (box: Box, room: Pick<Room, "name" | "type">): BoxWithRoom => ({
  ...box,
  roomName: room.name,
  roomType: room.type as CommonLocationKey,
});

const selectBoxesWithRoom = async (conditions: SQL | undefined) => {
  const rows = await db
    .select({
      box: boxes,
      roomName: rooms.name,
      roomType: rooms.type,
    })
    .from(boxes)
    .innerJoin(rooms, eq(boxes.roomId, rooms.id))
    .where(conditions)
    .orderBy(boxes.number)
    .all();

  return rows.map((row) => toBoxWithRoom(row.box, { name: row.roomName, type: row.roomType }));
};

const getNextBoxNumber = async (moveId: number): Promise<number> => {
  const [row] = await db
    .select({ maxNumber: max(boxes.number) })
    .from(boxes)
    .where(eq(boxes.moveId, moveId));

  return (row?.maxNumber ?? 0) + 1;
};

export async function listBoxes(moveId?: number): Promise<BoxWithRoom[]> {
  const resolvedMoveId = await resolveMoveId(moveId);
  if (resolvedMoveId === null) {
    return [];
  }

  return selectBoxesWithRoom(eq(boxes.moveId, resolvedMoveId));
}

export async function listBoxesByRoomId(roomId: number): Promise<Box[]> {
  const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1).all();

  if (!room) {
    throw notFound(`Room ${roomId} not found`);
  }

  await getMoveById(room.moveId);

  return db.select().from(boxes).where(eq(boxes.roomId, roomId)).orderBy(boxes.number).all();
}

export async function listRecentlyUpdatedBoxes(limit = 3): Promise<BoxWithRoom[]> {
  const moveId = await resolveMoveId();
  if (moveId === null) {
    return [];
  }

  const rows = await db
    .select({
      box: boxes,
      roomName: rooms.name,
      roomType: rooms.type,
    })
    .from(boxes)
    .innerJoin(rooms, eq(boxes.roomId, rooms.id))
    .where(eq(boxes.moveId, moveId))
    .orderBy(desc(boxes.updatedAt))
    .limit(limit)
    .all();

  return rows.map((row) => toBoxWithRoom(row.box, { name: row.roomName, type: row.roomType }));
}

export async function searchBoxes({ query }: SearchBoxesQuery): Promise<BoxSearchResult> {
  const moveId = await resolveMoveId();
  if (moveId === null) {
    return { items: [], boxes: [], totalCount: 0 };
  }

  const term = `%${query}%`;

  const matchingBoxes = await selectBoxesWithRoom(
    and(eq(boxes.moveId, moveId), or(like(boxes.name, term), like(boxes.description, term))),
  );

  const items: BoxSearchItemResult[] = [];
  const boxResults: BoxSearchBoxResult[] = [];

  for (const box of matchingBoxes) {
    for (const item of getMatchingItems(box.description, query)) {
      items.push({
        item,
        boxNumber: box.number,
        room: box.roomType,
        status: box.status,
      });
    }

    const match =
      findMatchingSegment(box.name, query) ?? findMatchingSegment(box.description, query);

    if (match) {
      boxResults.push({
        title: box.name,
        boxNumber: box.number,
        room: box.roomType,
        status: box.status,
        match,
      });
    }
  }

  return { items, boxes: boxResults, totalCount: items.length + boxResults.length };
}

export async function filterBoxes(
  { status, destinationRoom }: FilterBoxesQuery,
  moveId?: number,
): Promise<BoxWithRoom[]> {
  const resolvedMoveId = await resolveMoveId(moveId);
  if (resolvedMoveId === null) {
    return [];
  }

  const conditions = [eq(boxes.moveId, resolvedMoveId)];

  if (status.length > 0) {
    conditions.push(inArray(boxes.status, status));
  }

  if (destinationRoom.length > 0) {
    conditions.push(inArray(rooms.type, destinationRoom));
  }

  const rows = await db
    .select({
      box: boxes,
      roomName: rooms.name,
      roomType: rooms.type,
    })
    .from(boxes)
    .innerJoin(rooms, eq(boxes.roomId, rooms.id))
    .where(and(...conditions))
    .orderBy(boxes.number)
    .all();

  return rows.map((row) => toBoxWithRoom(row.box, { name: row.roomName, type: row.roomType }));
}

export async function getBoxById(id: number): Promise<BoxWithRoom> {
  const moveId = await getCurrentMoveId();
  const [row] = await db
    .select({
      box: boxes,
      roomName: rooms.name,
      roomType: rooms.type,
    })
    .from(boxes)
    .innerJoin(rooms, eq(boxes.roomId, rooms.id))
    .where(and(eq(boxes.id, id), eq(boxes.moveId, moveId)))
    .all();

  if (!row) throw notFound(`Box ${id} not found`);
  return toBoxWithRoom(row.box, { name: row.roomName, type: row.roomType });
}

export async function deleteBox(id: number): Promise<void> {
  const moveId = await getCurrentMoveId();
  const result = await db
    .delete(boxes)
    .where(and(eq(boxes.id, id), eq(boxes.moveId, moveId)))
    .run();
  if (result.rowsAffected === 0) throw notFound(`Box ${id} not found`);
}

export async function updateBox(id: number, input: UpdateBoxInput): Promise<BoxWithRoom> {
  const moveId = await getCurrentMoveId();

  if (input.roomId !== undefined) {
    await resolveRoomForMove(input.roomId, moveId);
  }

  const updated = await db
    .update(boxes)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(boxes.id, id), eq(boxes.moveId, moveId)))
    .returning()
    .all();

  const box = updated[0];
  if (!box) throw notFound(`Box ${id} not found`);

  return getBoxById(box.id);
}

export type {
  BoxSearchBoxResult,
  BoxSearchItemResult,
  BoxSearchResult,
} from "@/features/boxes/types/box-search-result";
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

  const byStatus = Object.fromEntries(BOX_STATUSES.map((status) => [status, 0])) as Record<
    BoxStatus,
    number
  >;

  for (const row of statusRows) {
    byStatus[row.status as BoxStatus] = row.count;
  }

  return byStatus;
};

export const getBoxStatusCounts = async (moveId?: number): Promise<BoxStatusCounts> => {
  const resolvedMoveId = await resolveMoveId(moveId);
  if (resolvedMoveId === null) {
    return emptyStatusCounts();
  }

  const byStatus = await loadStatusCounts(resolvedMoveId);
  const total = BOX_STATUSES.reduce((sum, status) => sum + byStatus[status], 0);

  return { ...byStatus, total };
};

export async function getBoxesSummary(): Promise<BoxesSummary> {
  const moveId = await resolveMoveId();
  if (moveId === null) {
    const { total: _total, ...byStatus } = emptyStatusCounts();
    return { byStatus, byDestinationRoom: {} };
  }

  const [byStatus, roomRows] = await Promise.all([
    loadStatusCounts(moveId),
    db
      .select({ roomType: rooms.type, count: count() })
      .from(boxes)
      .innerJoin(rooms, eq(boxes.roomId, rooms.id))
      .where(eq(boxes.moveId, moveId))
      .groupBy(rooms.type)
      .all(),
  ]);

  const byDestinationRoom: Record<string, number> = {};
  for (const row of roomRows) {
    byDestinationRoom[row.roomType] = row.count;
  }

  return { byStatus, byDestinationRoom };
}

export async function createBox(input: CreateBoxInput): Promise<BoxWithRoom> {
  const moveId = await getCurrentMoveId();
  const room = await resolveRoomForMove(input.roomId, moveId);
  const number = await getNextBoxNumber(moveId);

  const inserted = await db
    .insert(boxes)
    .values({
      name: input.name,
      description: input.description,
      sourceRoom: input.sourceRoom,
      roomId: room.id,
      status: input.status,
      priority: input.priority,
      moveId,
      number,
    })
    .returning()
    .all();

  const box = inserted[0];
  if (!box) throw internal("Insert returned no rows");

  return toBoxWithRoom(box, room);
}
