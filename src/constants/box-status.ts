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

export const BOX_STATUS_ICON_TILE: Record<
  BoxStatus,
  { backgroundColor: string; iconColor: string; labelColor: string }
> = {
  packed: {
    backgroundColor: "var(--status-packed-bg)",
    iconColor: "#5C9486",
    labelColor: "var(--status-packed)",
  },
  packing: {
    backgroundColor: "var(--status-packing-bg)",
    iconColor: "#B8933A",
    labelColor: "var(--status-packing)",
  },
};
