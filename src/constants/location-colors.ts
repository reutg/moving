import type { CommonLocationKey } from "./common-locations";
import { COMMON_LOCATIONS } from "./common-locations";

const LOCATION_KEYS = Object.keys(COMMON_LOCATIONS) as CommonLocationKey[];

export const LOCATION_COLORS: Record<CommonLocationKey, string> = Object.fromEntries(
  LOCATION_KEYS.map((key) => [key, `var(--room-${key})`]),
) as Record<CommonLocationKey, string>;

export const LOCATION_ICON_TILE: Record<
  CommonLocationKey,
  { backgroundColor: string; iconColor: string }
> = Object.fromEntries(
  LOCATION_KEYS.map((key) => [
    key,
    {
      backgroundColor: `var(--room-${key})`,
      iconColor: "var(--primary-foreground)",
    },
  ]),
) as Record<CommonLocationKey, { backgroundColor: string; iconColor: string }>;

export const FALLBACK_LOCATION_COLOR = "var(--room-other)";

export const FALLBACK_LOCATION_ICON_TILE = {
  backgroundColor: "var(--room-other)",
  iconColor: "var(--primary-foreground)",
};
