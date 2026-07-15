import {
  CHECKLIST_FILTERS,
  type ChecklistFilter,
  type ChecklistSectionKey,
} from "@/constants";

export const statusOptions: { label: string; value: ChecklistFilter }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Completed", value: "completed" },
];

export const checklistSectionTitles: Record<ChecklistSectionKey, string> = {
  beforeMoving: "Before Moving",
  movingDay: "Moving Day",
  afterMoving: "After Moving",
};

export const isChecklistFilter = (value: string): value is ChecklistFilter =>
  (CHECKLIST_FILTERS as readonly string[]).includes(value);
