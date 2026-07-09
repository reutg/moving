import { HOUSEHOLD_INVITE_PATH } from "@/constants";
import { appUrl } from "@/lib/app-url";

export const buildInviteUrl = (token: string): string =>
  appUrl(`${HOUSEHOLD_INVITE_PATH}?token=${encodeURIComponent(token)}`);
