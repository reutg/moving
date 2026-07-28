import "server-only";

import { Type } from "@google/genai";

import { gemini } from "@/lib/ai/gemini";
import { internal } from "@/lib/errors";
import { logger } from "@/lib/logger";

import { AiRankingResponseSchema } from "@/features/ai-search/schemas/ai-search-schema";
import type {
  AiRankingResult,
  AiSearchCandidate,
} from "@/features/ai-search/services/ai-search-helpers";

const MODEL = "gemini-2.5-flash";

const buildPrompt = (query: string, candidates: AiSearchCandidate[]): string => {
  const candidateJson = JSON.stringify(candidates, null, 2);
  return `You are helping a user find an item in packed moving boxes.

Search query:
"${query}"

Candidate boxes:
${candidateJson}

Return every candidate box that could contain the searched item.

A box may match because:
- The item is explicitly listed.
- The item matches a synonym, singular/plural form, abbreviation, translation, or common alternative name.
- The item naturally belongs to one of the box's categories.
- The destination room makes the item reasonably likely.

Rules:
- Prefer explicit item matches over inferred matches.
- Categories are stronger evidence than room alone.
- Do not treat related items as synonyms.
- Omit boxes with only a weak or unlikely connection.
- Never invent or modify a boxId.
- Sort results by confidenceScore descending.

Confidence:
- 0.9–1.0: explicit item
- 0.75–0.89: synonym/equivalent
- 0.5–0.74: category inference
- 0.35–0.49: room inference

For each result include:
- boxId
- confidenceScore
- explanation

The explanation must be one short sentence explaining why the box matched. Use tentative wording for inferred matches.

Return only valid JSON matching the schema.`;
};

export const rankCandidatesWithAi = async (
  query: string,
  candidates: AiSearchCandidate[],
): Promise<AiRankingResult[]> => {
  if (candidates.length === 0) return [];

  try {
    const response = await gemini.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts: [{ text: buildPrompt(query, candidates) }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  boxId: { type: Type.NUMBER },
                  confidenceScore: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                },
                required: ["boxId", "confidenceScore", "explanation"],
              },
            },
          },
          required: ["results"],
        },
      },
    });

    const text = response.text;
    if (!text) throw internal("Gemini returned an empty response");

    const json: unknown = JSON.parse(text);
    return AiRankingResponseSchema.parse(json).results;
  } catch (err) {
    logger.warn("AI box ranking failed", { error: err instanceof Error ? err.message : "unknown" });
    throw err;
  }
};
