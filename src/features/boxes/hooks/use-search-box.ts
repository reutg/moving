"use client";

import debounce from "lodash/debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { ApiResponse } from "@/lib/api/response";
import type { Box } from "@/lib/db/schema";

type UseSearchBoxOptions = {
  initialBoxes?: Box[];
  debounceMs?: number;
};

export const useSearchBox = ({ initialBoxes = [], debounceMs = 300 }: UseSearchBoxOptions = {}) => {
  const [value, setValue] = useState("");
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const initialBoxesRef = useRef(initialBoxes);
  initialBoxesRef.current = initialBoxes;

  const runSearch = useCallback(async (query: string) => {
    const trimmed = query.trim();

    if (!trimmed) {
      abortControllerRef.current?.abort();
      setBoxes(initialBoxesRef.current);
      setError(null);
      setIsSearching(false);
      return;
    }

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(`/api/boxes/search?query=${encodeURIComponent(trimmed)}`, {
        signal: controller.signal,
      });
      const json: ApiResponse<Box[]> = await response.json();

      if (!json.ok) {
        setError(json.error.message);
        return;
      }

      setBoxes(json.data);
    } catch (cause) {
      if (cause instanceof Error && cause.name === "AbortError") {
        return;
      }

      setError(cause instanceof Error ? cause.message : "Search failed.");
    } finally {
      if (!controller.signal.aborted) {
        setIsSearching(false);
      }
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((query: string) => void runSearch(query), debounceMs),
    [debounceMs, runSearch],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
      abortControllerRef.current?.abort();
    };
  }, [debouncedSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    setValue(nextValue);

    if (!nextValue.trim()) {
      debouncedSearch.cancel();
      void runSearch("");
      return;
    }

    debouncedSearch(nextValue);
  };

  return {
    value,
    handleChange,
    boxes,
    isSearching,
    error,
  };
};
