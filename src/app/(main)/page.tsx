import { auth } from "@/auth";
import Avatar from "@/components/avatar";
import ActionCard from "@/components/ui/action-card";
import ComingSoonBanner from "@/components/ui/coming-soon-banner";
import SearchBox from "@/features/boxes/components/search-box";
import { listRecentlyUpdatedBoxes } from "@/features/boxes/services/box-service";
import { getCurrentMove } from "@/features/moves/services/move-service";
import QuickActionsWrapper from "@/features/main/quick-actions-wrapper";
import RecentlyUpdated from "@/features/main/recently-updated";
import { CurrentUser } from "@/features/users/services/user-service";
import { Sparkles } from "lucide-react";

export default async function HomePage() {
  const [recentlyUpdatedBoxes, currentMove] = await Promise.all([
    listRecentlyUpdatedBoxes(),
    getCurrentMove(),
  ]);

  const session = await auth();
  const user = session?.user;
  const { firstName, lastName } = user as CurrentUser;
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`;

  return (
    <main className="flex-container page-content">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-muted-foreground text-xs font-light">
            Good morning, {firstName}!
          </span>
          <h6 className="line-clamp-1 text-lg font-semibold">{currentMove.name}</h6>
        </div>
        <Avatar src={user?.image ?? ""} alt={user?.name ?? ""} fallback={initials} />
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
