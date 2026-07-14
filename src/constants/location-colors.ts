import type { CommonLocationKey } from "./common-locations";

export const LOCATION_COLORS: Record<CommonLocationKey, string> = {
  kitchen: "#2F6F62",
  office: "#2F6F62",
  bedroom: "#7993E6",
  livingRoom: "#D69066",
  garage: "#C4A144",
  bathroom: "#4FA3A0",
  kidsRoom: "#D97A8C",
  laundryRoom: "#5B8FC7",
  other: "#8B8F97",
};

export const LOCATION_ICON_TILE: Record<
  CommonLocationKey,
  { backgroundColor: string; iconColor: string }
> = {
  kitchen: {
    backgroundColor: "#DCEEE8",
    iconColor: "#5C9486",
  },
  office: {
    backgroundColor: "#DCEEE8",
    iconColor: "#5C9486",
  },
  bedroom: {
    backgroundColor: "#E4E9F9",
    iconColor: "#7993E6",
  },
  livingRoom: {
    backgroundColor: "#F7E9E1",
    iconColor: "#D69066",
  },
  garage: {
    backgroundColor: "#F3EDDA",
    iconColor: "#C4A144",
  },
  bathroom: {
    backgroundColor: "#E0F5F4",
    iconColor: "#4FA3A0",
  },
  kidsRoom: {
    backgroundColor: "#FCE4EA",
    iconColor: "#D97A8C",
  },
  laundryRoom: {
    backgroundColor: "#E3EEF8",
    iconColor: "#5B8FC7",
  },
  other: {
    backgroundColor: "#ECEDEF",
    iconColor: "#8B8F97",
  },
};

export const FALLBACK_LOCATION_COLOR = "#718096";

export const FALLBACK_LOCATION_ICON_TILE = {
  backgroundColor: "#F1F5F9",
  iconColor: FALLBACK_LOCATION_COLOR,
};
