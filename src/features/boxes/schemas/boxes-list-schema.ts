import { z } from "zod";

import { BOX_STATUSES } from "@/constants";

export const BOX_LIST_STATUS_FILTERS = ["all", ...BOX_STATUSES] as const;

export type BoxListStatusFilter = (typeof BOX_LIST_STATUS_FILTERS)[number];

export const BoxesListFiltersSchema = z.object({
  status: z.enum(BOX_LIST_STATUS_FILTERS),
});

export type BoxesListFilters = z.infer<typeof BoxesListFiltersSchema>;
