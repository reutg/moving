import { useState } from "react";

import { type BoxStatus, type CommonLocationKey } from "@/constants";

import { FilterBoxesQuery } from "../services/box-service";

const toggleArrayItem = <Item,>(items: Item[], item: Item): Item[] =>
  items.includes(item) ? items.filter((currentItem) => currentItem !== item) : [...items, item];

const useFilterBoxes = () => {
  const [filters, setFilters] = useState<FilterBoxesQuery>({
    status: [],
    destinationRoom: [],
  });

  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  const handleStatusChange = (status: BoxStatus) => {
    setFilters({ ...filters, status: toggleArrayItem(filters.status, status) });
  };

  const handleDestinationRoomChange = (room: CommonLocationKey) => {
    setFilters({
      ...filters,
      destinationRoom: toggleArrayItem(filters.destinationRoom, room),
    });
  };

  return {
    filters,
    searchValue,
    handleSearch,
    handleStatusChange,
    handleDestinationRoomChange,
  };
};

export default useFilterBoxes;
