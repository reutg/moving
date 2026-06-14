import "server-only";

import { Type } from "@google/genai";
import { z } from "zod";

import { COMMON_LOCATIONS, type CommonLocationKey } from "@/constants";
import { gemini } from "@/lib/ai/gemini";
import { internal, isAppError, serviceUnavailable } from "@/lib/errors";
import { logger } from "@/lib/logger";

const LOCATION_KEYS = Object.keys(COMMON_LOCATIONS) as [CommonLocationKey, ...CommonLocationKey[]];

const BoxPhotoAnalysisSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(500),
  destinationRoom: z.enum(LOCATION_KEYS).nullish(),
});

export type BoxPhotoAnalysis = z.infer<typeof BoxPhotoAnalysisSchema>;

const LOCATION_LIST = (Object.entries(COMMON_LOCATIONS) as [CommonLocationKey, string][])
  .map(([key, label]) => `- "${key}" (${label})`)
  .join("\n");

const PROMPT = `Label a moving box from this photo.
Name: 2-4 words, title case. Use a common brand or franchise if most items belong to one (e.g. "Paw Patrol Toys", "Lego Sets"); otherwise the dominant item category (e.g. "Board Games", "Kitchen Knives"). No filler ("Assortment", "Various", "Misc").
Description: a comma-separated list of items. No sentences, no verbs, no counts, no quantifiers, no mention of the box, container, or photo. Group identical or near-identical items into one plural entry (e.g. "mugs"; "Paw Patrol cars"; "pots and pans"). Do not invent items.
Destination room: pick the key these items most likely belong in. Return null if unsure.
${LOCATION_LIST}

Examples:
{ "name": "Board Games", "description": "Super Wings puzzle; chess set; card games; Tetris travel game", "destinationRoom": "livingRoom" }
{ "name": "Paw Patrol Toys", "description": "Paw Patrol rescue vehicles; pup figurines; fold-out lookout tower", "destinationRoom": "kidsRoom" }
{ "name": "Mixed Cables", "description": "HDMI cables; USB cables; power cables", "destinationRoom": null }

Reply as JSON matching the schema.`;

type AnalyzeBoxPhotoInput = {
  data: string;
  mimeType: string;
};

// Gemini surfaces transient capacity issues with 429/503 codes or
// "UNAVAILABLE"/"overloaded" status strings. Treat those as retryable
// upstream outages rather than internal bugs.
const isUpstreamUnavailable = (err: unknown): boolean => {
  if (!(err instanceof Error)) return false;
  const message = err.message.toLowerCase();
  return (
    message.includes("unavailable") ||
    message.includes("overloaded") ||
    message.includes("\"code\":503") ||
    message.includes("\"code\":429")
  );
};

export const analyzeBoxPhoto = async (input: AnalyzeBoxPhotoInput): Promise<BoxPhotoAnalysis> => {
  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ inlineData: { data: input.data, mimeType: input.mimeType } }, { text: PROMPT }],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            destinationRoom: {
              type: Type.STRING,
              enum: [...LOCATION_KEYS],
              nullable: true,
            },
          },
          required: ["name", "description"],
        },
      },
    });

    const text = response.text;
    if (!text) throw internal("Gemini returned an empty response");

    const json: unknown = JSON.parse(text);
    return BoxPhotoAnalysisSchema.parse(json);
  } catch (err) {
    if (isAppError(err)) throw err;

    logger.error("Failed to analyze box photo", { error: err });

    if (isUpstreamUnavailable(err)) {
      throw serviceUnavailable(
        "Image analysis is busy right now. Please try again in a moment.",
        err,
      );
    }

    throw internal("We couldn't analyze this photo. Please try again.", err);
  }
};
