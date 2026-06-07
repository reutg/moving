export const BOX_STATUSES = ["packed", "unpacked"] as const;

export type BoxStatus = (typeof BOX_STATUSES)[number];

// Boxes are created as empty slots first (status "unpacked"), then transition
// to "packed" once their contents are filmed and the AI fills in the details.
export const DEFAULT_BOX_STATUS: BoxStatus = "unpacked";
