import "server-only";

import {
  buildHouseholdInviteEmail,
  type HouseholdInviteEmailData,
} from "@/lib/email/messages/household-invite";
import { getSendGridClient } from "@/lib/email/sendgrid";
import { env } from "@/lib/env";
import { badRequest, internal, serviceUnavailable } from "@/lib/errors";
import { logger } from "@/lib/logger";

export const MAIL_MESSAGE_TYPES = ["household_invite"] as const;

export type MailMessageType = (typeof MAIL_MESSAGE_TYPES)[number];

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  messageType: MailMessageType;
};

type SendGridError = {
  message?: string;
  response?: {
    statusCode?: number;
    body?: {
      errors?: { message: string }[];
    };
  };
};

const asSendGridError = (error: unknown): SendGridError | null => {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  return error as SendGridError;
};

const getSendGridErrorMessage = (error: unknown): string => {
  const candidate = asSendGridError(error);
  if (!candidate) {
    return "Failed to send email";
  }

  return candidate.response?.body?.errors?.[0]?.message ?? candidate.message ?? "Failed to send email";
};

const getSendGridStatusCode = (error: unknown): number | undefined =>
  asSendGridError(error)?.response?.statusCode;

const sendEmail = async ({ to, subject, html, messageType }: SendEmailInput): Promise<void> => {
  if (!env.MAIL_FROM_EMAIL) {
    throw serviceUnavailable("MAIL_FROM_EMAIL is not configured");
  }

  try {
    await getSendGridClient().send({
      to,
      from: env.MAIL_FROM_EMAIL,
      subject,
      html,
    });
  } catch (error: unknown) {
    logger.error("Failed to send email", { to, messageType, error });

    const statusCode = getSendGridStatusCode(error);
    const message = getSendGridErrorMessage(error);

    if (statusCode && statusCode >= 400 && statusCode < 500) {
      throw badRequest(message);
    }

    throw internal(message, error);
  }
};

export type SendHouseholdInviteEmailInput = HouseholdInviteEmailData & {
  to: string;
};

export const sendHouseholdInviteEmail = async ({
  to,
  ...data
}: SendHouseholdInviteEmailInput): Promise<void> => {
  const { subject, html } = buildHouseholdInviteEmail(data);

  await sendEmail({
    to,
    subject,
    html,
    messageType: "household_invite",
  });
};
