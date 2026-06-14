import { z } from "zod";

import { BOX_STATUSES } from "@/constants";

export const BoxFormValuesSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  destinationRoom: z.string().min(1),
  status: z.enum(BOX_STATUSES),
});

export type BoxFormValues = z.infer<typeof BoxFormValuesSchema>;
