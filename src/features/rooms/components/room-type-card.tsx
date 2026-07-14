"use client";

import type { LucideIcon } from "lucide-react";

import type { CommonLocationKey } from "@/constants";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";

interface RoomTypeCardProps {
  icon: LucideIcon;
  roomLabel: string;
  type: CommonLocationKey;
  selected: boolean;
  onSelect: () => void;
}

const RoomTypeCard: React.FC<RoomTypeCardProps> = ({
  icon,
  roomLabel,
  type,
  selected,
  onSelect,
}) => {
  const borderColor = selected ? "primary" : "border";
  const textColor = selected ? "primary" : "foreground";
  const cardBackgroundColor = selected ? "bg-accent" : undefined;

  return (
    <Card
      className={cn(
        "box-border flex w-1/3 flex-1 basis-1/4 rounded-xl border-2 p-2",
        `border-${borderColor}`,
        cardBackgroundColor,
      )}
      onClick={onSelect}
    >
      <CardContent className="flex flex-col items-center justify-center gap-2 p-0 text-center">
        <IconTile
          size="sm"
          icon={icon}
          iconColor="#FFFFFF"
          backgroundColor={`var(--room-${type})`}
        />
        <span className={`text-${textColor} text-xs`}>{roomLabel}</span>
      </CardContent>
    </Card>
  );
};

export default RoomTypeCard;
