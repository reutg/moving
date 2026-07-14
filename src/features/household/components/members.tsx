"use client";

import { capitalize } from "lodash";
import { Trash2 } from "lucide-react";
import type { User } from "next-auth";

import { OWNER_HOUSEHOLD_ROLE } from "@/constants";

import UserCard from "@/features/settings/components/user-card";

import Button from "@/components/button";
import Chip from "@/components/ui/chip";
import SeparatorDot from "@/components/ui/separator-dot";
import { SectionSubheader } from "@/components/ui/text";

import useRemoveHouseholdMember from "../hooks/use-remove-household-member";
import type {
  HouseholdInviteSummary,
  HouseholdMemberSummary,
  HouseholdWithMembers,
} from "../services/household-service";

import Invites from "./invites";

interface MembersProps {
  household: HouseholdWithMembers;
  user: User;
  invites: HouseholdInviteSummary[];
}

const Members: React.FC<MembersProps> = ({ household, user, invites }) => {
  const membersCount = household.members.length;
  const { removeMember, removingUserId } = useRemoveHouseholdMember();

  const currentMember = household.members.find((member) => member.userId === user.id);
  const isOwner = currentMember?.role === OWNER_HOUSEHOLD_ROLE;

  const isCurrentUser = (member: HouseholdMemberSummary) => member.userId === user.id;

  const canRemoveMember = (member: HouseholdMemberSummary) =>
    isOwner && !isCurrentUser(member) && member.role !== OWNER_HOUSEHOLD_ROLE;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <SectionSubheader>Members</SectionSubheader>
          <SeparatorDot />
          <SectionSubheader>{membersCount}</SectionSubheader>
        </div>
        {household.members.map((member) => (
          <UserCard
            key={member.userId}
            user={member}
            trailing={
              <div className="flex items-center gap-2">
                <Chip
                  label={capitalize(member.role)}
                  variant={isCurrentUser(member) ? "default" : "neutral"}
                />
                {canRemoveMember(member) ? (
                  <Button
                    variant="icon"
                    size="icon-sm"
                    onClick={() => removeMember(member.userId)}
                    loading={removingUserId === member.userId}
                  >
                    <Trash2 />
                  </Button>
                ) : null}
              </div>
            }
            currentUser={isCurrentUser(member)}
          />
        ))}
      </div>

      <Invites invites={invites} />
    </div>
  );
};

export default Members;
