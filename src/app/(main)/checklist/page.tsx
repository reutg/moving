import { Suspense } from "react";

import { redirect } from "next/navigation";

import { ChevronLeft, Plus } from "lucide-react";

import ChecklistContent from "@/features/checklist/components/checklist-content";
import { ADD_TASK_HREF } from "@/features/checklist/constants/add-task-query";
import { listChecklist } from "@/features/checklist/services/checklist-service";
import { getCurrentMove } from "@/features/moves/services/move-service";

import { IconLink } from "@/components/ui/icon-link";
import PageHeader from "@/components/ui/page-header";

const ChecklistPage = async () => {
  const currentMove = await getCurrentMove();
  if (!currentMove) {
    redirect("/moves");
  }

  const { tasks } = await listChecklist(currentMove.id);

  return (
    <main className="mx-auto flex min-h-full max-w-[960px] flex-col gap-[1.125rem] px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <PageHeader
        title="Checklist"
        backHref="/"
        icon={ChevronLeft}
        trailing={
          <IconLink
            href={ADD_TASK_HREF}
            aria-label="Add task"
            icon={Plus}
            className="justify-self-start"
          />
        }
      />
      <Suspense fallback={null}>
        <ChecklistContent moveId={currentMove.id} initialTasks={tasks} />
      </Suspense>
    </main>
  );
};

export default ChecklistPage;
