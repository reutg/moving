import "server-only";

import { eq } from "drizzle-orm";

import type { CommonLocationKey } from "@/constants";
import { db } from "@/lib/db/client";
import { boxes, items, rooms } from "@/lib/db/schema";
import { logger } from "@/lib/logger";

import type { AiSearchRequest } from "@/features/ai-search/schemas/ai-search-schema";
import { rankCandidatesWithAi } from "@/features/ai-search/services/ai-ranking";
import {
  parseContents,
  runAiBoxSearch,
  type SearchableBox,
} from "@/features/ai-search/services/ai-search-helpers";
import type { AiBoxSearchResponse } from "@/features/ai-search/types/ai-box-search-result";
import { getCurrentMove, getMoveById } from "@/features/moves/services/move-service";

const loadItemNamesByBox = async (moveId: number): Promise<Map<number, string[]>> => {
  const rows = await db
    .select({ boxId: items.boxId, name: items.name })
    .from(items)
    .innerJoin(boxes, eq(items.boxId, boxes.id))
    .where(eq(boxes.moveId, moveId))
    .all();

  const namesByBox = new Map<number, string[]>();
  for (const row of rows) {
    const existing = namesByBox.get(row.boxId) ?? [];
    existing.push(row.name);
    namesByBox.set(row.boxId, existing);
  }

  return namesByBox;
};

const loadSearchableBoxes = async (moveId: number): Promise<SearchableBox[]> => {
  const [boxRows, itemNamesByBox] = await Promise.all([
    db
      .select({
        box: boxes,
        roomName: rooms.name,
        roomType: rooms.type,
      })
      .from(boxes)
      .innerJoin(rooms, eq(boxes.roomId, rooms.id))
      .where(eq(boxes.moveId, moveId))
      .all(),
    loadItemNamesByBox(moveId),
  ]);

  return boxRows.map(({ box, roomName, roomType }) => ({
    boxId: box.id,
    boxNumber: box.number,
    boxName: box.name,
    description: box.description,
    contents: [...parseContents(box.description), ...(itemNamesByBox.get(box.id) ?? [])],
    roomId: box.roomId,
    roomKey: roomType as CommonLocationKey,
    roomLabel: roomName,
    sourceRoom: box.sourceRoom,
    status: box.status,
  }));
};

const resolveMoveId = async (moveId?: number): Promise<number | null> => {
  if (moveId !== undefined) {
    const move = await getMoveById(moveId);
    return move.id;
  }

  const currentMove = await getCurrentMove();
  return currentMove?.id ?? null;
};

const emptyResponse = (query: string): AiBoxSearchResponse => ({
  query,
  totalResults: 0,
  exactMatchCount: 0,
  possibleMatchCount: 0,
  results: [],
});

export const searchBoxesWithAi = async (input: AiSearchRequest): Promise<AiBoxSearchResponse> => {
  const moveId = await resolveMoveId(input.moveId);
  if (moveId === null) {
    return emptyResponse(input.query);
  }

  const searchableBoxes = await loadSearchableBoxes(moveId);

  const response = await runAiBoxSearch({
    query: input.query,
    boxes: searchableBoxes,
    limit: input.limit,
    rankWithAi: rankCandidatesWithAi,
  });

  logger.info("AI box search completed", {
    moveId,
    totalResults: response.totalResults,
    exactMatchCount: response.exactMatchCount,
    possibleMatchCount: response.possibleMatchCount,
  });

  return response;
};
