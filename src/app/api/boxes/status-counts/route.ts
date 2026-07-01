import { withApi } from "@/lib/api/handler";

import {
  getBoxStatusCounts,
  ListBoxesQuerySchema,
} from "@/features/boxes/services/box-service";

export const GET = withApi(async (request) => {
  const { searchParams } = new URL(request.url);
  const { moveId } = ListBoxesQuerySchema.parse({
    moveId: searchParams.get("moveId") ?? undefined,
  });

  return getBoxStatusCounts(moveId);
});
