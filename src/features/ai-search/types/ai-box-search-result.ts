export type AiSearchMatchType = "exact" | "possible";

export type AiSearchConfidence = "high" | "medium" | "low";

export type AiBoxSearchResult = {
  boxId: number;
  boxNumber: number;
  boxName: string;
  roomId: number | null;
  roomName: string | null;
  matchType: AiSearchMatchType;
  confidence: AiSearchConfidence;
  confidenceScore: number;
  matchedItems: string[];
  explanation: string | null;
};

export type AiBoxSearchResponse = {
  query: string;
  totalResults: number;
  exactMatchCount: number;
  possibleMatchCount: number;
  results: AiBoxSearchResult[];
};
