import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

import { AiSearchRequestSchema } from "@/features/ai-search/schemas/ai-search-schema";
import { searchBoxesWithAi } from "@/features/ai-search/services/ai-search-service";

export const POST = withApi(async (request) => {
  const body: unknown = await request.json().catch(() => null);
  if (body === null) throw badRequest("Expected JSON body");

  const input = AiSearchRequestSchema.parse(body);
  return searchBoxesWithAi(input);
});
