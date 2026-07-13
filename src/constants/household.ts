export const HOUSEHOLD_ROLES = ["owner", "member"] as const;

export type HouseholdRole = (typeof HOUSEHOLD_ROLES)[number];

export const DEFAULT_HOUSEHOLD_ROLE: HouseholdRole = "member";

export const OWNER_HOUSEHOLD_ROLE: HouseholdRole = "owner";

export const HOUSEHOLD_INVITE_STATUSES = ["pending", "accepted", "revoked"] as const;

export type HouseholdInviteStatus = (typeof HOUSEHOLD_INVITE_STATUSES)[number];

export const DEFAULT_HOUSEHOLD_INVITE_STATUS: HouseholdInviteStatus = "pending";

/** Invite links expire 5 days after creation. */
export const HOUSEHOLD_INVITE_TTL_MS = 5 * 24 * 60 * 60 * 1000;

export const HOUSEHOLD_INVITE_PATH = "/join";
