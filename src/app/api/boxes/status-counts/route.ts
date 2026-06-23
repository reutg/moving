import { withApi } from "@/lib/api/handler";

import { getBoxStatusCounts } from "@/features/boxes/services/box-service";

export const GET = withApi(async () => {
  return getBoxStatusCounts();
});
