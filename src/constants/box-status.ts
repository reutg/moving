import { PackageOpen, CircleCheckBig, LucideIcon } from "lucide-react";

export const BOX_STATUSES = ["packing", "packed"] as const;

export type BoxStatus = (typeof BOX_STATUSES)[number];

export const DEFAULT_BOX_STATUS: BoxStatus = "packing";

export const BOX_STATUS_LABELS: Record<BoxStatus, string> = {
  packed: "Packed",
  packing: "Packing",
};

export const BOX_STATUS_ICONS: Record<BoxStatus, LucideIcon> = {
  packed: CircleCheckBig,
  packing: PackageOpen,
};
