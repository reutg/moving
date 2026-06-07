export const BOX_PRIORITIES = [
  "essential",
  "soon",
  "normal",
  "later",
] as const;

export type BoxPriority = (typeof BOX_PRIORITIES)[number];

export const DEFAULT_BOX_PRIORITY: BoxPriority = "normal";
