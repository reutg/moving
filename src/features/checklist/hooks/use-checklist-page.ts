"use client";

import { useMemo, useState } from "react";

import { toast } from "sonner";

import {
  CHECKLIST_SECTION_ORDER,
  type ChecklistFilter,
  type ChecklistSectionKey,
  DEFAULT_CHECKLIST_FILTER,
} from "@/constants";
import type { ApiResponse } from "@/lib/api/response";
import type { ChecklistTask } from "@/lib/db/schema";

import { isChecklistFilter } from "../constants/data";

type UseChecklistPageOptions = {
  moveId: number;
  initialTasks: ChecklistTask[];
};

const useChecklistPage = ({ moveId, initialTasks }: UseChecklistPageOptions) => {
  const [selectedStatus, setSelectedStatus] = useState<ChecklistFilter>(DEFAULT_CHECKLIST_FILTER);
  const [tasks, setTasks] = useState<ChecklistTask[]>(initialTasks);

  const handleStatusChange = (status: string) => {
    if (!isChecklistFilter(status)) {
      return;
    }

    setSelectedStatus(status);
  };

  const handleToggleCompletion = async (taskId: number, isCompleted: boolean) => {
    const previous = tasks;

    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, isCompleted } : task)),
    );

    try {
      const response = await fetch(`/api/moves/${moveId}/checklist/${taskId}/completion`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted }),
      });
      const json: ApiResponse<ChecklistTask> = await response.json();

      if (!json.ok) {
        throw new Error(json.error.message);
      }

      setTasks((current) => current.map((task) => (task.id === taskId ? json.data : task)));
    } catch {
      setTasks(previous);
      toast.error("Failed to update checklist task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const previous = tasks;

    setTasks((current) => current.filter((task) => task.id !== taskId));

    try {
      const response = await fetch(`/api/moves/${moveId}/checklist/${taskId}`, {
        method: "DELETE",
      });
      const json: ApiResponse<{ id: number }> = await response.json();

      if (!json.ok) {
        throw new Error(json.error.message);
      }
    } catch {
      setTasks(previous);
      toast.error("Failed to delete checklist task");
    }
  };

  const handleTaskCreated = (task: ChecklistTask) => {
    setTasks((current) => [...current, task]);
  };

  const handleTaskUpdated = (task: ChecklistTask) => {
    setTasks((current) => current.map((currentTask) => (currentTask.id === task.id ? task : currentTask)));
  };

  const tasksBySection = useMemo(() => {
    const filteredTasks = tasks.filter((task) => {
      if (selectedStatus === "open") {
        return !task.isCompleted;
      }

      if (selectedStatus === "completed") {
        return task.isCompleted;
      }

      return true;
    });

    return Object.fromEntries(
      CHECKLIST_SECTION_ORDER.map((section) => [
        section,
        filteredTasks.filter((task) => task.section === section),
      ]),
    ) as Record<ChecklistSectionKey, ChecklistTask[]>;
  }, [tasks, selectedStatus]);

  return {
    selectedStatus,
    handleStatusChange,
    handleToggleCompletion,
    handleDeleteTask,
    handleTaskCreated,
    handleTaskUpdated,
    tasksBySection,
  };
};

export default useChecklistPage;
