import { z } from "zod";

import { collapseWhitespace } from "@/features/ai-search/services/ai-search-helpers";

export const MAX_QUERY_LENGTH = 100;
export const DEFAULT_RESULT_LIMIT = 20;
export const MAX_RESULT_LIMIT = 50;

export const AiSearchRequestSchema = z
  .object({
    moveId: z.number().int().positive().optional(),
    query: z
      .string()
      .trim()
      .min(1, "Search query is required")
      .max(MAX_QUERY_LENGTH, `Search query must be ${MAX_QUERY_LENGTH} characters or fewer`)
      .transform(collapseWhitespace)
      .refine((value) => value.length > 0, "Search query is required"),
    limit: z.number().int().positive().max(MAX_RESULT_LIMIT).default(DEFAULT_RESULT_LIMIT),
  })
  .strict();

export type AiSearchRequest = z.infer<typeof AiSearchRequestSchema>;

export const AiRankingResponseSchema = z.object({
  results: z.array(
    z.object({
      // Gemini sometimes returns numeric IDs as strings despite the response schema.
      boxId: z.coerce.number().int().positive(),
      confidenceScore: z.coerce.number().min(0).max(1),
      explanation: z
        .string()
        .trim()
        .min(1)
        .transform((value) => (value.length > 200 ? value.slice(0, 200) : value)),
    }),
  ),
});

export type AiRankingResponse = z.infer<typeof AiRankingResponseSchema>;
