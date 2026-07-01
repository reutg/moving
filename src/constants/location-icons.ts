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

export const FALLBACK_LOCATION_ICON: LucideIcon = Box;
