import "server-only";

import sgMail from "@sendgrid/mail";

import { env } from "@/lib/env";
import { serviceUnavailable } from "@/lib/errors";

let isConfigured = false;

export const getSendGridClient = (): typeof sgMail => {
  if (!env.SENDGRID_API_KEY) {
    throw serviceUnavailable("SENDGRID_API_KEY is not configured");
  }

  if (!isConfigured) {
    sgMail.setApiKey(env.SENDGRID_API_KEY);
    isConfigured = true;
  }

  return sgMail;
};
