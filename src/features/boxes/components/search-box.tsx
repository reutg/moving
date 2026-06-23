"use client";

import { Loader2, Search } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import type { Box } from "@/lib/db/schema";

import BoxesList from "./boxes-list/boxes-list";
import { useSearchBox } from "../hooks/use-search-box";

type SearchBoxProps = {
  initialBoxes?: Box[];
  withResults?: boolean;
};

const SearchBox = ({ initialBoxes, withResults = false }: SearchBoxProps) => {
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
          <InputGroupAddon>
            {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
          </InputGroupAddon>
        </InputGroup>
      </div>
      {withResults ? <BoxesList boxes={boxes} /> : null}
    </>
  );
};

export default SearchBox;
