import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/page-header";
import AccountCard from "@/features/settings/components/account-card";
import HouseholdCard from "@/features/settings/components/household-card";
import PreferencesCard from "@/features/settings/components/preferences-card";
import UserCard from "@/features/settings/components/user-card";
import { ChevronLeft, LogOut } from "lucide-react";
import { redirect } from "next/navigation";

interface SettingsPageProps {}

const SettingsPage: React.FC<SettingsPageProps> = async ({}) => {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <main className="flex-container page-content">
      <PageHeader title="Settings" backHref="/" icon={ChevronLeft} />
      <div className="flex flex-col gap-[22px]">
        <UserCard user={session?.user} />
        <AccountCard email={session?.user?.email} />
        <HouseholdCard />
        <PreferencesCard />
      </div>

      <Button variant="destructive">
        <LogOut />
        Sign out
      </Button>
    </main>
  );
};

export default SettingsPage;
