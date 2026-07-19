"use client";

import { useEffect, useMemo, useState } from "react";

import { debounce } from "lodash";

import type { ApiResponse } from "@/lib/api/response";

import type { BoxSearchResult } from "@/features/boxes/services/box-service";

const SEARCH_DEBOUNCE_MS = 300;

export const useSearchBox = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BoxSearchResult | null>(null);

  const fetchResults = async (value: string) => {
    setIsSearching(true);

    try {
      const response = await fetch(`/api/boxes/search?query=${value}`, {
        headers: { "content-type": "application/json" },
      });
      const json: ApiResponse<BoxSearchResult> = await response.json();

      if (!json.ok) {
        return;
      }

      setSearchResults(json.data);
    } catch {
      // ignore aborted or failed searches
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetchResults, SEARCH_DEBOUNCE_MS), []);

  useEffect(() => debouncedFetch.cancel, [debouncedFetch]);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (!value.trim()) {
      debouncedFetch.cancel();
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    debouncedFetch(value);
  };

  const clearSearch = () => {
    debouncedFetch.cancel();
    setSearchValue("");
    setSearchResults(null);
    setIsSearching(false);
  };

  return {
    searchValue,
    isSearching,
    searchResults,
    handleSearch,
    clearSearch,
  };
};
