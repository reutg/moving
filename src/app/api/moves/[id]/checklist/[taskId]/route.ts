import { z } from "zod";

import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import {
  deleteChecklistTask,
  updateChecklistTask,
  UpdateChecklistTaskInputSchema,
} from "@/features/checklist/services/checklist-service";

const IdSchema = z.coerce.number().int().positive();

type RouteParams = { params: Promise<{ id: string; taskId: string }> };

const parseId = (raw: string, label: string) => {
  const parsed = IdSchema.safeParse(raw);
  if (!parsed.success) throw badRequest(`Invalid ${label}: ${raw}`);
  return parsed.data;
};

export const PATCH = withApi(async (request, ctx: RouteParams) => {
  const { id, taskId } = await ctx.params;
  const moveId = parseId(id, "move id");
  const numericTaskId = parseId(taskId, "task id");

  const body = await request.json().catch(() => null);
  if (body === null) throw badRequest("Expected JSON body");

  const input = UpdateChecklistTaskInputSchema.parse(body);
  return updateChecklistTask(moveId, numericTaskId, input);
});

export const DELETE = withApi(async (_request, ctx: RouteParams) => {
  const { id, taskId } = await ctx.params;
  const moveId = parseId(id, "move id");
  const numericTaskId = parseId(taskId, "task id");

  await deleteChecklistTask(moveId, numericTaskId);
  return { id: numericTaskId };
});
