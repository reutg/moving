"use client";

import { Loader2, Search } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import type { Box } from "@/lib/db/schema";

import { useSearchBox } from "../hooks/use-search-box";

type SearchBoxProps = {
  initialBoxes?: Box[];
};

const SearchBox = ({ initialBoxes }: SearchBoxProps) => {
  const { value, handleChange, boxes, isSearching } = useSearchBox({ initialBoxes });

  return (
    <>
      <div className="flex items-center gap-2">
        <InputGroup>
          <InputGroupInput
            value={value}
            onChange={handleChange}
            placeholder="Search boxes, items, rooms..."
          />
          <InputGroupAddon align="inline-end">
            {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
          </InputGroupAddon>
        </InputGroup>
      </div>
    </>
  );
};

export default SearchBox;
