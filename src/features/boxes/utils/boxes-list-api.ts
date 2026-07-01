import type { RefObject } from "react";

import type { BoxesListFilters } from "@/features/boxes/schemas/boxes-list-schema";
import type { ApiResponse } from "@/lib/api/response";
import type { Box } from "@/lib/db/schema";

export const buildBoxesUrl = (
  status: BoxesListFilters["status"],
  moveId: number,
): string => {
  const params = new URLSearchParams({ moveId: String(moveId) });

  if (status !== "all") {
    params.set("status", status);
    return `/api/boxes/filter?${params.toString()}`;
  }

  return `/api/boxes?${params.toString()}`;
};

export const fetchBoxes = async (
  status: BoxesListFilters["status"],
  moveId: number,
  signal: AbortSignal,
): Promise<Box[]> => {
  const response = await fetch(buildBoxesUrl(status, moveId), { signal });
  const json: ApiResponse<Box[]> = await response.json();

  if (!json.ok) {
    throw new Error(json.error.message);
  }

  return json.data;
};

export const isAbortError = (cause: unknown): boolean =>
  cause instanceof Error && cause.name === "AbortError";

export const getBoxesFetchErrorMessage = (cause: unknown): string =>
  cause instanceof Error ? cause.message : "Failed to load boxes.";

export const createAbortController = (
  abortControllerRef: RefObject<AbortController | null>,
): AbortController => {
  abortControllerRef.current?.abort();
  const controller = new AbortController();
  abortControllerRef.current = controller;
  return controller;
};
