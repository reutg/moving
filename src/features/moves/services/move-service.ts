import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { auth } from "@/auth";
import { CURRENT_MOVE_ID } from "@/constants/current-move";
import { db } from "@/lib/db/client";
import { type Move, moves } from "@/lib/db/schema";
import { internal, notFound, unauthorized } from "@/lib/errors";

const DEFAULT_MOVE_NAME = "My Move";

const moveDateSchema = z.coerce.date();

export const CreateMoveInputSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    address: z.string().trim().min(1).max(500),
    startDate: moveDateSchema,
    endDate: moveDateSchema,
  })
  .strict()
  .refine((values) => values.endDate >= values.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export type CreateMoveInput = z.infer<typeof CreateMoveInputSchema>;

const getAuthenticatedUserId = async (): Promise<string> => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw unauthorized();
  }

  return userId;
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

  const inserted = await db
    .insert(moves)
    .values({
      userId,
      name: input.name,
      address: input.address,
      startDate: input.startDate,
      endDate: input.endDate,
    })
    .returning()
    .all();

  const move = inserted[0];
  if (!move) {
    throw internal("Failed to create move");
  }

  return move;
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
  return getMoveById(CURRENT_MOVE_ID);
};

export const getOrCreateCurrentMove = async (): Promise<Move> => {
  const userId = await getAuthenticatedUserId();

  const existing = await db
    .select()
    .from(moves)
    .where(eq(moves.userId, userId))
    .orderBy(desc(moves.createdAt))
    .limit(1);

  const currentMove = existing[0];
  if (currentMove) {
    return currentMove;
  }

  const inserted = await db
    .insert(moves)
    .values({ userId, name: DEFAULT_MOVE_NAME })
    .returning()
    .all();

  const move = inserted[0];
  if (!move) {
    throw internal("Failed to create default move");
  }

  return move;
};

export const getCurrentMoveId = async (): Promise<number> => {
  await getCurrentMove();
  return CURRENT_MOVE_ID;
};
