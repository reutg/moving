import { HOUSEHOLD_INVITE_PATH } from "@/constants";

export const extractInviteTokenFromLink = (inviteLink: string): string | null => {
  try {
    const url = new URL(inviteLink.trim());
    const invitePathPrefix = `${HOUSEHOLD_INVITE_PATH}/`;
    const pathIndex = url.pathname.indexOf(invitePathPrefix);

    if (pathIndex !== -1) {
      const tokenSegment = url.pathname.slice(pathIndex + invitePathPrefix.length).split("/")[0];
      if (tokenSegment) {
        return decodeURIComponent(tokenSegment);
      }
    }

    const queryToken = url.searchParams.get("token");
    if (queryToken) {
      return queryToken.trim() || null;
    }

    return null;
  } catch {
    return null;
  }
};
