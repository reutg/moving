"use client";

import { SwatchBook } from "lucide-react";

import { COMMON_LOCATIONS } from "@/constants";

import type { BoxSearchItemResult } from "@/features/boxes/types/box-search-result";

import { Card, CardContent } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";
import SeparatorDot from "@/components/ui/separator-dot";

import HighlightedText from "./highlighted-text";

interface ItemResultProps {
  item: BoxSearchItemResult;
  searchValue: string;
}

const ItemResult: React.FC<ItemResultProps> = ({ item, searchValue }) => {
  const roomLabel = COMMON_LOCATIONS[item.room as keyof typeof COMMON_LOCATIONS] ?? item.room;
  const backgroundColor = "var(--background)";
  const iconColor = "var(--field-label)";
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <IconTile
            icon={SwatchBook}
            backgroundColor={backgroundColor}
            iconColor={iconColor}
            size="sm"
          />

          <div className="flex flex-col gap-1 text-base">
            <HighlightedText text={item.item} search={searchValue} />
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <span>Box {item.boxNumber}</span>
              <SeparatorDot />
              <span>{roomLabel}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemResult;
