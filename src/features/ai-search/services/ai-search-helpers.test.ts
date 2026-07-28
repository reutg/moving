import assert from "node:assert/strict";
import { test } from "node:test";

import {
  type AiRankingResult,
  findExactItemMatches,
  findSearchCandidates,
  mapConfidenceScore,
  mergeAndRankResults,
  normalizeSearchQuery,
  type RankWithAi,
  runAiBoxSearch,
  type SearchableBox,
} from "@/features/ai-search/services/ai-search-helpers";
import type { AiBoxSearchResult } from "@/features/ai-search/types/ai-box-search-result";

const makeBox = (overrides: Partial<SearchableBox> & Pick<SearchableBox, "boxId">): SearchableBox => ({
  boxNumber: overrides.boxId,
  boxName: `Box #${overrides.boxId}`,
  description: "",
  contents: [],
  roomId: null,
  roomKey: null,
  roomLabel: null,
  sourceRoom: null,
  status: "packing",
  ...overrides,
});

const rankReturning =
  (results: AiRankingResult[]): RankWithAi =>
  async () =>
    results;

const rankThatFails: RankWithAi = async () => {
  throw new Error("ai unavailable");
};

const rankNeverCalled: RankWithAi = async () => {
  throw new Error("rankWithAi should not have been called");
};

const kitchenBox = makeBox({
  boxId: 1,
  boxNumber: 1,
  boxName: "Kitchen Tools",
  description: "cooking utensils, pots, pans",
  contents: ["cooking utensils", "pots", "pans"],
  roomId: 10,
  roomKey: "kitchen",
  roomLabel: "Kitchen",
});

const bedroomBox = makeBox({
  boxId: 2,
  boxNumber: 2,
  boxName: "Bedding",
  description: "sheets, pillows, whisk",
  contents: ["sheets", "pillows", "whisk"],
  roomId: 11,
  roomKey: "bedroom",
  roomLabel: "Bedroom",
});

test("exact item match returns the box as an exact match", () => {
  const results = findExactItemMatches([bedroomBox], normalizeSearchQuery("whisk"));

  assert.equal(results.length, 1);
  assert.equal(results[0]?.boxId, 2);
  assert.equal(results[0]?.matchType, "exact");
  assert.equal(results[0]?.confidence, "high");
  assert.equal(results[0]?.roomName, "bedroom");
  assert.deepEqual(results[0]?.matchedItems, ["whisk"]);
});

test("exact match is case-insensitive", () => {
  const results = findExactItemMatches([bedroomBox], normalizeSearchQuery("WHISK"));

  assert.equal(results.length, 1);
  assert.equal(results[0]?.boxId, 2);
});

test("whitespace and punctuation are normalized before matching", () => {
  const box = makeBox({
    boxId: 3,
    contents: ["Whisk"],
  });

  const results = findExactItemMatches([box], normalizeSearchQuery("  whisk!  "));
  assert.equal(results.length, 1);
  assert.equal(normalizeSearchQuery("  Cooking   Utensils  "), "cooking utensils");
});

test("mapConfidenceScore uses documented thresholds", () => {
  assert.equal(mapConfidenceScore(0.9), "high");
  assert.equal(mapConfidenceScore(0.75), "high");
  assert.equal(mapConfidenceScore(0.6), "medium");
  assert.equal(mapConfidenceScore(0.45), "medium");
  assert.equal(mapConfidenceScore(0.2), "low");
});

test("exact matches are ranked before possible matches", () => {
  const exact: AiBoxSearchResult[] = [
    {
      boxId: 5,
      boxNumber: 5,
      boxName: "Utensils",
      roomId: null,
      roomName: "Kitchen",
      matchType: "exact",
      confidence: "high",
      confidenceScore: 1,
      matchedItems: ["whisk"],
      explanation: null,
    },
  ];
  const possible: AiBoxSearchResult[] = [
    {
      boxId: 6,
      boxNumber: 6,
      boxName: "Baking",
      roomId: null,
      roomName: "Kitchen",
      matchType: "possible",
      confidence: "high",
      confidenceScore: 0.95,
      matchedItems: [],
      explanation: "may be here",
    },
  ];

  const ranked = mergeAndRankResults(exact, possible, 10);
  assert.equal(ranked[0]?.matchType, "exact");
  assert.equal(ranked[1]?.matchType, "possible");
});

test("possible matches are sorted by descending confidence score", () => {
  const possible: AiBoxSearchResult[] = [
    { ...basePossible(7), confidenceScore: 0.4, confidence: "low" },
    { ...basePossible(8), confidenceScore: 0.9, confidence: "high" },
    { ...basePossible(9), confidenceScore: 0.6, confidence: "medium" },
  ];

  const ranked = mergeAndRankResults([], possible, 10);
  assert.deepEqual(
    ranked.map((result) => result.boxId),
    [8, 9, 7],
  );
});

test("duplicate boxes are removed, keeping the exact match", () => {
  const exact: AiBoxSearchResult[] = [
    {
      boxId: 10,
      boxNumber: 10,
      boxName: "Kitchen",
      roomId: null,
      roomName: "Kitchen",
      matchType: "exact",
      confidence: "high",
      confidenceScore: 1,
      matchedItems: ["whisk"],
      explanation: null,
    },
  ];
  const possible: AiBoxSearchResult[] = [basePossible(10)];

  const ranked = mergeAndRankResults(exact, possible, 10);
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0]?.matchType, "exact");
});

test("runAiBoxSearch returns a possible match inferred from box metadata", async () => {
  const response = await runAiBoxSearch({
    query: "whisk",
    boxes: [kitchenBox],
    limit: 20,
    rankWithAi: rankReturning([
      { boxId: 1, confidenceScore: 0.8, explanation: "This box holds cooking utensils, so a whisk may be here." },
    ]),
  });

  assert.equal(response.exactMatchCount, 0);
  assert.equal(response.possibleMatchCount, 1);
  assert.equal(response.results[0]?.boxId, 1);
  assert.equal(response.results[0]?.matchType, "possible");
  assert.equal(response.results[0]?.confidence, "high");
});

test("runAiBoxSearch ignores AI results for unknown box ids", async () => {
  const response = await runAiBoxSearch({
    query: "whisk",
    boxes: [kitchenBox],
    limit: 20,
    rankWithAi: rankReturning([
      { boxId: 999, confidenceScore: 0.9, explanation: "hallucinated box" },
      { boxId: 1, confidenceScore: 0.5, explanation: "may be here" },
    ]),
  });

  assert.equal(response.totalResults, 1);
  assert.equal(response.results[0]?.boxId, 1);
});

test("runAiBoxSearch returns exact matches when AI ranking fails", async () => {
  const response = await runAiBoxSearch({
    query: "whisk",
    boxes: [bedroomBox, kitchenBox],
    limit: 20,
    rankWithAi: rankThatFails,
  });

  assert.equal(response.exactMatchCount, 1);
  assert.equal(response.possibleMatchCount, 0);
  assert.equal(response.results[0]?.boxId, 2);
});

test("runAiBoxSearch never calls the AI when there are no candidate boxes", async () => {
  const emptyResponse = await runAiBoxSearch({
    query: "whisk",
    boxes: [],
    limit: 20,
    rankWithAi: rankNeverCalled,
  });

  assert.equal(emptyResponse.totalResults, 0);
});

test("runAiBoxSearch returns an empty successful response when nothing matches", async () => {
  const response = await runAiBoxSearch({
    query: "spaceship",
    boxes: [],
    limit: 20,
    rankWithAi: rankNeverCalled,
  });

  assert.deepEqual(response, {
    query: "spaceship",
    totalResults: 0,
    exactMatchCount: 0,
    possibleMatchCount: 0,
    results: [],
  });
});

test("runAiBoxSearch only returns boxes from the provided move set", async () => {
  const response = await runAiBoxSearch({
    query: "whisk",
    boxes: [kitchenBox, bedroomBox],
    limit: 20,
    rankWithAi: rankReturning([
      { boxId: 1, confidenceScore: 0.7, explanation: "may be here" },
      { boxId: 4242, confidenceScore: 0.99, explanation: "box from another move" },
    ]),
  });

  const allowedBoxIds = new Set([1, 2]);
  for (const result of response.results) {
    assert.ok(allowedBoxIds.has(result.boxId), `unexpected box ${result.boxId}`);
  }
});

test("results are limited by the requested limit", async () => {
  const manyBoxes = Array.from({ length: 8 }, (_, index) =>
    makeBox({ boxId: index + 1, boxNumber: index + 1, boxName: "Kitchen", contents: ["mug"] }),
  );

  const response = await runAiBoxSearch({
    query: "kitchen",
    boxes: manyBoxes,
    limit: 3,
    rankWithAi: rankReturning(
      manyBoxes.map((box) => ({ boxId: box.boxId, confidenceScore: 0.5, explanation: "may be here" })),
    ),
  });

  assert.equal(response.results.length, 3);
});

test("normalizeSearchQuery keeps doll unchanged", () => {
  assert.equal(normalizeSearchQuery("  Doll  "), "doll");
  assert.equal(normalizeSearchQuery("DOLL"), "doll");
});

test("findSearchCandidates includes toys boxes for doll without requiring text overlap", () => {
  const toysCategory = makeBox({
    boxId: 2,
    boxName: "Playroom",
    description: "toys, games",
    contents: ["toys", "games"],
    roomKey: "kidsRoom",
    roomLabel: "Kids Room",
  });
  const kidsToysName = makeBox({
    boxId: 3,
    boxName: "Kids toys",
    description: "stuffed animals",
    contents: ["stuffed animals"],
    roomKey: "kidsRoom",
    roomLabel: "Kids Room",
  });
  const kitchen = makeBox({
    boxId: 6,
    boxName: "Kitchen",
    description: "pots, pans",
    contents: ["pots", "pans"],
    roomKey: "kitchen",
    roomLabel: "Kitchen",
  });

  const candidates = findSearchCandidates(
    [toysCategory, kidsToysName, kitchen],
    normalizeSearchQuery("doll"),
    new Set(),
  );

  assert.ok(candidates.some((box) => box.boxId === 2));
  assert.ok(candidates.some((box) => box.boxId === 3));
});

test("findSearchCandidates keeps a late toys box when there is no text overlap", () => {
  const manyBoxes = Array.from({ length: 40 }, (_, index) =>
    makeBox({
      boxId: index + 1,
      boxNumber: index + 1,
      boxName: index === 39 ? "Kids toys" : `Misc ${index + 1}`,
      description: index === 39 ? "toys" : "papers",
      contents: index === 39 ? ["toys"] : ["papers"],
    }),
  );

  const candidates = findSearchCandidates(manyBoxes, normalizeSearchQuery("doll"), new Set(), 25);

  assert.ok(
    candidates.some((box) => box.boxId === 40),
    "toys box must remain a candidate for category inference",
  );
});

test("runAiBoxSearch returns category and synonym matches for doll", async () => {
  const dollExact = makeBox({
    boxId: 1,
    boxName: "Dolls",
    description: "doll, accessories",
    contents: ["doll", "accessories"],
    roomKey: "kidsRoom",
    roomLabel: "Kids Room",
  });
  const toysCategory = makeBox({
    boxId: 2,
    boxName: "Playroom",
    description: "toys, games",
    contents: ["toys", "games"],
    roomKey: "kidsRoom",
    roomLabel: "Kids Room",
  });
  const kidsToysName = makeBox({
    boxId: 3,
    boxName: "Kids toys",
    description: "stuffed animals",
    contents: ["stuffed animals"],
    roomKey: "kidsRoom",
    roomLabel: "Kids Room",
  });
  const kidsRoomOnly = makeBox({
    boxId: 4,
    boxName: "General kids",
    description: "misc",
    contents: ["misc"],
    roomKey: "kidsRoom",
    roomLabel: "Kids Room",
  });
  const winterClothes = makeBox({
    boxId: 5,
    boxName: "Kids winter clothes",
    description: "coats, boots",
    contents: ["coats", "boots"],
    roomKey: "kidsRoom",
    roomLabel: "Kids Room",
  });
  const kitchen = makeBox({
    boxId: 6,
    boxName: "Kitchen",
    description: "pots, pans",
    contents: ["pots", "pans"],
    roomKey: "kitchen",
    roomLabel: "Kitchen",
  });

  const response = await runAiBoxSearch({
    query: "doll",
    boxes: [dollExact, toysCategory, kidsToysName, kidsRoomOnly, winterClothes, kitchen],
    limit: 20,
    rankWithAi: async (query, candidates) => {
      assert.equal(query, "doll");
      assert.ok(candidates.some((candidate) => candidate.boxId === 2));
      assert.ok(candidates.some((candidate) => candidate.boxId === 3));
      return [
        {
          boxId: 2,
          confidenceScore: 0.7,
          explanation: "This box holds toys, so a doll may be packed here.",
        },
        {
          boxId: 3,
          confidenceScore: 0.65,
          explanation: "Kids toys may include a doll.",
        },
        {
          boxId: 4,
          confidenceScore: 0.4,
          explanation: "A kids room box might contain a doll.",
        },
      ];
    },
  });

  assert.equal(response.results[0]?.boxId, 1);
  assert.equal(response.results[0]?.matchType, "exact");
  assert.ok(response.results.some((result) => result.boxId === 2 && result.matchType === "possible"));
  assert.ok(response.results.some((result) => result.boxId === 3 && result.matchType === "possible"));
  assert.ok(response.results.some((result) => result.boxId === 4 && result.confidence === "low"));
  assert.ok(!response.results.some((result) => result.boxId === 5));
  assert.ok(!response.results.some((result) => result.boxId === 6));
});

test("runAiBoxSearch accepts synonym matches from AI ranking", async () => {
  const sofaBox = makeBox({
    boxId: 8,
    boxName: "Living room seating",
    description: "sofa, cushions",
    contents: ["sofa", "cushions"],
    roomKey: "livingRoom",
    roomLabel: "Living Room",
  });

  const response = await runAiBoxSearch({
    query: "couch",
    boxes: [sofaBox, kitchenBox],
    limit: 20,
    rankWithAi: rankReturning([
      {
        boxId: 8,
        confidenceScore: 0.8,
        explanation: "This box lists a sofa, which is likely the couch you're looking for.",
      },
    ]),
  });

  assert.equal(response.exactMatchCount, 0);
  assert.equal(response.possibleMatchCount, 1);
  assert.equal(response.results[0]?.boxId, 8);
  assert.equal(response.results[0]?.confidence, "high");
});

function basePossible(boxId: number): AiBoxSearchResult {
  return {
    boxId,
    boxNumber: boxId,
    boxName: `Box #${boxId}`,
    roomId: null,
    roomName: null,
    matchType: "possible",
    confidence: "medium",
    confidenceScore: 0.5,
    matchedItems: [],
    explanation: "may be here",
  };
}
