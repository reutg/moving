import { z } from "zod";

import { DEFAULT_CHECKLIST_FILTER } from "@/constants";
import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import {
  createChecklistTask,
  CreateChecklistTaskInputSchema,
  listChecklist,
  ListChecklistQuerySchema,
} from "@/features/checklist/services/checklist-service";

const MoveIdSchema = z.coerce.number().int().positive();

type RouteParams = { params: Promise<{ id: string }> };

const parseMoveId = (raw: string) => {
  const parsed = MoveIdSchema.safeParse(raw);
  if (!parsed.success) throw badRequest(`Invalid move id: ${raw}`);
  return parsed.data;
};

export const GET = withApi(async (request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  const moveId = parseMoveId(id);

  const { searchParams } = new URL(request.url);
  const { filter } = ListChecklistQuerySchema.parse({
    filter: searchParams.get("filter") ?? DEFAULT_CHECKLIST_FILTER,
  });

  return listChecklist(moveId, filter);
});

export const POST = withApi(
  async (request, ctx: RouteParams) => {
    const { id } = await ctx.params;
    const moveId = parseMoveId(id);

    const body: unknown = await request.json().catch(() => ({}));
    const input = CreateChecklistTaskInputSchema.parse(body);
    return createChecklistTask(moveId, input);
  },
  { status: 201 },
);
