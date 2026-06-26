export const MOVE_STATUSES = ["active", "done"] as const;

export type MoveStatus = (typeof MOVE_STATUSES)[number];

export const DEFAULT_MOVE_STATUS: MoveStatus = "active";

export const DONE_MOVE_STATUS: MoveStatus = "done";

export const MOVE_STATUS_LABELS: Record<MoveStatus, string> = {
  active: "Active",
  done: "Done",
};
