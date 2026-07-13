import { z } from "zod";

export const JoinWithLinkSchema = z.object({
  inviteLink: z.url().trim().min(1, "Invite link is required"),
});

export type JoinWithLinkValues = z.infer<typeof JoinWithLinkSchema>;
