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
    <main className="mx-auto flex min-h-full max-w-[960px] flex-col gap-[1.125rem] px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <PageHeader title="Join Household" backHref="/" icon={ChevronLeft} />
      <JoinHousehold token={token} invite={invite} />
    </main>
  );
};

export default JoinHouseholdPage;
