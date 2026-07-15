"use client";

import type { ChecklistSectionKey } from "@/constants";
import type { ChecklistTask } from "@/lib/db/schema";

import { Card, CardContent } from "@/components/ui/card";
import { SectionSubheader } from "@/components/ui/text";

import { checklistSectionTitles } from "../constants/data";
import useChecklistSection from "../hooks/use-checklist-section";

import AddChecklistItem from "./add-checklist-item";
import ChecklistItem from "./checklist-item";

interface ChecklistSectionProps {
  nameKey: ChecklistSectionKey;
  items: ChecklistTask[];
  onAddTask: () => void;
  onToggleCompletion: (taskId: number, isCompleted: boolean) => void;
  onEditTask: (task: ChecklistTask) => void;
  onDeleteTask: (taskId: number) => void;
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  nameKey,
  items,
  onAddTask,
  onToggleCompletion,
  onEditTask,
  onDeleteTask,
}) => {
  const { statsText, handleOpenOptions, closeOptions, openOptionsTaskId } =
    useChecklistSection(items);

  const handleEdit = (task: ChecklistTask) => {
    closeOptions();
    onEditTask(task);
  };

  const handleDelete = (taskId: number) => {
    closeOptions();
    onDeleteTask(taskId);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <SectionSubheader>{checklistSectionTitles[nameKey]}</SectionSubheader>
        <span className="text-muted-foreground text-sm font-thin">{statsText}</span>
      </div>
      <Card className="p-0">
        <CardContent className="p-0">
          <div className="divide-divider divide-y">
            {items.map((item) => (
              <ChecklistItem
                key={item.id}
                item={item}
                onOpenOptions={handleOpenOptions}
                openOptionsTaskId={openOptionsTaskId}
                onToggleCompletion={onToggleCompletion}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
            <AddChecklistItem onClick={onAddTask} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChecklistSection;
