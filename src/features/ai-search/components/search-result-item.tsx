"use client";

import { Check, Sparkle } from "lucide-react";

import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import Chip from "@/components/ui/chip";
import ListItemContent from "@/components/ui/list-item-content";
import SeparatorDot from "@/components/ui/separator-dot";
import { SectionSubheader } from "@/components/ui/text";

import { useSearchResultItem } from "../hooks/use-search-result-item";
import type { AiBoxSearchResult } from "../types/ai-box-search-result";

interface SearchResultItemProps {
  result: AiBoxSearchResult;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result }) => {
  const { boxId, boxName, matchedItems, explanation, matchType } = result;

  const {
    roomLabel,
    RoomIcon,
    matchLabel,
    confidenceLabel,
    confidenceTextColor,
    chipVariant,
    explanationLabelColor,
    explanationBackground,
    explanationIconColor,
    ChipIcon,
  } = useSearchResultItem(result);

  return (
    <Card className="p-0">
      <CardContent className="p-0">
        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
            <Chip label={matchLabel} variant={chipVariant} icon={ChipIcon} />
            <span className={cn("text-sm font-medium", confidenceTextColor)}>
              {confidenceLabel}
            </span>
          </div>
          <ListItemContent
            icon={RoomIcon}
            title={boxName}
            backgroundColor="var(--background)"
            iconColor="var(--field-label)"
            description={
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-thin">Box {boxId}</span>
                  <SeparatorDot />
                  <span className="text-muted-foreground truncate">{roomLabel}</span>
                </div>
              </div>
            }
          />
        </div>

        {matchType === "exact" ? (
          <div className="bg-accent p-4">
            <SectionSubheader>Matched items</SectionSubheader>
            <div>
              {matchedItems.map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check className="text-primary size-5 pt-1" />
                  <span className="text-foreground text-base font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "border-input-border flex items-start gap-1.5 border-t p-4",
              explanationBackground,
            )}
          >
            <Sparkle className={cn("size-4 pt-1", explanationIconColor)} />
            <span className={cn("text-sm font-light", explanationLabelColor)}>{explanation}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SearchResultItem;
