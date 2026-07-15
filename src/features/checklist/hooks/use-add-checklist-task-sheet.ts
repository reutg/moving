"use client";

import { useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { CHECKLIST_SECTIONS, type ChecklistSectionKey } from "@/constants";
import type { ChecklistTask } from "@/lib/db/schema";

import {
  ADD_TASK_QUERY_PARAM,
  ADD_TASK_QUERY_VALUE,
  ADD_TASK_SECTION_QUERY_PARAM,
} from "../constants/add-task-query";

const parseSectionParam = (value: string | null): ChecklistSectionKey | null => {
  if (!value) {
    return null;
  }

  return (CHECKLIST_SECTIONS as readonly string[]).includes(value)
    ? (value as ChecklistSectionKey)
    : null;
};

const useAddChecklistTaskSheet = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sectionOnOpen, setSectionOnOpen] = useState<ChecklistSectionKey | null>(null);
  const [editingTask, setEditingTask] = useState<ChecklistTask | null>(null);

  const isCreateOpen = searchParams.get(ADD_TASK_QUERY_PARAM) === ADD_TASK_QUERY_VALUE;
  const sectionFromUrl = parseSectionParam(searchParams.get(ADD_TASK_SECTION_QUERY_PARAM));
  const section = editingTask?.section ?? sectionOnOpen ?? sectionFromUrl;
  const isOpen = isCreateOpen || editingTask !== null;
  const isEdit = editingTask !== null;

  const clearParams = () => {
    if (!isCreateOpen && sectionFromUrl === null) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete(ADD_TASK_QUERY_PARAM);
    params.delete(ADD_TASK_SECTION_QUERY_PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const open = (sectionKey?: ChecklistSectionKey) => {
    setEditingTask(null);
    setSectionOnOpen(sectionKey ?? null);

    const params = new URLSearchParams(searchParams.toString());
    params.set(ADD_TASK_QUERY_PARAM, ADD_TASK_QUERY_VALUE);

    if (sectionKey) {
      params.set(ADD_TASK_SECTION_QUERY_PARAM, sectionKey);
    } else {
      params.delete(ADD_TASK_SECTION_QUERY_PARAM);
    }

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const openEdit = (task: ChecklistTask) => {
    clearParams();
    setSectionOnOpen(null);
    setEditingTask(task);
  };

  const close = () => {
    setEditingTask(null);
    setSectionOnOpen(null);
    clearParams();
  };

  const onOpenChange = (openState: boolean) => {
    if (!openState) {
      close();
    }
  };

  return {
    isOpen,
    isEdit,
    section,
    editingTask,
    open,
    openEdit,
    close,
    onOpenChange,
  };
};

export default useAddChecklistTaskSheet;
