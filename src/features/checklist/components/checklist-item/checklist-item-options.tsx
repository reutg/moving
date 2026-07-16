"use client";

import { PencilIcon, TrashIcon } from "lucide-react";

import type { ChecklistTask } from "@/lib/db/schema";

import Button from "@/components/button";
import { Separator } from "@/components/ui/separator";

type ChecklistItemOptionsProps = {
  item: ChecklistTask;
  onEdit?: (task: ChecklistTask) => void;
  onDelete?: (taskId: number) => void;
};

const ChecklistItemOptions = ({ item, onEdit, onDelete }: ChecklistItemOptionsProps) => (
  <div className="border-t-checklist-options-border border-b-border-light bg-checklist-options-bg flex items-center border-t border-b">
    <Button variant="ghost" className="flex-1 text-sm" onClick={() => onEdit?.(item)}>
      <PencilIcon className="size-4" />
      <span>Edit</span>
    </Button>
    <Separator orientation="vertical" />
    <Button
      variant="ghost"
      className="text-destructive flex-1 text-sm"
      onClick={() => onDelete?.(item.id)}
    >
      <TrashIcon className="size-4" />
      <span>Delete</span>
    </Button>
  </div>
);

export default ChecklistItemOptions;
