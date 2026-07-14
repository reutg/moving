import { COMMON_LOCATIONS, type CommonLocationKey } from "./common-locations";

export const ROOM_TYPES = Object.keys(COMMON_LOCATIONS) as [
  CommonLocationKey,
  ...CommonLocationKey[],
];

export type RoomType = (typeof ROOM_TYPES)[number];

export const DEFAULT_ROOM_TYPE: RoomType = "livingRoom";

export const ROOM_TYPE_LABELS: Record<RoomType, string> = COMMON_LOCATIONS;

export const BASE_ROOM_TYPES = ROOM_TYPES.filter((type) => type !== "other") as [
  Exclude<RoomType, "other">,
  ...Exclude<RoomType, "other">[],
];
