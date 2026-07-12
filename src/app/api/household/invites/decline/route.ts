import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import {
  AcceptHouseholdInviteInputSchema,
  declineHouseholdInvite,
} from "@/features/household/services/household-service";

export const POST = withApi(async (request) => {
  const body = await request.json().catch(() => null);
  if (body === null) throw badRequest("Expected JSON body");

  const input = AcceptHouseholdInviteInputSchema.parse(body);
  return declineHouseholdInvite(input);
});
