import {
  Baby,
  Bed,
  Box,
  Briefcase,
  CookingPot,
  Sofa,
  Toilet,
  Warehouse,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";

import type { CommonLocationKey } from "./common-locations";

export const LOCATION_ICONS: Record<CommonLocationKey, LucideIcon | null> = {
  livingRoom: Sofa,
  kitchen: CookingPot,
  bedroom: Bed,
  bathroom: Toilet,
  office: Briefcase,
  kidsRoom: Baby,
  laundryRoom: WashingMachine,
  garage: Warehouse,
};

// Used wherever a location icon may be missing — e.g. legacy rooms in the
// DB that aren't in COMMON_LOCATIONS, or new keys added to COMMON_LOCATIONS
// without an icon yet. Matches the existing visual fallback (Box).
export const FALLBACK_LOCATION_ICON: LucideIcon = Box;
