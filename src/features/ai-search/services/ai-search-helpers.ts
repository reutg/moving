import type { BoxStatus } from "@/constants";

import type {
  AiBoxSearchResponse,
  AiBoxSearchResult,
  AiSearchConfidence,
} from "@/features/ai-search/types/ai-box-search-result";

export const CANDIDATE_LIMIT = 25;
export const CANDIDATE_LIMIT_NO_TEXT_OVERLAP = 50;
export const CONFIDENCE_HIGH_THRESHOLD = 0.75;
export const CONFIDENCE_MEDIUM_THRESHOLD = 0.45;
export const EXACT_CONFIDENCE_SCORE = 1;

export type SearchableBox = {
  boxId: number;
  boxNumber: number;
  boxName: string;
  description: string;
  contents: string[];
  roomId: number | null;
  roomKey: string | null;
  roomLabel: string | null;
  sourceRoom: string | null;
  status: BoxStatus;
};

export type AiSearchCandidate = {
  boxId: number;
  boxNumber: number;
  boxName: string;
  roomName: string | null;
  description: string;
  contents: string[];
};

export type AiRankingResult = {
  boxId: number;
  confidenceScore: number;
  explanation: string;
};

export type RankWithAi = (
  query: string,
  candidates: AiSearchCandidate[],
) => Promise<AiRankingResult[]>;

export const collapseWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();

export const normalizeSearchQuery = (value: string): string =>
  collapseWhitespace(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export const parseContents = (description: string): string[] =>
  description
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0);

export const mapConfidenceScore = (score: number): AiSearchConfidence => {
  if (score >= CONFIDENCE_HIGH_THRESHOLD) return "high";
  if (score >= CONFIDENCE_MEDIUM_THRESHOLD) return "medium";
  return "low";
};

const buildHaystack = (box: SearchableBox): string =>
  normalizeSearchQuery(
    [
      box.boxName,
      box.description,
      box.roomLabel ?? "",
      box.roomKey ?? "",
      box.sourceRoom ?? "",
      ...box.contents,
    ].join(" "),
  );

const textOverlapScore = (box: SearchableBox, normalizedQuery: string): number => {
  const haystack = buildHaystack(box);
  if (haystack.includes(normalizedQuery)) return normalizedQuery.length + 1;

  const tokens = normalizedQuery.split(" ").filter((token) => token.length >= 2);
  return tokens.reduce((score, token) => (haystack.includes(token) ? score + 1 : score), 0);
};

export const findExactItemMatches = (
  boxes: SearchableBox[],
  normalizedQuery: string,
): AiBoxSearchResult[] => {
  const results: AiBoxSearchResult[] = [];

  for (const box of boxes) {
    const matchedItems = box.contents.filter(
      (item) => normalizeSearchQuery(item) === normalizedQuery,
    );

    if (matchedItems.length === 0) continue;

    results.push({
      boxId: box.boxId,
      boxNumber: box.boxNumber,
      boxName: box.boxName,
      roomId: box.roomId,
      roomName: box.roomKey,
      matchType: "exact",
      confidence: "high",
      confidenceScore: EXACT_CONFIDENCE_SCORE,
      matchedItems: [...new Set(matchedItems)],
      explanation: null,
    });
  }

  return results;
};

export const findSearchCandidates = (
  boxes: SearchableBox[],
  normalizedQuery: string,
  excludedBoxIds: ReadonlySet<number>,
  limit: number = CANDIDATE_LIMIT,
): SearchableBox[] => {
  const eligible = boxes.filter((box) => !excludedBoxIds.has(box.boxId));

  const scored = eligible.map((box) => ({
    box,
    score: textOverlapScore(box, normalizedQuery),
  }));

  const hasTextOverlap = scored.some((entry) => entry.score > 0);

  // Text overlap ranks obvious candidates first, but category inference (e.g. "doll"
  // → "toys") requires sending boxes with score 0 to the model. When nothing
  // overlaps the query, widen the candidate window so those boxes are not dropped
  // solely because of box-number ordering.
  const effectiveLimit = hasTextOverlap
    ? limit
    : Math.max(limit, CANDIDATE_LIMIT_NO_TEXT_OVERLAP);

  return scored
    .sort(
      (first, second) =>
        second.score - first.score || first.box.boxNumber - second.box.boxNumber,
    )
    .slice(0, effectiveLimit)
    .map((entry) => entry.box);
};

export const toAiCandidates = (boxes: SearchableBox[]): AiSearchCandidate[] =>
  boxes.map((box) => ({
    boxId: box.boxId,
    boxNumber: box.boxNumber,
    boxName: box.boxName,
    roomName: box.roomLabel,
    description: box.description,
    contents: box.contents,
  }));

export const validateAiRankingResults = (
  results: AiRankingResult[],
  candidateBoxIds: ReadonlySet<number>,
): AiRankingResult[] => {
  const highestByBoxId = new Map<number, AiRankingResult>();

  for (const result of results) {
    const isKnownBox = candidateBoxIds.has(result.boxId);
    const isValidScore = Number.isFinite(result.confidenceScore) && result.confidenceScore >= 0;

    if (!isKnownBox || !isValidScore) continue;

    const existing = highestByBoxId.get(result.boxId);
    if (!existing || result.confidenceScore > existing.confidenceScore) {
      highestByBoxId.set(result.boxId, result);
    }
  }

  return [...highestByBoxId.values()];
};

export const buildPossibleMatches = (
  candidates: SearchableBox[],
  rankingResults: AiRankingResult[],
): AiBoxSearchResult[] => {
  const candidateById = new Map(candidates.map((box) => [box.boxId, box]));

  const matches: AiBoxSearchResult[] = [];

  for (const result of rankingResults) {
    const box = candidateById.get(result.boxId);
    if (!box) continue;

    matches.push({
      boxId: box.boxId,
      boxNumber: box.boxNumber,
      boxName: box.boxName,
      roomId: box.roomId,
      roomName: box.roomKey,
      matchType: "possible",
      confidence: mapConfidenceScore(result.confidenceScore),
      confidenceScore: result.confidenceScore,
      matchedItems: [],
      explanation: collapseWhitespace(result.explanation),
    });
  }

  return matches;
};

export const mergeAndRankResults = (
  exactMatches: AiBoxSearchResult[],
  possibleMatches: AiBoxSearchResult[],
  limit: number,
): AiBoxSearchResult[] => {
  const rankedExact = [...exactMatches].sort((first, second) => first.boxNumber - second.boxNumber);

  const rankedPossible = [...possibleMatches].sort(
    (first, second) =>
      second.confidenceScore - first.confidenceScore || first.boxNumber - second.boxNumber,
  );

  const seenBoxIds = new Set<number>();
  const merged: AiBoxSearchResult[] = [];

  for (const result of [...rankedExact, ...rankedPossible]) {
    if (seenBoxIds.has(result.boxId)) continue;
    seenBoxIds.add(result.boxId);
    merged.push(result);
  }

  return merged.slice(0, limit);
};

const buildResponse = (query: string, results: AiBoxSearchResult[]): AiBoxSearchResponse => {
  const exactMatchCount = results.filter((result) => result.matchType === "exact").length;

  return {
    query,
    totalResults: results.length,
    exactMatchCount,
    possibleMatchCount: results.length - exactMatchCount,
    results,
  };
};

type RunAiBoxSearchParams = {
  query: string;
  boxes: SearchableBox[];
  limit: number;
  rankWithAi: RankWithAi;
};

export const runAiBoxSearch = async ({
  query,
  boxes,
  limit,
  rankWithAi,
}: RunAiBoxSearchParams): Promise<AiBoxSearchResponse> => {
  const normalizedQuery = normalizeSearchQuery(query);

  const exactMatches = findExactItemMatches(boxes, normalizedQuery);
  const exactBoxIds = new Set(exactMatches.map((match) => match.boxId));

  const candidates = findSearchCandidates(boxes, normalizedQuery, exactBoxIds, CANDIDATE_LIMIT);

  let possibleMatches: AiBoxSearchResult[] = [];

  if (candidates.length > 0) {
    try {
      const rankingResults = await rankWithAi(query, toAiCandidates(candidates));
      const candidateBoxIds = new Set(candidates.map((candidate) => candidate.boxId));
      const validatedResults = validateAiRankingResults(rankingResults, candidateBoxIds);
      possibleMatches = buildPossibleMatches(candidates, validatedResults);
    } catch {
      // Exact matches (if any) are still returned. Provider/parse failures are logged
      // inside rankCandidatesWithAi before rethrowing.
      possibleMatches = [];
    }
  }

  const rankedResults = mergeAndRankResults(exactMatches, possibleMatches, limit);

  return buildResponse(query, rankedResults);
};
