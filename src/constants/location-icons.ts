import {
  Baby,
  Bed,
  Box,
  Briefcase,
  CookingPot,
  type LucideIcon,
  Sofa,
  SquarePen,
  Toilet,
  Warehouse,
  WashingMachine,
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
  other: SquarePen,
};

export const FALLBACK_LOCATION_ICON: LucideIcon = Box;
