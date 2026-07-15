"use client";

import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";

import type { ChecklistTask } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

import Button from "@/components/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

interface ChecklistItemProps {
  item: ChecklistTask;
  onOpenOptions: (taskId: number) => void;
  openOptionsTaskId: number | undefined;
  onToggleCompletion: (taskId: number, isCompleted: boolean) => void;
  onEdit: (task: ChecklistTask) => void;
  onDelete: (taskId: number) => void;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  item,
  onOpenOptions,
  openOptionsTaskId,
  onToggleCompletion,
  onEdit,
  onDelete,
}) => {
  const isOptionsOpen = openOptionsTaskId === item.id;
  return (
    <>
      <div
        className={cn(
          "flex items-center justify-between px-4 py-1",
          item.isCompleted && "bg-checklist-completed-bg",
          isOptionsOpen && "bg-checklist-options-bg",
        )}
      >
        <div className="flex items-center gap-3">
          <Checkbox
            checked={item.isCompleted}
            onCheckedChange={(checked) => onToggleCompletion(item.id, checked === true)}
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
      </div>
      {isOptionsOpen && (
        <div className="border-t-checklist-options-border border-b-border-light bg-checklist-options-bg flex items-center border-t border-b">
          <Button variant="ghost" className="flex-1 text-sm" onClick={() => onEdit(item)}>
            <PencilIcon className="size-4" />
            <span>Edit</span>
          </Button>
          <Separator orientation="vertical" />
          <Button
            variant="ghost"
            className="text-destructive flex-1 text-sm"
            onClick={() => onDelete(item.id)}
          >
            <TrashIcon className="size-4" />
            <span>Delete</span>
          </Button>
        </div>
      )}
    </>
  );
};

export default ChecklistItem;
