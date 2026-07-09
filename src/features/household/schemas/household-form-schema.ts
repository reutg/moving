import { z } from "zod";

export const HouseholdFormValuesSchema = z.object({
  name: z.string().trim().min(1, "Household name is required").max(200),
});

export type HouseholdFormValues = z.infer<typeof HouseholdFormValuesSchema>;
