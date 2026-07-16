import { Sparkles } from "lucide-react";

import type { Box } from "@/lib/db/schema";

import EmptyMove from "@/features/main/empty-move";
import QuickActionsWrapper from "@/features/main/quick-actions-wrapper";
import RecentlyUpdated from "@/features/main/recently-updated";
import NoMoves from "@/features/moves/components/no-moves";

import ActionCard from "@/components/ui/action-card";
import ComingSoonBanner from "@/components/ui/coming-soon-banner";

import type { ChecklistListResult } from "../checklist/services/checklist-service";

import MovingInfo from "./moving-info";
import UpNext from "./up-next";

type HomeContentProps = {
  hasCurrentMove: boolean;
  isEmptyMove: boolean;
  recentlyUpdatedBoxes: Box[];
  moveDate: Date | null;
  checklistTasks: ChecklistListResult;
};

const HomeContent = ({
  hasCurrentMove,
  isEmptyMove,
  recentlyUpdatedBoxes,
  moveDate,
  checklistTasks,
}: HomeContentProps) => {
  if (!hasCurrentMove) {
    return <NoMoves />;
  }

  if (isEmptyMove) {
    return <EmptyMove />;
  }

  return (
    <>
      <MovingInfo moveDate={moveDate} />

      <QuickActionsWrapper />
      <UpNext tasks={checklistTasks.tasks} moveDate={moveDate ?? undefined} />

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
  );
};

export default HomeContent;
