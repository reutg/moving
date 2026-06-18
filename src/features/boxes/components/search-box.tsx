"use client";

import { useState } from "react";

import { Funnel, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import FilterBoxes from "./boxes-list/filter-boxes";

const SearchBox = () => {
  const [value, setValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <div className="flex items-center gap-2">
      <InputGroup>
        <InputGroupInput placeholder="Search..." />
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
      </InputGroup>
      <Button
        size="icon"
        aria-label="Submit"
        variant="secondary"
        onClick={() => setIsFilterOpen(true)}
      >
        <Funnel />
      </Button>
      <FilterBoxes isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
};

export default SearchBox;
