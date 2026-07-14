import { z } from "zod";

import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import {
  deleteRoom,
  getRoomById,
  updateRoom,
  UpdateRoomInputSchema,
} from "@/features/rooms/services/room-service";

const IdSchema = z.coerce.number().int().positive();

type RouteParams = { params: Promise<{ id: string }> };

const parseId = (raw: string) => {
  const parsed = IdSchema.safeParse(raw);
  if (!parsed.success) throw badRequest(`Invalid room id: ${raw}`);
  return parsed.data;
};

export const GET = withApi(async (_request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  return getRoomById(parseId(id));
});

export const PATCH = withApi(async (request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  const numericId = parseId(id);

  const body = await request.json().catch(() => null);
  if (body === null) throw badRequest("Expected JSON body");

  const input = UpdateRoomInputSchema.parse(body);
  return updateRoom(numericId, input);
});

export const DELETE = withApi(async (_request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  const numericId = parseId(id);
  await deleteRoom(numericId);
  return { id: numericId };
});
