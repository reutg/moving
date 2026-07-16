"use client";

import { CHECKLIST_SECTION_ORDER, type ChecklistSectionKey } from "@/constants";
import type { ChecklistTask } from "@/lib/db/schema";

import { SectionHeader } from "@/components/ui/text";

import ChecklistSection from "../checklist/components/checklist-section";

const UP_NEXT_LIMIT = 3;

type UpNextProps = {
  tasks: ChecklistTask[];
  moveDate?: Date;
};

const getStartingSection = (moveDate?: Date): ChecklistSectionKey => {
  if (!moveDate) {
    return "beforeMoving";
  }

  const today = new Date();

  if (moveDate.toDateString() === today.toDateString()) {
    return "movingDay";
  }

  if (moveDate < today) {
    return "afterMoving";
  }

  return "beforeMoving";
};

const getOpenTasksInSection = (
  tasks: ChecklistTask[],
  section: ChecklistSectionKey,
): ChecklistTask[] =>
  tasks
    .filter((task) => task.section === section && !task.isCompleted)
    .sort((left, right) => left.position - right.position);

const getUpNextTasks = (tasks: ChecklistTask[], startingSection: ChecklistSectionKey) => {
  const startingIndex = CHECKLIST_SECTION_ORDER.indexOf(startingSection);
  const sectionsAhead = CHECKLIST_SECTION_ORDER.slice(startingIndex);
  const upNextTasks: ChecklistTask[] = [];

  for (const section of sectionsAhead) {
    const remainingSlots = UP_NEXT_LIMIT - upNextTasks.length;
    if (remainingSlots <= 0) {
      break;
    }

    upNextTasks.push(...getOpenTasksInSection(tasks, section).slice(0, remainingSlots));
  }

  return upNextTasks;
};

const UpNext = ({ tasks, moveDate }: UpNextProps) => {
  const startingSection = getStartingSection(moveDate);
  const upNextTasks = getUpNextTasks(tasks, startingSection);

  if (upNextTasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <SectionHeader>Up next</SectionHeader>
      <ChecklistSection nameKey={startingSection} items={upNextTasks} mode="preview" />
    </div>
  );
};

export default UpNext;
