"use client";

import type { ChecklistTask } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";

type ChecklistItemPreviewProps = {
  item: ChecklistTask;
};

const ChecklistItemPreview = ({ item }: ChecklistItemPreviewProps) => (
  <div
    className={cn(
      "flex items-center justify-between p-3.5",
      item.isCompleted && "bg-checklist-completed-bg",
    )}
  >
    <div className="flex items-center gap-3">
      <Checkbox checked={item.isCompleted} />
      <span
        className={cn(
          "text-foreground text-base",
          item.isCompleted && "text-checklist-completed-text line-through",
        )}
      >
        {item.title}
      </span>
    </div>
  </div>
);

export default ChecklistItemPreview;
