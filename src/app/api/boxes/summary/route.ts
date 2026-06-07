import { withApi } from "@/lib/api/handler";

import { getBoxesSummary } from "@/features/boxes";

export const GET = withApi(async () => {
  return getBoxesSummary();
});
