import { z } from "zod";

import { BOX_STATUSES } from "@/constants";

export const BoxesListFiltersSchema = z.object({
  status: z.enum(BOX_STATUSES),
});

export type BoxesListFilters = z.infer<typeof BoxesListFiltersSchema>;
