"use client";

import { Sparkles } from "lucide-react";

import Button from "@/components/button";
import ClearButton from "@/components/inputs/clear-button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

import useAiSearch from "../hooks/use-ai-search";

import AiSearchContent from "./ai-search-content";

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

      <AiSearchContent
        searchValue={searchValue}
        isSearching={isSearching}
        searchResults={searchResults}
      />
    </div>
  );
};

export default AiSearchContainer;
