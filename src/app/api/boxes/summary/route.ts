import { withApi } from "@/lib/api/handler";

import { getBoxesSummary } from "@/features/boxes/services/box-service";

export const GET = withApi(async () => {
  return getBoxesSummary();
});
