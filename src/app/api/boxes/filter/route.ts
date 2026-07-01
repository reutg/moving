import { withApi } from "@/lib/api/handler";

import { filterBoxes, FilterBoxesQuerySchema } from "@/features/boxes/services/box-service";

export const GET = withApi(async (request) => {
  const { searchParams } = new URL(request.url);

  const query = FilterBoxesQuerySchema.parse({
    moveId: searchParams.get("moveId") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    destinationRoom: searchParams.get("destinationRoom") ?? undefined,
  });

  const { moveId, ...filters } = query;
  return filterBoxes(filters, moveId);
});
