import { HOUSEHOLD_INVITE_TTL_MS } from "@/constants";

export type HouseholdInviteEmailData = {
  householdName: string;
  inviteUrl: string;
  inviterName: string | null;
};

const formatInviteExpiryDays = (): number =>
  Math.round(HOUSEHOLD_INVITE_TTL_MS / (24 * 60 * 60 * 1000));

export const buildHouseholdInviteEmail = ({
  householdName,
  inviteUrl,
  inviterName,
}: HouseholdInviteEmailData) => {
  const inviterLabel = inviterName?.trim() || "Someone";
  const expiryDays = formatInviteExpiryDays();

  return {
    subject: `Join ${householdName} on Moving on`,
    html: `
      <p>${inviterLabel} invited you to join <strong>${householdName}</strong> on Moving on.</p>
      <p><a href="${inviteUrl}">Accept invite</a></p>
      <p>This link expires in ${expiryDays} days.</p>
    `,
  };
};
