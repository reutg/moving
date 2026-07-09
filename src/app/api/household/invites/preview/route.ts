import { z } from "zod";

import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import { getHouseholdInviteByToken } from "@/features/household/services/household-service";

const TokenQuerySchema = z.object({
  token: z.string().trim().min(1),
});

export const GET = withApi(async (request) => {
  const token = request.nextUrl.searchParams.get("token");
  const parsed = TokenQuerySchema.safeParse({ token });

  if (!parsed.success) {
    throw badRequest("Invite token is required");
  }

  return getHouseholdInviteByToken(parsed.data.token);
});
