"use client";

import { Loader2, Search, XIcon } from "lucide-react";

import Button from "@/components/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import { useSearchBox } from "../hooks/use-search-box";

import EmptySearch from "./empty-search";
import NoResults from "./no-results";
import SearchResults from "./search-results";

const SearchContainer = () => {
  const { searchValue, handleSearch, clearSearch, isSearching, searchResults } = useSearchBox();

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full items-center">
        <Field>
          <InputGroup>
            <InputGroupAddon>
              <Search className="text-primary size-5" />
            </InputGroupAddon>
            <InputGroupInput
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search boxes, items, rooms..."
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
        <ButtonLink variant="ghost" className="text-primary font-normal" href="/">
          Cancel
        </ButtonLink>
      </div>
      {(searchValue === "" || !searchValue) && <EmptySearch />}

      {searchValue && searchResults && searchResults.totalCount === 0 && (
        <NoResults searchValue={searchValue} />
      )}

      {searchResults && searchResults.totalCount > 0 && (
        <SearchResults searchValue={searchValue} searchResults={searchResults} />
      )}
    </div>
  );
};

export default SearchContainer;

const ClearButton = ({
  clearSearch,
  isSearching,
  searchValue,
}: {
  clearSearch: () => void;
  isSearching: boolean;
  searchValue: string;
}) => {
  if (!searchValue) return null;
  return isSearching ? (
    <Loader2 className="animate-spin" />
  ) : (
    <Button variant="ghost" size="icon-xs" onClick={clearSearch} className="bg-input-border">
      <XIcon />
    </Button>
  );
};
