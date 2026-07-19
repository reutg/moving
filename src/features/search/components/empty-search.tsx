"use client";

import { SearchIcon } from "lucide-react";

import IconTile from "@/components/ui/icon-tile";

interface EmptySearchProps {}

const EmptySearch: React.FC<EmptySearchProps> = ({}) => {
  return (
    <div className="flex-container items-center justify-center py-10">
      <IconTile icon={SearchIcon} variant="outline" size="lg" iconColor="var(--primary)" />
      <div className="flex flex-col gap-2 text-center">
        <h5 className="text-lg font-medium">Find anything you packed</h5>
        <p className="text-subtle-foreground text-sm font-thin">
          Search by item name, box number, or room name across everything you&apos;ve logged.
        </p>
      </div>
    </div>
  );
};

export default EmptySearch;
