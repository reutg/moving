import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import { removeHouseholdMember } from "@/features/household/services/household-service";

type RouteParams = { params: Promise<{ userId: string }> };

export const DELETE = withApi(async (_request, ctx: RouteParams) => {
  const { userId } = await ctx.params;
  const trimmedUserId = userId.trim();

  if (!trimmedUserId) {
    throw badRequest("Invalid member id");
  }

  return removeHouseholdMember(trimmedUserId);
});
