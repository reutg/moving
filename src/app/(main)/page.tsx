import { getUserInitials } from "@/lib/app-utils";

import {
  getBoxStatusCounts,
  listRecentlyUpdatedBoxes,
} from "@/features/boxes/services/box-service";
import { listChecklist } from "@/features/checklist/services/checklist-service";
import HomeContent from "@/features/main/home-content";
import HomeHeader from "@/features/main/home-header";
import { getCurrentMove } from "@/features/moves/services/move-service";

import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();
  const user = session!.user;

  const currentMove = await getCurrentMove();
  const [recentlyUpdatedBoxes, statusCounts, checklistTasks] = await Promise.all([
    listRecentlyUpdatedBoxes(),
    getBoxStatusCounts(currentMove?.id),
    listChecklist(currentMove?.id),
  ]);

  return (
    <main className="mx-auto flex min-h-full max-w-240 flex-col gap-4.5 px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <HomeHeader
        firstName={user.firstName}
        moveName={currentMove?.name}
        userImage={user.image}
        userName={user.name}
        initials={getUserInitials(user)}
      />

      <HomeContent
        hasCurrentMove={currentMove !== null}
        isEmptyMove={statusCounts.total === 0}
        recentlyUpdatedBoxes={recentlyUpdatedBoxes}
        moveDate={currentMove?.moveDate ?? null}
        boxesCount={statusCounts.total}
        checklistTasks={checklistTasks}
      />
    </main>
  );
}
