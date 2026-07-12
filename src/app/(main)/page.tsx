import Link from "next/link";

import { ChevronDown, Sparkles } from "lucide-react";

import { getUserInitials } from "@/lib/app-utils";
import { getGreeting } from "@/lib/date-utils";

import SearchBox from "@/features/boxes/components/search-box";
import { listBoxes, listRecentlyUpdatedBoxes } from "@/features/boxes/services/box-service";
import EmptyMove from "@/features/main/empty-move";
import QuickActionsWrapper from "@/features/main/quick-actions-wrapper";
import RecentlyUpdated from "@/features/main/recently-updated";
import NoMoves from "@/features/moves/components/no-moves";
import { getCurrentMove } from "@/features/moves/services/move-service";

import Avatar from "@/components/avatar";
import ActionCard from "@/components/ui/action-card";
import ComingSoonBanner from "@/components/ui/coming-soon-banner";

import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();
  const user = session!.user;

  const currentMove = await getCurrentMove();
  const [recentlyUpdatedBoxes, boxes] = await Promise.all([
    listRecentlyUpdatedBoxes(),
    listBoxes(currentMove?.id),
  ]);

  const { firstName } = user;
  const initials = getUserInitials(user);
  const isEmptyMove = boxes.length === 0;

  return (
    <main className="flex-container page-content">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-muted-foreground text-md font-light">
            {getGreeting()}, {firstName}!
          </span>

          {currentMove && (
            <Link href="/moves" className="flex items-center gap-2">
              <h6 className="line-clamp-1 text-xl font-semibold">{currentMove.name}</h6>
              <ChevronDown className="text-subtle-foreground size-4" />
            </Link>
          )}
        </div>
        <Link href="/settings">
          <Avatar src={user?.image ?? ""} alt={user?.name ?? ""} fallback={initials} />
        </Link>
      </div>

      {currentMove ? (
        <>
          {isEmptyMove ? (
            <EmptyMove />
          ) : (
            <>
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
            </>
          )}
        </>
      ) : (
        <NoMoves />
      )}
    </main>
  );
}
