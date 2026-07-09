import { z } from "zod";

import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import { revokeHouseholdInvite } from "@/features/household/services/household-service";

const InviteIdSchema = z.string().trim().uuid();

type RouteParams = { params: Promise<{ id: string }> };

const parseInviteId = (raw: string) => {
  const parsed = InviteIdSchema.safeParse(raw);
  if (!parsed.success) throw badRequest(`Invalid invite id: ${raw}`);
  return parsed.data;
};

export const DELETE = withApi(async (_request, ctx: RouteParams) => {
  const { id } = await ctx.params;
  return revokeHouseholdInvite(parseInviteId(id));
});
