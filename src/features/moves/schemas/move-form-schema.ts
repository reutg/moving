import { z } from "zod";

const moveDateSchema = z
  .string()
  .trim()
  .min(1, "Date is required")
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use a valid date");

export const MoveFormValuesSchema = z
  .object({
    name: z.string().trim().min(1, "Move name is required").max(200),
    address: z.string().trim().min(1, "Address is required").max(500),
    startDate: moveDateSchema,
    endDate: moveDateSchema,
  })
  .refine((values) => values.endDate >= values.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export type MoveFormValues = z.infer<typeof MoveFormValuesSchema>;
