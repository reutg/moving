import { useState } from "react";

import type { ChecklistTask } from "@/lib/db/schema";

const useChecklistSection = (items: ChecklistTask[]) => {
  const [openOptionsTaskId, setOpenOptionsTaskId] = useState<number>();

  const handleOpenOptions = (taskId: number) => {
    setOpenOptionsTaskId((current) => (current === taskId ? undefined : taskId));
  };

  const closeOptions = () => {
    setOpenOptionsTaskId(undefined);
  };

  const completed = items.filter((item) => item.isCompleted).length;
  const total = items.length;

  let statsText: string;
  if (total === 0) {
    statsText = "0 tasks";
  } else if (completed === 0) {
    statsText = `${total} open`;
  } else if (completed === total) {
    statsText = `${completed} completed`;
  } else {
    statsText = `${completed} of ${total}`;
  }

  return { statsText, handleOpenOptions, closeOptions, openOptionsTaskId };
};

export default useChecklistSection;
