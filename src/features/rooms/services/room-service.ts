import "server-only";

import { and, count, eq, ne, sql } from "drizzle-orm";
import { z } from "zod";

import { ROOM_TYPE_LABELS, ROOM_TYPES } from "@/constants";
import { db } from "@/lib/db/client";
import { boxes, type Room, rooms } from "@/lib/db/schema";
import { badRequest, internal, notFound, unauthorized } from "@/lib/errors";

import { getCurrentMove, getMoveById } from "@/features/moves/services/move-service";

import { auth } from "@/auth";

export const CreateRoomInputSchema = z
  .object({
    type: z.enum(ROOM_TYPES),
    name: z.string().trim().min(1).max(200).optional(),
    moveId: z.number().int().positive().optional(),
  })
  .strict();

export type CreateRoomInput = z.infer<typeof CreateRoomInputSchema>;

export const UpdateRoomInputSchema = z
  .object({
    type: z.enum(ROOM_TYPES).optional(),
    name: z.string().trim().min(1).max(200).optional(),
  })
  .strict()
  .refine((value) => value.type !== undefined || value.name !== undefined, {
    message: "At least one field is required",
  });

export type UpdateRoomInput = z.infer<typeof UpdateRoomInputSchema>;

export const ListRoomsQuerySchema = z
  .object({
    moveId: z.coerce.number().int().positive().optional(),
  })
  .strict();

export type ListRoomsQuery = z.infer<typeof ListRoomsQuerySchema>;

export type RoomWithBoxesCount = Room & {
  boxesCount: number;
};

const getAuthenticatedUserId = async (): Promise<string> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw unauthorized();
  }

  return userId;
};

const resolveMoveId = async (moveId?: number): Promise<number> => {
  if (moveId !== undefined) {
    const move = await getMoveById(moveId);
    return move.id;
  }

  const currentMove = await getCurrentMove();
  if (!currentMove) {
    throw notFound("No active move found");
  }

  return currentMove.id;
};

const getBoxesCountByDestinationRoom = async (
  moveId: number,
): Promise<Record<string, number>> => {
  const rows = await db
    .select({ room: boxes.destinationRoom, count: count() })
    .from(boxes)
    .where(eq(boxes.moveId, moveId))
    .groupBy(boxes.destinationRoom)
    .all();

  const counts: Record<string, number> = {};
  for (const row of rows) {
    counts[row.room] = row.count;
  }

  return counts;
};

const assertUniqueRoomName = async (
  moveId: number,
  name: string,
  excludeRoomId?: number,
): Promise<void> => {
  const normalizedName = name.trim().toLowerCase();
  const filters = [eq(rooms.moveId, moveId), sql`lower(${rooms.name}) = ${normalizedName}`];

  if (excludeRoomId !== undefined) {
    filters.push(ne(rooms.id, excludeRoomId));
  }

  const [existing] = await db
    .select({ id: rooms.id })
    .from(rooms)
    .where(and(...filters))
    .limit(1)
    .all();

  if (existing) {
    throw badRequest("A room with this name already exists");
  }
};

export const listRooms = async (moveId?: number): Promise<RoomWithBoxesCount[]> => {
  await getAuthenticatedUserId();
  const resolvedMoveId = await resolveMoveId(moveId);

  const [moveRooms, boxesCountByRoom] = await Promise.all([
    db.select().from(rooms).where(eq(rooms.moveId, resolvedMoveId)).orderBy(rooms.createdAt).all(),
    getBoxesCountByDestinationRoom(resolvedMoveId),
  ]);

  return moveRooms.map((room) => ({
    ...room,
    boxesCount: boxesCountByRoom[room.type] ?? 0,
  }));
};

export const getRoomById = async (id: number): Promise<Room> => {
  await getAuthenticatedUserId();

  const [room] = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1).all();

  if (!room) {
    throw notFound(`Room ${id} not found`);
  }

  await getMoveById(room.moveId);

  return room;
};

export const createRoom = async (input: CreateRoomInput): Promise<Room> => {
  const userId = await getAuthenticatedUserId();
  const moveId = await resolveMoveId(input.moveId);
  const name = input.name ?? ROOM_TYPE_LABELS[input.type];

  await assertUniqueRoomName(moveId, name);

  const inserted = await db
    .insert(rooms)
    .values({
      moveId,
      userId,
      type: input.type,
      name,
      updatedAt: new Date(),
    })
    .returning()
    .all();

  const room = inserted[0];
  if (!room) {
    throw internal("Failed to create room");
  }

  return room;
};

export const updateRoom = async (id: number, input: UpdateRoomInput): Promise<Room> => {
  await getAuthenticatedUserId();

  const existing = await getRoomById(id);
  const nextName = input.name ?? existing.name;

  await assertUniqueRoomName(existing.moveId, nextName, existing.id);

  const updated = await db
    .update(rooms)
    .set({
      ...(input.type !== undefined ? { type: input.type } : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
      updatedAt: new Date(),
    })
    .where(and(eq(rooms.id, existing.id), eq(rooms.moveId, existing.moveId)))
    .returning()
    .all();

  const room = updated[0];
  if (!room) {
    throw notFound(`Room ${id} not found`);
  }

  return room;
};

export const deleteRoom = async (id: number): Promise<void> => {
  await getAuthenticatedUserId();

  const existing = await getRoomById(id);

  const result = await db
    .delete(rooms)
    .where(and(eq(rooms.id, existing.id), eq(rooms.moveId, existing.moveId)))
    .run();

  if (result.rowsAffected === 0) {
    throw notFound(`Room ${id} not found`);
  }
};
