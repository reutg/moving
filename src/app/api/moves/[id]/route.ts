import { z } from "zod";

import {
  deleteMove,
  getMoveById,
  PatchMoveInputSchema,
  updateMove,
  updateMoveStatus,
} from "@/features/moves/services/move-service";
import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

const IdSchema = z.coerce.number().int().positive();

type RouteParams = { params: Promise<{ id: string }> };

const parseId = (raw: string) => {
  const parsed = IdSchema.safeParse(raw);
  if (!parsed.success) throw badRequest(`Invalid move id: ${raw}`);
  return parsed.data;
};

export const GET = withApi(async (_request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  return getMoveById(parseId(id));
});

export const PATCH = withApi(async (request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  const numericId = parseId(id);

  const body = await request.json().catch(() => null);
  if (body === null) throw badRequest("Expected JSON body");

  const input = PatchMoveInputSchema.parse(body);

  if ("status" in input) {
    return updateMoveStatus(numericId, input.status);
  }

  return updateMove(numericId, input);
});

export const DELETE = withApi(async (_request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  const numericId = parseId(id);
  await deleteMove(numericId);
  return { id: numericId };
});
