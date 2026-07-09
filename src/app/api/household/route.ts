import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import {
  createHousehold,
  CreateHouseholdInputSchema,
  getCurrentHousehold,
  updateHousehold,
  UpdateHouseholdInputSchema,
} from "@/features/household/services/household-service";

export const GET = withApi(async () => {
  return getCurrentHousehold();
});

export const POST = withApi(
  async (request) => {
    const body: unknown = await request.json().catch(() => ({}));
    const input = CreateHouseholdInputSchema.parse(body);
    return createHousehold(input);
  },
  { status: 201 },
);

export const PATCH = withApi(async (request) => {
  const body = await request.json().catch(() => null);
  if (body === null) throw badRequest("Expected JSON body");

  const input = UpdateHouseholdInputSchema.parse(body);
  return updateHousehold(input);
});
