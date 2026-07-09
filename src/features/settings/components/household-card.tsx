import { UsersRound } from "lucide-react";

import { getCurrentHousehold } from "@/features/household/services/household-service";

import AvatarGroup from "@/components/inputs/avatar-group";
import SummaryCard from "@/components/ui/summary-card";
import { SectionSubheader } from "@/components/ui/text";

import EmptyHousehold from "./empty-household";

const HouseholdCard = async () => {
  const household = await getCurrentHousehold();

  if (!household) {
    return <EmptyHousehold />;
  }

  const memberCount = household.members.length;
  const members = household.members.map((member) => ({
    name: member.name ?? member.email,
    image: member.image ?? undefined,
  }));
  const membersLabel = memberCount === 1 ? "member" : "members";

  return (
    <div className="flex flex-col gap-[10px]">
      <SectionSubheader>Household</SectionSubheader>
      <SummaryCard
        icon={UsersRound}
        title={household.name}
        subtitle={`${memberCount} ${membersLabel}`}
        href="/household"
        trailing={<AvatarGroup items={members} />}
      />
    </div>
  );
};

export default HouseholdCard;
