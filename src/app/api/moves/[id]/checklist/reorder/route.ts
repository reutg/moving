import { z } from "zod";

import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import {
  reorderChecklistTasks,
  ReorderChecklistTasksInputSchema,
} from "@/features/checklist/services/checklist-service";

const MoveIdSchema = z.coerce.number().int().positive();

type RouteParams = { params: Promise<{ id: string }> };

const parseMoveId = (raw: string) => {
  const parsed = MoveIdSchema.safeParse(raw);
  if (!parsed.success) throw badRequest(`Invalid move id: ${raw}`);
  return parsed.data;
};

export const PATCH = withApi(async (request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  const moveId = parseMoveId(id);

  const body = await request.json().catch(() => null);
  if (body === null) throw badRequest("Expected JSON body");

  const input = ReorderChecklistTasksInputSchema.parse(body);
  return reorderChecklistTasks(moveId, input);
});
