export const COMMON_LOCATIONS = {
  livingRoom: "Living Room",
  kitchen: "Kitchen",
  bedroom: "Bedroom",
  bathroom: "Bathroom",
  office: "Office",
  kidsRoom: "Kids' Room",
  laundryRoom: "Laundry Room",
  garage: "Garage",
  other: "Custom",
} as const;

export type CommonLocationKey = keyof typeof COMMON_LOCATIONS;
export type CommonLocation = (typeof COMMON_LOCATIONS)[CommonLocationKey];

const isLocationKey = (value: string): value is CommonLocationKey =>
  Object.prototype.hasOwnProperty.call(COMMON_LOCATIONS, value);

export const getLocationKeyByName = (name: string): CommonLocationKey | null => {
  if (isLocationKey(name)) return name;

  const match = (Object.entries(COMMON_LOCATIONS) as [CommonLocationKey, CommonLocation][]).find(
    ([, label]) => label === name,
  );
  return match ? match[0] : null;
};
