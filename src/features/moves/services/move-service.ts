import "server-only";

import { and, count, desc, eq, inArray, ne } from "drizzle-orm";
import { z } from "zod";

import { DEFAULT_MOVE_STATUS, MOVE_STATUSES } from "@/constants";
import { db } from "@/lib/db/client";
import { boxes, householdMembers, type Move, moves, users } from "@/lib/db/schema";
import { internal, notFound, unauthorized } from "@/lib/errors";

import { completeOnboarding, getUserById } from "@/features/users/services/user-service";

import { auth } from "@/auth";

const moveDateSchema = z.coerce.date();

export const CreateMoveInputSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    address: z.string().trim().min(1).max(500),
    moveDate: moveDateSchema,
  })
  .strict();

export type CreateMoveInput = z.infer<typeof CreateMoveInputSchema>;

export const UpdateMoveInputSchema = CreateMoveInputSchema;

export type UpdateMoveInput = z.infer<typeof UpdateMoveInputSchema>;

export const UpdateMoveStatusInputSchema = z
  .object({
    status: z.enum(MOVE_STATUSES),
  })
  .strict();

export type UpdateMoveStatusInput = z.infer<typeof UpdateMoveStatusInputSchema>;

export const PatchMoveInputSchema = z.union([UpdateMoveStatusInputSchema, UpdateMoveInputSchema]);

export const SetCurrentMoveInputSchema = z
  .object({
    moveId: z.number().int().positive(),
  })
  .strict();

export type SetCurrentMoveInput = z.infer<typeof SetCurrentMoveInputSchema>;

export type MoveWithBoxesCount = Move & {
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

const getAccessibleMoveOwnerIds = async (userId: string): Promise<string[]> => {
  const [membership] = await db
    .select({ householdId: householdMembers.householdId })
    .from(householdMembers)
    .where(eq(householdMembers.userId, userId))
    .limit(1)
    .all();

  if (!membership) {
    return [userId];
  }

  const members = await db
    .select({ userId: householdMembers.userId })
    .from(householdMembers)
    .where(eq(householdMembers.householdId, membership.householdId))
    .all();

  const memberIds = members.map((member) => member.userId);
  return memberIds.length > 0 ? memberIds : [userId];
};

const setCurrentMoveForUser = async (userId: string, moveId: number): Promise<void> => {
  await db.update(users).set({ currentMoveId: moveId }).where(eq(users.id, userId)).run();
};

const getCurrentMoveRowForUser = async (userId: string): Promise<Move | null> => {
  const user = await getUserById(userId);
  const ownerIds = await getAccessibleMoveOwnerIds(userId);

  if (user.currentMoveId !== null) {
    const rows = await db
      .select()
      .from(moves)
      .where(and(eq(moves.id, user.currentMoveId), inArray(moves.userId, ownerIds)))
      .limit(1)
      .all();

    if (rows[0]) {
      return rows[0];
    }
  }

  const [fallback] = await db
    .select()
    .from(moves)
    .where(inArray(moves.userId, ownerIds))
    .orderBy(desc(moves.createdAt))
    .limit(1)
    .all();

  if (!fallback) {
    return null;
  }

  await setCurrentMoveForUser(userId, fallback.id);
  return fallback;
};

const attachBoxesCount = async (move: Move): Promise<MoveWithBoxesCount> => {
  const [row] = await db
    .select({ boxesCount: count() })
    .from(boxes)
    .where(eq(boxes.moveId, move.id));

  return {
    ...move,
    boxesCount: row?.boxesCount ?? 0,
  };
};

export const getCurrentMove = async (): Promise<MoveWithBoxesCount | null> => {
  const userId = await getAuthenticatedUserId();
  const move = await getCurrentMoveRowForUser(userId);

  if (!move) {
    return null;
  }

  return attachBoxesCount(move);
};

export const getOtherMoves = async (): Promise<Move[]> => {
  const userId = await getAuthenticatedUserId();
  const ownerIds = await getAccessibleMoveOwnerIds(userId);
  const currentMove = await getCurrentMoveRowForUser(userId);

  if (!currentMove) {
    return db
      .select()
      .from(moves)
      .where(inArray(moves.userId, ownerIds))
      .orderBy(desc(moves.createdAt))
      .all();
  }

  return db
    .select()
    .from(moves)
    .where(and(inArray(moves.userId, ownerIds), ne(moves.id, currentMove.id)))
    .orderBy(desc(moves.createdAt))
    .all();
};

export const listMoves = async (): Promise<Move[]> => {
  const userId = await getAuthenticatedUserId();
  const ownerIds = await getAccessibleMoveOwnerIds(userId);

  return db
    .select()
    .from(moves)
    .where(inArray(moves.userId, ownerIds))
    .orderBy(desc(moves.createdAt))
    .all();
};

export const setCurrentMove = async (moveId: number): Promise<MoveWithBoxesCount> => {
  const userId = await getAuthenticatedUserId();
  const move = await getMoveById(moveId);

  await setCurrentMoveForUser(userId, moveId);

  return move;
};

export const createMove = async (input: CreateMoveInput): Promise<Move> => {
  const userId = await getAuthenticatedUserId();
  const now = new Date();

  const move = await db.transaction(async (tx) => {
    const inserted = await tx
      .insert(moves)
      .values({
        userId,
        name: input.name,
        address: input.address,
        moveDate: input.moveDate,
        status: DEFAULT_MOVE_STATUS,
        updatedAt: now,
      })
      .returning()
      .all();

    const createdMove = inserted[0];
    if (!createdMove) {
      throw internal("Failed to create move");
    }

    await tx.update(users).set({ currentMoveId: createdMove.id }).where(eq(users.id, userId)).run();

    return createdMove;
  });

  await completeOnboarding(userId);

  return move;
};

export const getMoveById = async (id: number): Promise<MoveWithBoxesCount> => {
  const userId = await getAuthenticatedUserId();
  const ownerIds = await getAccessibleMoveOwnerIds(userId);

  const rows = await db
    .select()
    .from(moves)
    .where(and(eq(moves.id, id), inArray(moves.userId, ownerIds)))
    .limit(1)
    .all();

  const move = rows[0];
  if (!move) {
    throw notFound(`Move ${id} not found`);
  }

  return attachBoxesCount(move);
};

export const updateMove = async (
  id: number,
  input: UpdateMoveInput,
): Promise<MoveWithBoxesCount> => {
  await getMoveById(id);

  const updated = await db
    .update(moves)
    .set({
      name: input.name,
      address: input.address,
      moveDate: input.moveDate,
      updatedAt: new Date(),
    })
    .where(eq(moves.id, id))
    .returning()
    .all();

  const result = updated[0];
  if (!result) {
    throw notFound(`Move ${id} not found`);
  }

  return attachBoxesCount(result);
};

const findNextCurrentMove = async (userId: string) => {
  const ownerIds = await getAccessibleMoveOwnerIds(userId);

  const [move] = await db
    .select()
    .from(moves)
    .where(inArray(moves.userId, ownerIds))
    .orderBy(desc(moves.createdAt))
    .limit(1)
    .all();

  return move;
};

const updateCurrentMove = async (userId: string): Promise<void> => {
  const nextMove = await findNextCurrentMove(userId);

  await db
    .update(users)
    .set({ currentMoveId: nextMove?.id ?? null })
    .where(eq(users.id, userId))
    .run();
};

export const deleteMove = async (id: number): Promise<void> => {
  const userId = await getAuthenticatedUserId();
  const user = await getUserById(userId);

  await getMoveById(id);

  await db.transaction(async (tx) => {
    await tx.delete(boxes).where(eq(boxes.moveId, id)).run();

    const result = await tx.delete(moves).where(eq(moves.id, id)).run();

    if (result.rowsAffected === 0) {
      throw notFound(`Move ${id} not found`);
    }
  });

  if (user.currentMoveId === id) {
    await updateCurrentMove(userId);
  }
};

export const updateMoveStatus = async (
  id: number,
  status: UpdateMoveStatusInput["status"],
): Promise<Move> => {
  const userId = await getAuthenticatedUserId();
  const move = await getMoveById(id);

  if (move.status === status) {
    return move;
  }

  const updated = await db
    .update(moves)
    .set({ status, updatedAt: new Date() })
    .where(eq(moves.id, id))
    .returning()
    .all();

  const result = updated[0];
  if (!result) {
    throw notFound(`Move ${id} not found`);
  }

  if (status === DEFAULT_MOVE_STATUS) {
    await completeOnboarding(userId);
  }

  return result;
};

export const getCurrentMoveId = async (): Promise<number> => {
  const currentMove = await getCurrentMove();

  if (!currentMove) {
    throw notFound("No current move");
  }

  return currentMove.id;
};
