import { z } from "zod";

import {
  deleteBox,
  getBoxById,
  updateBox,
  UpdateBoxInputSchema,
} from "@/features/boxes/services/box-service";
import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

const IdSchema = z.coerce.number().int().positive();

type RouteParams = { params: Promise<{ id: string }> };

const parseId = (raw: string) => {
  const parsed = IdSchema.safeParse(raw);
  if (!parsed.success) throw badRequest(`Invalid box id: ${raw}`);
  return parsed.data;
};

export const GET = withApi(async (_request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  return getBoxById(parseId(id));
});

export const PATCH = withApi(async (request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  const numericId = parseId(id);

  const body = await request.json().catch(() => null);
  if (body === null) throw badRequest("Expected JSON body");

  const input = UpdateBoxInputSchema.parse(body);
  return updateBox(numericId, input);
});

export const DELETE = withApi(async (_request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  const numericId = parseId(id);
  await deleteBox(numericId);
  return { id: numericId };
});
