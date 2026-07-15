export const CHECKLIST_SECTIONS = ["beforeMoving", "movingDay", "afterMoving"] as const;

export type ChecklistSectionKey = (typeof CHECKLIST_SECTIONS)[number];

export const DEFAULT_CHECKLIST_SECTION: ChecklistSectionKey = "beforeMoving";

export const CHECKLIST_FILTERS = ["all", "open", "completed"] as const;

export type ChecklistFilter = (typeof CHECKLIST_FILTERS)[number];

export const DEFAULT_CHECKLIST_FILTER: ChecklistFilter = "all";

export const CHECKLIST_SECTION_ORDER: ChecklistSectionKey[] = [
  "beforeMoving",
  "movingDay",
  "afterMoving",
];

export const DEFAULT_CHECKLIST_TASKS: ReadonlyArray<{
  title: string;
  section: ChecklistSectionKey;
}> = [
  { title: "Book movers", section: "beforeMoving" },
  { title: "Order packing supplies", section: "beforeMoving" },
  { title: "Transfer utilities", section: "beforeMoving" },
  { title: "Update mailing address", section: "beforeMoving" },
  { title: "Pack an essentials bag", section: "beforeMoving" },
  { title: "Print box labels", section: "beforeMoving" },
  { title: "Clean the apartment", section: "beforeMoving" },
  { title: "Take meter readings", section: "movingDay" },
  { title: "Do a final walkthrough", section: "movingDay" },
  { title: "Check every room", section: "movingDay" },
  { title: "Return apartment keys", section: "movingDay" },
  { title: "Unpack essentials", section: "afterMoving" },
  { title: "Update remaining addresses", section: "afterMoving" },
  { title: "Check that utilities are active", section: "afterMoving" },
  { title: "Dispose of empty boxes", section: "afterMoving" },
] as const;
