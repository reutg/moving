import { ChevronRight } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";
import { SectionSubheader } from "@/components/ui/text";

interface EmptyHouseholdProps {}

const EmptyHousehold: React.FC<EmptyHouseholdProps> = ({}) => {
  return (
    <div>
      <SectionSubheader>Household</SectionSubheader>
      <ButtonLink
        href="/household"
        variant="link"
        className="text-foreground flex items-center gap-2 font-light"
      >
        Create Household
        <ChevronRight className="text-subtle-foreground size-4" />
      </ButtonLink>
    </div>
  );
};

export default EmptyHousehold;
