import { z } from "zod";

import { ROOM_TYPES } from "@/constants";

export const RoomTypeSchema = z.object({
  type: z.enum(ROOM_TYPES),
  name: z.string().trim().min(1, "Name is required"),
});

export type RoomTypeValues = z.infer<typeof RoomTypeSchema>;
