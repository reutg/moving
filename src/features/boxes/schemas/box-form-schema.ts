import { z } from "zod";

import { BOX_STATUSES } from "@/constants";

export const BoxFormValuesSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  destinationRoom: z.string().min(1, "Destination room is required"),
  status: z.enum(BOX_STATUSES),
});

export type BoxFormValues = z.infer<typeof BoxFormValuesSchema>;
