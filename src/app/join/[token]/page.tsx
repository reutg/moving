import { ChevronLeft } from "lucide-react";

import JoinHousehold from "@/features/household/components/join-household";
import { getHouseholdInviteByToken } from "@/features/household/services/household-service";

import PageHeader from "@/components/ui/page-header";

interface JoinHouseholdPageProps {
  params: Promise<{
    token: string;
  }>;
}

const JoinHouseholdPage: React.FC<JoinHouseholdPageProps> = async ({ params }) => {
  const { token } = await params;
  const invite = await getHouseholdInviteByToken(token);

  return (
    <main className="flex-container page-content">
      <PageHeader title="Join Household" backHref="/" icon={ChevronLeft} />
      <JoinHousehold token={token} invite={invite} />
    </main>
  );
};

export default JoinHouseholdPage;
