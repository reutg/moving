import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import { signOutAction } from "@/features/settings/actions/sign-out";
import AccountCard from "@/features/settings/components/account-card";
import HouseholdCard from "@/features/settings/components/household-card";
import PreferencesCard from "@/features/settings/components/preferences-card";
import UserCard from "@/features/settings/components/user-card";
import { ChevronLeft, LogOut } from "lucide-react";

interface SettingsPageProps {}

const SettingsPage: React.FC<SettingsPageProps> = async ({}) => {
  const session = await auth();
  const user = session!.user;

  return (
    <main className="flex-container page-content">
      <PageHeader title="Settings" backHref="/" icon={ChevronLeft} />
      <div className="flex flex-col gap-[22px]">
        <UserCard user={user} />
        <AccountCard email={user.email} />
        <HouseholdCard />
        <PreferencesCard />
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
