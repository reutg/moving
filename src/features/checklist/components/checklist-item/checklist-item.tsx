"use client";

import { EllipsisVerticalIcon } from "lucide-react";

import type { ChecklistTask } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

import Button from "@/components/button";
import { Checkbox } from "@/components/ui/checkbox";

import ChecklistItemOptions from "./checklist-item-options";
import ChecklistItemPreview from "./checklist-item-preview";

interface ChecklistItemProps {
  item: ChecklistTask;
  readOnly?: boolean;
  onOpenOptions: (taskId: number) => void;
  openOptionsTaskId: number | undefined;
  onToggleCompletion?: (taskId: number, isCompleted: boolean) => void;
  onEdit?: (task: ChecklistTask) => void;
  onDelete?: (taskId: number) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  readOnly = false,
  onOpenOptions,
  openOptionsTaskId,
  onToggleCompletion,
  onEdit,
  onDelete,
}) => {
  if (readOnly) {
    return <ChecklistItemPreview item={item} />;
  }

  const isOptionsOpen = openOptionsTaskId === item.id;
  const showOptions = Boolean(onEdit || onDelete);

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between px-4 py-1",
          item.isCompleted && "bg-checklist-completed-bg",
          isOptionsOpen && "bg-checklist-options-bg",
        )}
      >
        <div className="flex items-center gap-3 py-3.5">
          <Checkbox
            checked={item.isCompleted}
            onCheckedChange={(checked) => onToggleCompletion?.(item.id, checked === true)}
          />
          <span
            className={cn(
              "text-foreground text-base",
              item.isCompleted && "text-checklist-completed-text line-through",
            )}
          >
            {item.title}
          </span>
        </div>
        {showOptions && (
          <Button
            variant="ghost"
            size="icon"
            disabled={item.isCompleted}
            onClick={() => onOpenOptions(item.id)}
          >
            <EllipsisVerticalIcon
              className={cn("text-icon size-5", isOptionsOpen && "text-primary")}
            />
          </Button>
        )}
      </div>
      {isOptionsOpen ? (
        <ChecklistItemOptions item={item} onEdit={onEdit} onDelete={onDelete} />
      ) : null}
    </>
  );
};

export default ChecklistItem;
