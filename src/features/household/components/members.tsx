"use client";

import { capitalize } from "lodash";
import type { User } from "next-auth";

import UserCard from "@/features/settings/components/user-card";

import Chip from "@/components/ui/chip";
import SeparatorDot from "@/components/ui/separator-dot";
import { SectionSubheader } from "@/components/ui/text";

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

  const isCurrentUser = (member: HouseholdMemberSummary) => member.userId === user.id;

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
              <Chip
                label={capitalize(member.role)}
                variant={isCurrentUser(member) ? "default" : "neutral"}
              />
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
