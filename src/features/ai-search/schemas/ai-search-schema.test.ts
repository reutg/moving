import assert from "node:assert/strict";
import { test } from "node:test";

import {
  AiRankingResponseSchema,
  AiSearchRequestSchema,
  DEFAULT_RESULT_LIMIT,
  MAX_QUERY_LENGTH,
} from "@/features/ai-search/schemas/ai-search-schema";

test("valid request parses and normalizes whitespace", () => {
  const parsed = AiSearchRequestSchema.parse({ moveId: 1, query: "  copper   whisk  " });

  assert.equal(parsed.query, "copper whisk");
  assert.equal(parsed.moveId, 1);
  assert.equal(parsed.limit, DEFAULT_RESULT_LIMIT);
});

test("empty query is rejected", () => {
  assert.equal(AiSearchRequestSchema.safeParse({ moveId: 1, query: "" }).success, false);
});

test("whitespace-only query is rejected", () => {
  assert.equal(AiSearchRequestSchema.safeParse({ moveId: 1, query: "    " }).success, false);
});

test("query longer than the maximum is rejected", () => {
  const longQuery = "a".repeat(MAX_QUERY_LENGTH + 1);
  assert.equal(AiSearchRequestSchema.safeParse({ moveId: 1, query: longQuery }).success, false);
});

test("moveId must be a positive integer", () => {
  assert.equal(AiSearchRequestSchema.safeParse({ moveId: 0, query: "whisk" }).success, false);
  assert.equal(AiSearchRequestSchema.safeParse({ moveId: -3, query: "whisk" }).success, false);
  assert.equal(AiSearchRequestSchema.safeParse({ moveId: 1.5, query: "whisk" }).success, false);
});

test("limit above the maximum is rejected", () => {
  assert.equal(AiSearchRequestSchema.safeParse({ moveId: 1, query: "whisk", limit: 999 }).success, false);
});

test("client-supplied userId is rejected by the strict schema", () => {
  const result = AiSearchRequestSchema.safeParse({ moveId: 1, query: "whisk", userId: "attacker" });
  assert.equal(result.success, false);
});

test("AI ranking response rejects out-of-range confidence scores", () => {
  const result = AiRankingResponseSchema.safeParse({
    results: [{ boxId: 1, confidenceScore: 1.5, explanation: "nope" }],
  });
  assert.equal(result.success, false);
});

test("AI ranking response rejects a missing results array", () => {
  assert.equal(AiRankingResponseSchema.safeParse({}).success, false);
});

test("AI ranking response accepts a well-formed payload", () => {
  const result = AiRankingResponseSchema.safeParse({
    results: [{ boxId: 3, confidenceScore: 0.6, explanation: "may be here" }],
  });
  assert.equal(result.success, true);
});

test("AI ranking response coerces string boxIds from the model", () => {
  const result = AiRankingResponseSchema.safeParse({
    results: [{ boxId: "2", confidenceScore: "0.7", explanation: "toys may contain a doll" }],
  });
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.results[0]?.boxId, 2);
    assert.equal(result.data.results[0]?.confidenceScore, 0.7);
  }
});

test("AI ranking response truncates overly long explanations instead of rejecting", () => {
  const result = AiRankingResponseSchema.safeParse({
    results: [{ boxId: 1, confidenceScore: 0.5, explanation: "x".repeat(250) }],
  });
  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.results[0]?.explanation.length, 200);
  }
});
