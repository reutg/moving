"use client";

import { useMemo } from "react";

import Chip from "@/components/ui/chip";
import { FieldLabel } from "@/components/ui/field";

interface SuggestedItemsProps {
  description?: string;
}

const SuggestedItems: React.FC<SuggestedItemsProps> = ({ description }) => {
  const suggestedItems = useMemo(() => {
    if (!description) return [];
    return description.split(",").filter((word) => word.length > 0);
  }, [description]);

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel>Suggested Items</FieldLabel>

      <div className="flex flex-wrap gap-2">
        {suggestedItems.map((item) => (
          <Chip key={item} label={item} variant="removable" />
        ))}
      </div>
    </div>
  );
};

export default SuggestedItems;
