"use client";

import { CHECKLIST_SECTION_ORDER, type ChecklistSectionKey } from "@/constants";
import type { ChecklistTask } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

import Button from "@/components/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SectionSubheader } from "@/components/ui/text";

import { checklistSectionTitles } from "../constants/data";
import useAddTaskForm from "../hooks/use-add-task-form";

interface AddChecklistItemSheetProps {
  moveId: number;
  isOpen: boolean;
  isEdit: boolean;
  initialSection: ChecklistSectionKey | null;
  editingTask: ChecklistTask | null;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  onTaskCreated: (task: ChecklistTask) => void;
  onTaskUpdated: (task: ChecklistTask) => void;
}

type AddChecklistItemSheetFormProps = {
  moveId: number;
  isEdit: boolean;
  initialSection: ChecklistSectionKey | null;
  editingTask: ChecklistTask | null;
  onClose: () => void;
  onTaskCreated: (task: ChecklistTask) => void;
  onTaskUpdated: (task: ChecklistTask) => void;
};

const AddChecklistItemSheetForm = ({
  moveId,
  isEdit,
  initialSection,
  editingTask,
  onClose,
  onTaskCreated,
  onTaskUpdated,
}: AddChecklistItemSheetFormProps) => {
  const {
    taskValue,
    handleTaskValueChange,
    selectedSection,
    handleSectionChange,
    handleCancel,
    handleSubmit,
    isSubmitting,
    submitError,
    canSubmit,
  } = useAddTaskForm({
    moveId,
    initialSection,
    initialTitle: editingTask?.title ?? "",
    editingTaskId: editingTask?.id,
    onClose,
    onTaskCreated,
    onTaskUpdated,
  });

  return (
    <>
      <SheetHeader>
        <SheetTitle>{isEdit ? "Edit task" : "New task"}</SheetTitle>
      </SheetHeader>

      <div className="space-y-2">
        <SectionSubheader>Task name</SectionSubheader>
        <Input
          value={taskValue}
          onChange={(e) => handleTaskValueChange(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <SectionSubheader>Section</SectionSubheader>
        <RadioGroup
          className="w-full"
          value={selectedSection ?? null}
          onValueChange={(value) => handleSectionChange(value as ChecklistSectionKey)}
          disabled={isSubmitting}
        >
          {CHECKLIST_SECTION_ORDER.map((sectionKey) => (
            <Label key={sectionKey} htmlFor={sectionKey} className="block w-full">
              <Card
                className={cn(
                  "w-full rounded-2xl",
                  selectedSection === sectionKey && "border-primary bg-accent border-[1.5px]",
                )}
              >
                <CardContent className="w-full">
                  <div className="flex items-center gap-3">
                    <RadioGroupItem id={sectionKey} value={sectionKey} />
                    <span
                      className={cn(
                        "text-base font-normal",
                        selectedSection === sectionKey && "text-primary",
                      )}
                    >
                      {checklistSectionTitles[sectionKey]}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Label>
          ))}
        </RadioGroup>
      </div>

      {submitError ? <p className="text-destructive text-sm">{submitError}</p> : null}

      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} loading={isSubmitting} disabled={!canSubmit}>
          {isEdit ? "Save" : "Add Task"}
        </Button>
      </div>
    </>
  );
};

const AddChecklistItemSheet: React.FC<AddChecklistItemSheetProps> = ({
  moveId,
  isOpen,
  isEdit,
  initialSection,
  editingTask,
  onOpenChange,
  onClose,
  onTaskCreated,
  onTaskUpdated,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent showCloseButton={false} className="space-y-4">
        {isOpen ? (
          <AddChecklistItemSheetForm
            key={editingTask?.id ?? initialSection ?? "none"}
            moveId={moveId}
            isEdit={isEdit}
            initialSection={initialSection}
            editingTask={editingTask}
            onClose={onClose}
            onTaskCreated={onTaskCreated}
            onTaskUpdated={onTaskUpdated}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

export default AddChecklistItemSheet;
