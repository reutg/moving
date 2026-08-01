import NoResults from "@/features/search/components/no-results";

import type { AiBoxSearchResponse } from "../types/ai-box-search-result";

import EmptySearch from "./empty-search";
import SearchResultItem from "./search-result-item";
import SearchingSkeleton from "./searching-skeleton";

type AiSearchContentProps = {
  searchValue: string;
  isSearching: boolean;
  searchResults?: AiBoxSearchResponse;
};

const AiSearchContent = ({ searchValue, isSearching, searchResults }: AiSearchContentProps) => {
  if (isSearching) return <SearchingSkeleton />;
  if (!searchValue) return <EmptySearch />;

  if (searchResults && searchResults.totalResults > 0) {
    return (
      <>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground text-sm font-light">
            {searchResults.totalResults} results for
          </span>
          <span className="text-sm font-semibold">&quot;{searchValue}&quot;</span>
        </div>
        <div className="flex flex-col gap-4">
          {searchResults.results?.map((result) => (
            <SearchResultItem key={result.boxId} result={result} />
          ))}
        </div>
      </>
    );
  }

  return <NoResults searchValue={searchValue} />;
};

export default AiSearchContent;
