"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import type { ChecklistSectionKey } from "@/constants";
import type { ApiResponse } from "@/lib/api/response";
import type { ChecklistTask } from "@/lib/db/schema";

type UseAddTaskFormOptions = {
  moveId: number;
  initialSection: ChecklistSectionKey | null;
  initialTitle?: string;
  editingTaskId?: number;
  onClose: () => void;
  onTaskCreated: (task: ChecklistTask) => void;
  onTaskUpdated: (task: ChecklistTask) => void;
};

const useAddTaskForm = ({
  moveId,
  initialSection,
  initialTitle = "",
  editingTaskId,
  onClose,
  onTaskCreated,
  onTaskUpdated,
}: UseAddTaskFormOptions) => {
  const router = useRouter();
  const isEdit = editingTaskId !== undefined;
  const [taskValue, setTaskValue] = useState(initialTitle);
  const [selectedSection, setSelectedSection] = useState<ChecklistSectionKey | undefined>(
    () => initialSection ?? undefined,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleTaskValueChange = (value: string) => {
    setTaskValue(value);
  };

  const handleSectionChange = (value: ChecklistSectionKey) => {
    setSelectedSection(value);
  };

  const handleCancel = () => {
    onClose();
  };

  const fallbackSubmitError = isEdit ? "Failed to update task" : "Failed to add task";
  const submitUrl = isEdit
    ? `/api/moves/${moveId}/checklist/${editingTaskId}`
    : `/api/moves/${moveId}/checklist`;

  const handleSubmit = async () => {
    const title = taskValue.trim();

    if (!title) {
      setSubmitError("Task name is required");
      return;
    }

    if (!selectedSection) {
      setSubmitError("Section is required");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(submitUrl, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, section: selectedSection }),
      });
      const json: ApiResponse<ChecklistTask> = await response.json();

      if (!json.ok) {
        setSubmitError(json.error.message);
        return;
      }

      if (isEdit) {
        onTaskUpdated(json.data);
      } else {
        onTaskCreated(json.data);
      }

      onClose();
      router.refresh();
    } catch (cause) {
      if (cause instanceof Error) {
        setSubmitError(cause.message);
        return;
      }

      setSubmitError(fallbackSubmitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = taskValue.trim().length > 0 && selectedSection !== undefined && !isSubmitting;

  return {
    taskValue,
    selectedSection,
    handleTaskValueChange,
    handleSectionChange,
    handleCancel,
    handleSubmit,
    isSubmitting,
    submitError,
    canSubmit,
    isEdit,
  };
};

export default useAddTaskForm;
