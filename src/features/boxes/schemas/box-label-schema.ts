import { z } from "zod";
import { LABEL_SIZE_IDS } from "../constants/label-sizes";

export type LabelPart = "boxNumber" | "name" | "qrCode";
export const BoxLabelSchema = z.object({
  size: z.enum(LABEL_SIZE_IDS),
  copies: z.number().min(1),
  content: z.object({
    boxNumber: z.boolean(),
    name: z.boolean(),
    qrCode: z.boolean(),
  }),
});

export type BoxLabelValues = z.infer<typeof BoxLabelSchema>;
