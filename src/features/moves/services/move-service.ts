import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/auth";
import { DEFAULT_MOVE_STATUS, DONE_MOVE_STATUS } from "@/constants";
import { db } from "@/lib/db/client";
import { type Move, moves } from "@/lib/db/schema";
import { internal, notFound, unauthorized } from "@/lib/errors";

const DEFAULT_MOVE_NAME = "My Move";

const moveDateSchema = z.coerce.date();

export const CreateMoveInputSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    address: z.string().trim().min(1).max(500),
    moveDate: moveDateSchema,
  })
  .strict();

export type CreateMoveInput = z.infer<typeof CreateMoveInputSchema>;

const getAuthenticatedUserId = async (): Promise<string> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw unauthorized();
  }

  return userId;
};

const getActiveMoveForUser = async (userId: string): Promise<Move | null> => {
  const rows = await db
    .select()
    .from(moves)
    .where(and(eq(moves.userId, userId), eq(moves.status, DEFAULT_MOVE_STATUS)))
    .orderBy(desc(moves.createdAt))
    .limit(1)
    .all();

  return rows[0] ?? null;
};

export const listMoves = async (): Promise<Move[]> => {
  const userId = await getAuthenticatedUserId();

  return db
    .select()
    .from(moves)
    .where(eq(moves.userId, userId))
    .orderBy(desc(moves.createdAt))
    .all();
};

export const createMove = async (input: CreateMoveInput): Promise<Move> => {
  const userId = await getAuthenticatedUserId();
  const now = new Date();

  return db.transaction(async (tx) => {
    await tx
      .update(moves)
      .set({ status: DONE_MOVE_STATUS, updatedAt: now })
      .where(and(eq(moves.userId, userId), eq(moves.status, DEFAULT_MOVE_STATUS)));

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

    const move = inserted[0];
    if (!move) {
      throw internal("Failed to create move");
    }

    return move;
  });
};

export const getMoveById = async (id: number): Promise<Move> => {
  const userId = await getAuthenticatedUserId();

  const rows = await db
    .select()
    .from(moves)
    .where(and(eq(moves.id, id), eq(moves.userId, userId)))
    .limit(1)
    .all();

  const move = rows[0];
  if (!move) {
    throw notFound(`Move ${id} not found`);
  }

  return move;
};

export const getCurrentMove = async (): Promise<Move> => {
  const userId = await getAuthenticatedUserId();
  const activeMove = await getActiveMoveForUser(userId);

  if (activeMove) {
    return activeMove;
  }

  return getOrCreateCurrentMove();
};

export const getOrCreateCurrentMove = async (): Promise<Move> => {
  const userId = await getAuthenticatedUserId();
  const activeMove = await getActiveMoveForUser(userId);

  if (activeMove) {
    return activeMove;
  }

  const inserted = await db
    .insert(moves)
    .values({ userId, name: DEFAULT_MOVE_NAME, status: DEFAULT_MOVE_STATUS })
    .returning()
    .all();

  const move = inserted[0];
  if (!move) {
    throw internal("Failed to create default move");
  }

  return move;
};

export const getCurrentMoveId = async (): Promise<number> => {
  const move = await getCurrentMove();
  return move.id;
};
