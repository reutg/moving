"use client";

import AvatarGroup from "@/components/inputs/avatar-group";
import { Card, CardContent } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";
import { SectionSubheader } from "@/components/ui/text";
import { ChevronRight, UsersRound } from "lucide-react";

interface HouseholdCardProps {}

const HouseholdCard: React.FC<HouseholdCardProps> = ({}) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <SectionSubheader>Household</SectionSubheader>
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <IconTile icon={UsersRound} size="sm" />

            <div>
              <h3 className="text-foreground text-md font-semibold">Household Name</h3>
              <p className="text-subtle-foreground text-sm">X members</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AvatarGroup />

            <ChevronRight className="text-subtle-foreground size-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HouseholdCard;
