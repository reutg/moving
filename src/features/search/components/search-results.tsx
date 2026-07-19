"use client";

import type { BoxSearchResult } from "@/features/boxes/services/box-service";

import { SectionSubheader } from "@/components/ui/text";

import BoxResult from "./box-result";
import ItemResult from "./item-result";

interface SearchResultsProps {
  searchValue: string;
  searchResults: BoxSearchResult;
}

const SearchResults: React.FC<SearchResultsProps> = ({ searchValue, searchResults }) => {
  const { items, boxes, totalCount } = searchResults;

  return (
    <div className="flex-container py-3">
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground text-sm font-light">{totalCount} results for</span>
        <span className="text-sm font-semibold">&quot;{searchValue}&quot;</span>
      </div>
      <div className="flex flex-col gap-2">
        <SectionSubheader>Items</SectionSubheader>
        {items.map((item, index) => (
          <ItemResult key={index} item={item} searchValue={searchValue} />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <SectionSubheader>Boxes</SectionSubheader>
        {boxes.map((box, index) => (
          <BoxResult key={index} box={box} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
