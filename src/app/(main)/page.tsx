import { getUserInitials } from "@/lib/app-utils";

import { listBoxes, listRecentlyUpdatedBoxes } from "@/features/boxes/services/box-service";
import { listChecklist } from "@/features/checklist/services/checklist-service";
import HomeContent from "@/features/main/home-content";
import HomeHeader from "@/features/main/home-header";
import { getCurrentMove } from "@/features/moves/services/move-service";

import { auth } from "@/auth";

export default async function HomePage() {
  const session = await auth();
  const user = session!.user;

  const currentMove = await getCurrentMove();
  const [recentlyUpdatedBoxes, boxes, checklistTasks] = await Promise.all([
    listRecentlyUpdatedBoxes(),
    listBoxes(currentMove?.id),
    listChecklist(currentMove?.id),
  ]);

  return (
    <main className="mx-auto flex min-h-full max-w-[960px] flex-col gap-[1.125rem] px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <HomeHeader
        firstName={user.firstName}
        moveName={currentMove?.name}
        userImage={user.image}
        userName={user.name}
        initials={getUserInitials(user)}
      />

      <HomeContent
        hasCurrentMove={currentMove !== null}
        isEmptyMove={boxes.length === 0}
        recentlyUpdatedBoxes={recentlyUpdatedBoxes}
        moveDate={currentMove?.moveDate ?? null}
        checklistTasks={checklistTasks}
      />
    </main>
  );
}
