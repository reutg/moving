import { z } from "zod";

export const InviteFormValuesSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .pipe(z.email())
    .transform((value) => value.toLowerCase()),
});

export type InviteFormValues = z.infer<typeof InviteFormValuesSchema>;
