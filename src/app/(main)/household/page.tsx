import { ChevronLeft, Users } from "lucide-react";

import { requireOnboarding } from "@/lib/auth/guards";

import HouseholdForm from "@/features/household/components/household-form";
import Members from "@/features/household/components/members";
import { getCurrentHousehold } from "@/features/household/services/household-service";
import { getPendingInvites } from "@/features/household/services/invite-service";

import PageHeader from "@/components/ui/page-header";

interface HouseholdPageProps {}

const HouseholdPage: React.FC<HouseholdPageProps> = async ({}) => {
  const household = await getCurrentHousehold();
  const session = await requireOnboarding();
  const pendingInvites = await getPendingInvites();

  const user = session.user;

  return (
    <main className="mx-auto flex min-h-full max-w-[960px] flex-col gap-[1.125rem] px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <PageHeader title={household?.name ?? "Household"} backHref="/settings" icon={ChevronLeft} />

      <div className="bg-accent flex items-center gap-4 rounded-xl p-4">
        <Users className="text-primary size-8" />
        <p className="text-primary text-sm">
          Everyone in your household shares the same boxes, rooms and labels in real time.
        </p>
      </div>

      {household ? (
        <Members household={household} user={user} invites={pendingInvites} />
      ) : (
        <HouseholdForm household={household} />
      )}
    </main>
  );
};

export default HouseholdPage;
