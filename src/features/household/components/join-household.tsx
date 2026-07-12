"use client";

import { Box, Clock, House, LayoutGrid, UsersRound } from "lucide-react";

import { COMMON_LOCATIONS } from "@/constants";
import { getUserInitials } from "@/lib/app-utils";
import { formatDistanceToNow } from "@/lib/date-utils";

import Avatar from "@/components/avatar";
import Button from "@/components/button";
import { Card, CardContent } from "@/components/ui/card";
import IconTile from "@/components/ui/icon-tile";
import ListItemContent from "@/components/ui/list-item-content";
import { Separator } from "@/components/ui/separator";
import { SectionSubheader } from "@/components/ui/text";

import useJoinHousehold from "../hooks/use-join-household";
import type { HouseholdInvitePreview } from "../services/household-service";

interface JoinHouseholdProps {
  token: string;
  invite: HouseholdInvitePreview;
}

const JoinHousehold: React.FC<JoinHouseholdProps> = ({ token, invite }) => {
  const initials = getUserInitials(invite.invitedBy);
  const { acceptInvite, declineInvite, isAccepting, isDeclining } = useJoinHousehold(token);

  const { invitedBy, household } = invite;

  return (
    <div className="flex flex-col gap-5">
      <Card className="p-0">
        <CardContent className="p-0">
          <div className="flex flex-col items-center gap-3 bg-[linear-gradient(135deg,var(--primary),var(--primary-light))] p-7">
            <IconTile icon={House} backgroundColor="rgba(255,255,255,0.18)" iconColor="white" />

            <h3 className="text-2xl leading-none font-semibold text-white">{household.name}</h3>

            <span className="text-sm font-thin text-white">
              {household.memberNames.length} members · {household.boxesCount} boxes
            </span>
          </div>
          <div className="flex items-center gap-4 px-6 py-4">
            <Avatar
              src={invitedBy.image ?? ""}
              alt={invitedBy.name || ""}
              fallback={initials}
              size="xl"
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-foreground text-base leading-none font-semibold">
                {invitedBy.name}
              </h3>

              <span className="text-subtle-foreground text-sm">
                invited you to join their household
              </span>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2.5 px-8 py-4">
            <Clock className="h-4 w-4 text-[#F59E0B]" />
            <div className="flex items-center gap-1">
              <span className="text-sm font-light text-[#92400E]">Invite expires</span>
              <span className="text-sm font-semibold text-[#92400E]">
                {formatDistanceToNow(invite.expiresAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <SectionSubheader>Household details</SectionSubheader>
      <Card className="p-0">
        <CardContent>
          <div className="divide-border divide-y">
            <ListItemContent
              icon={UsersRound}
              title={`${household.memberNames.length} members`}
              description={household.memberNames.join(", ")}
            />

            <ListItemContent
              icon={Box}
              title={`${household.boxesCount} boxes`}
              description="All boxes tagged with QR codes"
            />

            <ListItemContent
              icon={LayoutGrid}
              title={`${Object.values(COMMON_LOCATIONS).length} rooms`}
              description={Object.values(COMMON_LOCATIONS).join(", ")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <Button onClick={acceptInvite} loading={isAccepting} disabled={isDeclining}>
          Join household
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={declineInvite}
          loading={isDeclining}
          disabled={isAccepting}
        >
          Decline invite
        </Button>
      </div>
    </div>
  );
};

export default JoinHousehold;
