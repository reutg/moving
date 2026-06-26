import { auth } from "@/auth";
import Avatar from "@/components/avatar";
import ActionCard from "@/components/ui/action-card";
import ComingSoonBanner from "@/components/ui/coming-soon-banner";
import SearchBox from "@/features/boxes/components/search-box";
import { listRecentlyUpdatedBoxes } from "@/features/boxes/services/box-service";
import { getCurrentMove } from "@/features/moves/services/move-service";
import QuickActionsWrapper from "@/features/main/quick-actions-wrapper";
import RecentlyUpdated from "@/features/main/recently-updated";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { getUserInitials } from "@/lib/app-utils";
import { getGreeting } from "@/lib/date-utils";

export default async function HomePage() {
  const session = await auth();
  const user = session!.user;

  const [recentlyUpdatedBoxes, currentMove] = await Promise.all([
    listRecentlyUpdatedBoxes(),
    getCurrentMove(),
  ]);

  const { firstName } = user;
  const initials = getUserInitials(user);

  return (
    <main className="flex-container page-content">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-muted-foreground text-sm font-light">
            {getGreeting()}, {firstName}!
          </span>
          <h6 className="line-clamp-1 text-lg font-semibold">{currentMove.name}</h6>
        </div>
        <Link href="/settings">
          <Avatar src={user?.image ?? ""} alt={user?.name ?? ""} fallback={initials} />
        </Link>
      </div>

      <SearchBox />
      <QuickActionsWrapper />

      <ComingSoonBanner>
        <ActionCard
          icon={Sparkles}
          title="Search with AI"
          description={`"Where did I pack the coffee machine?"`}
          linkTo="/"
        />
      </ComingSoonBanner>

      <RecentlyUpdated boxes={recentlyUpdatedBoxes} />
    </main>
  );
}
