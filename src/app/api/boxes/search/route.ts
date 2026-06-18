import { withApi } from "@/lib/api/handler";

import { searchBoxes, SearchBoxesQuerySchema } from "@/features/boxes/services/box-service";

export const GET = withApi(async (request) => {
  const { searchParams } = new URL(request.url);

  const query = SearchBoxesQuerySchema.parse({
    query: searchParams.get("query") ?? undefined,
  });

  return searchBoxes(query);
});
