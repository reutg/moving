"use client";

import Link from "next/link";

import type { ChecklistSectionKey } from "@/constants";
import type { ChecklistTask } from "@/lib/db/schema";

import { Card, CardContent } from "@/components/ui/card";
import { SectionSubheader } from "@/components/ui/text";

import { checklistSectionTitles } from "../constants/data";
import useChecklistSection from "../hooks/use-checklist-section";

import AddChecklistItem from "./add-checklist-item";
import ChecklistItem from "./checklist-item/checklist-item";

type ChecklistSectionMode = "interactive" | "preview";

interface ChecklistSectionProps {
  nameKey: ChecklistSectionKey;
  items: ChecklistTask[];
  mode?: ChecklistSectionMode;
  onAddTask?: () => void;
  onToggleCompletion?: (taskId: number, isCompleted: boolean) => void;
  onEditTask?: (task: ChecklistTask) => void;
  onDeleteTask?: (taskId: number) => void;
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  nameKey,
  items,
  mode = "interactive",
  onAddTask,
  onToggleCompletion,
  onEditTask,
  onDeleteTask,
}) => {
  const isPreview = mode === "preview";
  const { statsText, handleOpenOptions, closeOptions, openOptionsTaskId } =
    useChecklistSection(items);

  const handleEdit = (task: ChecklistTask) => {
    closeOptions();
    onEditTask?.(task);
  };

  const handleDelete = (taskId: number) => {
    closeOptions();
    onDeleteTask?.(taskId);
  };

  const list = (
    <Card className={isPreview ? "pointer-events-none p-0" : "p-0"}>
      <CardContent className="p-0">
        <div className="divide-divider divide-y">
          {items.map((item) => (
            <ChecklistItem
              key={item.id}
              item={item}
              readOnly={isPreview}
              onOpenOptions={handleOpenOptions}
              openOptionsTaskId={isPreview ? undefined : openOptionsTaskId}
              onToggleCompletion={isPreview ? undefined : onToggleCompletion}
              onEdit={isPreview ? undefined : handleEdit}
              onDelete={isPreview ? undefined : handleDelete}
            />
          ))}
          {!isPreview && onAddTask ? <AddChecklistItem onClick={onAddTask} /> : null}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-2">
      {!isPreview && (
        <div className="flex items-center justify-between">
          <SectionSubheader>{checklistSectionTitles[nameKey]}</SectionSubheader>
          <span className="text-muted-foreground text-sm font-thin">{statsText}</span>
        </div>
      )}
      {isPreview ? (
        <Link href="/checklist" className="block" aria-label="View checklist">
          {list}
        </Link>
      ) : (
        list
      )}
    </div>
  );
};

export default ChecklistSection;
