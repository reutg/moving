import { z } from "zod";

import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import { listBoxesByRoomId } from "@/features/boxes/services/box-service";

const IdSchema = z.coerce.number().int().positive();

type RouteParams = { params: Promise<{ id: string }> };

const parseId = (raw: string) => {
  const parsed = IdSchema.safeParse(raw);
  if (!parsed.success) throw badRequest(`Invalid room id: ${raw}`);
  return parsed.data;
};

export const GET = withApi(async (_request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  return listBoxesByRoomId(parseId(id));
});
