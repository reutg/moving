"use client";

import Link from "next/link";

import { Check } from "lucide-react";

import { FALLBACK_LOCATION_ICON, LOCATION_ICONS } from "@/constants";

import { Card, CardContent } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";

import type { RoomWithBoxesCount } from "../services/room-service";

interface RoomCardProps {
  room: RoomWithBoxesCount;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const icon = LOCATION_ICONS[room.type] ?? FALLBACK_LOCATION_ICON;
  const backgroundColor = `var(--room-${room.type})`;

  return (
    <Link href={`/rooms/${room.id}`}>
      <Card>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <IconTile
              icon={icon}
              backgroundColor={backgroundColor}
              iconColor="var(--primary-foreground)"
              size="xs"
            />
            {room.completed && (
              <div className="bg-sage flex size-5 items-center justify-center rounded-full">
                <Check className="size-2.5 text-white" />
              </div>
            )}
          </div>

          <span className="text-base font-semibold">{room.name}</span>
          <span className="text-muted-foreground text-[12.5px]">{room.boxesCount} boxes</span>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RoomCard;
