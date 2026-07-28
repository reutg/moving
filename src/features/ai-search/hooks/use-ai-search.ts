import { useEffect, useMemo, useState } from "react";

import { debounce } from "lodash";

import type { ApiResponse } from "@/lib/api/response";

import type { AiBoxSearchResponse } from "../types/ai-box-search-result";

const SEARCH_DEBOUNCE_MS = 300;

const useAiSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<AiBoxSearchResponse>();

  const fetchResults = async (value: string) => {
    setIsSearching(true);

    try {
      const response = await fetch(`/api/search/ai`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: value }),
      });
      const json: ApiResponse<AiBoxSearchResponse> = await response.json();

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
      setSearchResults(undefined);
      setIsSearching(false);
      return;
    }

    debouncedFetch(value);
  };

  const clearSearch = () => {
    setSearchValue("");
    setIsSearching(false);
  };

  return {
    searchResults,
    searchValue,
    isSearching,
    handleSearch,
    clearSearch,
  };
};

export default useAiSearch;
