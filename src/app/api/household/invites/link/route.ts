import { withApi } from "@/lib/api/handler";

import { createOrGetHouseholdInviteLink } from "@/features/household/services/household-service";

export const POST = withApi(async () => createOrGetHouseholdInviteLink(), { status: 201 });
