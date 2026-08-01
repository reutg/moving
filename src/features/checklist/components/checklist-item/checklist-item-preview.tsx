"use client";

import type { ChecklistTask } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";
import Chip from "@/components/ui/chip";

import { checklistSectionTitles } from "../../constants/data";

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
    <div className="flex w-full items-center justify-between">
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
      <Chip label={checklistSectionTitles[item.section]} variant="neutral" />
    </div>
  </div>
);

export default ChecklistItemPreview;
