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
Name: 2-4 words, title case. Use a common brand or franchise only if most items clearly belong to one (e.g. "Lego Sets"); otherwise the dominant category (e.g. "Kitchen Cookware", "Bedding", "Office Supplies"). No filler ("Assortment", "Various", "Misc").
Description: a short comma-separated list of broad item categories — the kind of label you'd write on a moving box, not an inventory. Use general nouns only (e.g. "pots", "towels", "toys"). Do not include material, size, color, theme, or style qualifiers when a simpler category exists (prefer "pens" over "fibre pens"; "party supplies" over "dinosaur-themed party supplies"; "costumes" over "animal ear headbands"). Merge related items into one category. No sentences, no verbs, no counts, no quantifiers, no mention of the box, container, or photo. Do not invent items.
Destination room: pick the key these items most likely belong in. Return null if unsure.
${LOCATION_LIST}

Examples:
{ "name": "Kitchen Cookware", "description": "pots, pans, lids, utensils", "destinationRoom": "kitchen" }
{ "name": "Bedding", "description": "sheets, pillows, blankets", "destinationRoom": "bedroom" }
{ "name": "Office Supplies", "description": "pens, notebooks, folders", "destinationRoom": "office" }
{ "name": "Kids Toys", "description": "toys, books, puzzles", "destinationRoom": "kidsRoom" }
{ "name": "Laundry Essentials", "description": "detergent, hangers, linens", "destinationRoom": "laundryRoom" }

Reply as JSON matching the schema.`;

type AnalyzeBoxPhotoInput = {
  data: string;
  mimeType: string;
};

const isUpstreamUnavailable = (err: unknown): boolean => {
  if (!(err instanceof Error)) return false;
  const message = err.message.toLowerCase();
  return (
    message.includes("unavailable") ||
    message.includes("overloaded") ||
    message.includes('"code":503') ||
    message.includes('"code":429')
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
