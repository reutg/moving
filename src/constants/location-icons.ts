import {
  Baby,
  Bed,
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
