"use client";

import { Sparkles } from "lucide-react";

import NoResults from "@/features/search/components/no-results";

import Button from "@/components/button";
import ClearButton from "@/components/inputs/clear-button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import useAiSearch from "../hooks/use-ai-search";

import EmptySearch from "./empty-search";
import SearchResultItem from "./search-result-item";
import SearchingSkeleton from "./searching-skeleton";

interface AiSearchContainerProps {}

const AiSearchContainer: React.FC<AiSearchContainerProps> = ({}) => {
  const { searchValue, isSearching, handleSearch, clearSearch, searchResults } = useAiSearch();

  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="flex w-full items-center gap-2">
        <Field>
          <InputGroup>
            <InputGroupInput
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="What are you looking for?"
            />

            <InputGroupAddon align="inline-end">
              <ClearButton
                clearSearch={clearSearch}
                isSearching={isSearching}
                searchValue={searchValue}
              />
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Button variant="default" size="icon-lg">
          <Sparkles className="size-5" />
        </Button>
      </div>

      {searchValue &&
        !isSearching &&
        (searchResults?.totalResults && searchResults.totalResults > 0 ? (
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
        ) : (
          <NoResults searchValue={searchValue} />
        ))}

      {!searchValue && !isSearching && <EmptySearch />}
      {isSearching && <SearchingSkeleton />}
    </div>
  );
};

export default AiSearchContainer;
