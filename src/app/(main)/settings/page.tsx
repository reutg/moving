import { ChevronLeft, LogOut } from "lucide-react";

import { signOutAction } from "@/features/settings/actions/sign-out";
import AccountCard from "@/features/settings/components/account-card";
import HouseholdCard from "@/features/settings/components/household-card";
import SettingsUserCard from "@/features/settings/components/settings-user-card";

import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";

import { auth } from "@/auth";

interface SettingsPageProps {}

const SettingsPage: React.FC<SettingsPageProps> = async ({}) => {
  const session = await auth();
  const user = session!.user;

  return (
    <main className="flex-container page-content">
      <PageHeader title="Settings" backHref="/" icon={ChevronLeft} />
      <div className="flex flex-col gap-[22px]">
        <SettingsUserCard user={user} />
        <AccountCard email={user.email} />
        <HouseholdCard />
        {/* <PreferencesCard /> */}
      </div>

      <form action={signOutAction}>
        <Button variant="destructive" type="submit">
          <LogOut />
          Sign out
        </Button>
      </form>
    </main>
  );
};

export default SettingsPage;
