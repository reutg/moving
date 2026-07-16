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
    <main className="flex-container page-content">
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
