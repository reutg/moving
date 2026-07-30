"use client";

import { CHECKLIST_SECTION_ORDER } from "@/constants";
import type { ChecklistTask } from "@/lib/db/schema";

import ButtonsSwitch from "@/components/inputs/buttons-switch";

import { statusOptions } from "../constants/data";
import useAddChecklistTaskSheet from "../hooks/use-add-checklist-task-sheet";
import useChecklistPage from "../hooks/use-checklist-page";

import AddChecklistItemSheet from "./add-checklist-item-sheet";
import ChecklistSection from "./checklist-section";

interface ChecklistContentProps {
  moveId: number;
  initialTasks: ChecklistTask[];
}

const ChecklistContent = ({ moveId, initialTasks }: ChecklistContentProps) => {
  const {
    selectedStatus,
    handleStatusChange,
    handleToggleCompletion,
    handleDeleteTask,
    handleTaskCreated,
    handleTaskUpdated,
    tasksBySection,
  } = useChecklistPage({ moveId, initialTasks });
  const { isOpen, isEdit, section, editingTask, open, openEdit, close, onOpenChange } =
    useAddChecklistTaskSheet();

  return (
    <>
      <div className="flex min-h-full max-w-[960px] flex-col gap-[1.125rem]">
        <ButtonsSwitch
          name="status"
          value={selectedStatus}
          options={statusOptions}
          handleButtonClick={handleStatusChange}
        />
        {CHECKLIST_SECTION_ORDER.map((sectionKey) => (
          <ChecklistSection
            key={sectionKey}
            nameKey={sectionKey}
            items={tasksBySection[sectionKey]}
            onAddTask={() => open(sectionKey)}
            onToggleCompletion={handleToggleCompletion}
            onEditTask={openEdit}
            onDeleteTask={handleDeleteTask}
          />
        ))}
      </div>

      <AddChecklistItemSheet
        moveId={moveId}
        isOpen={isOpen}
        isEdit={isEdit}
        initialSection={section}
        editingTask={editingTask}
        onOpenChange={onOpenChange}
        onClose={close}
        onTaskCreated={handleTaskCreated}
        onTaskUpdated={handleTaskUpdated}
      />
    </>
  );
};

export default ChecklistContent;
