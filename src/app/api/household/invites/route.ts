import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import {
  createHouseholdInvite,
  CreateHouseholdInviteInputSchema,
  listHouseholdInvites,
  ListHouseholdInvitesQuerySchema,
} from "@/features/household/services/household-service";

export const GET = withApi(async (request) => {
  const status = request.nextUrl.searchParams.get("status");
  const query = ListHouseholdInvitesQuerySchema.parse(status ? { status } : {});

  return listHouseholdInvites(query);
});

export const POST = withApi(
  async (request) => {
    const body = await request.json().catch(() => null);
    if (body === null) throw badRequest("Expected JSON body");

    const input = CreateHouseholdInviteInputSchema.parse(body);
    return createHouseholdInvite(input);
  },
  { status: 201 },
);
