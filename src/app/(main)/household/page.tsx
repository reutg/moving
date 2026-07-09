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
    <main className="flex-container page-content">
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
