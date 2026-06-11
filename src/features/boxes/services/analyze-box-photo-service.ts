import "server-only";

import { Type } from "@google/genai";
import { z } from "zod";

import { COMMON_LOCATIONS, type CommonLocationKey } from "@/constants";
import { gemini } from "@/lib/ai/gemini";
import { internal } from "@/lib/errors";

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

const PROMPT = `You are labelling a moving box from a photo of its contents.

Survey ALL visible items before labelling. Treat the box as a whole, not as its most prominent item.

Name (2-4 words, title case):
- If MOST items belong to the same brand or franchise, use that name (e.g. "Paw Patrol Toys", "Lego Sets").
- Otherwise, name the box by the dominant category covering the items (e.g. "Board Games", "Kitchen Knives", "Toy Cars").
- No filler words ("Assortment", "Collection", "Various", "Miscellaneous").

Description (one short sentence, 15-20 words):
- Mention the main items collectively. Do not focus on a single item if several distinct ones are visible.
- Describe the ITEMS ONLY. Never mention the box, bin, container, or photo. Never say items are stored, kept, contained, or placed.
- Do not invent items you cannot see.

Destination room (optional):
- Pick the most likely room these items belong in from this list:
${LOCATION_LIST}
- Reply with the exact key (e.g. "kitchen"), NOT the label.
- Return null if you are not confident. Do not guess.

Examples:
{ "name": "Board Games", "description": "Super Wings puzzle, a chess set, two card games, and a small Tetris travel game.", "destinationRoom": "livingRoom" }
{ "name": "Paw Patrol Toys", "description": "Paw Patrol rescue vehicles, three pup figurines, and a fold-out lookout tower.", "destinationRoom": "kidsRoom" }
{ "name": "Mixed Cables", "description": "A bundle of HDMI, USB, and power cables of various lengths.", "destinationRoom": null }

Reply strictly as JSON matching the schema.`;

type AnalyzeBoxPhotoInput = {
  data: string;
  mimeType: string;
};

export const analyzeBoxPhoto = async (input: AnalyzeBoxPhotoInput): Promise<BoxPhotoAnalysis> => {
  const response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          { inlineData: { data: input.data, mimeType: input.mimeType } },
          { text: PROMPT },
        ],
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
};
