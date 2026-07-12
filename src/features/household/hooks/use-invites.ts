import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { ApiResponse } from "@/lib/api/response";

import { type InviteFormValues, InviteFormValuesSchema } from "../schemas/invite-schema";
import type {
  HouseholdInviteLink,
  HouseholdInviteSummary,
} from "../services/household-service";

const toastSuccessStyle = {
  backgroundColor: "var(--accent)",
  color: "var(--primary)",
};

const toastErrorStyle = {
  backgroundColor: "var(--destructive-border)",
  color: "var(--destructive)",
};

const showInviteErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-center",
    style: toastErrorStyle,
  });
};

const showInviteSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-center",
    style: toastSuccessStyle,
  });
};

const sendHouseholdInvite = async (email: string): Promise<ApiResponse<HouseholdInviteSummary>> => {
  const response = await fetch("/api/household/invites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return response.json();
};

const deleteHouseholdInvite = async (
  inviteId: string,
): Promise<ApiResponse<HouseholdInviteSummary>> => {
  const response = await fetch(`/api/household/invites/${inviteId}`, {
    method: "DELETE",
  });

  return response.json();
};

const createHouseholdInviteLink = async (): Promise<ApiResponse<HouseholdInviteLink>> => {
  const response = await fetch("/api/household/invites/link", {
    method: "POST",
  });

  return response.json();
};

const useInvites = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deletingInviteId, setDeletingInviteId] = useState<string | null>(null);
  const [isCopyingLink, setIsCopyingLink] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<InviteFormValues>({
    resolver: zodResolver(InviteFormValuesSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: InviteFormValues) => {
    setSubmitError(null);

    try {
      const json = await sendHouseholdInvite(values.email);

      if (!json.ok) {
        showInviteErrorToast(json.error.message);
        return;
      }

      reset();
      showInviteSuccessToast(`Invite sent to ${values.email}`);
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      }
    }
  };

  const deleteInvite = async (inviteId: string) => {
    setDeletingInviteId(inviteId);

    try {
      const json = await deleteHouseholdInvite(inviteId);

      if (!json.ok) {
        showInviteErrorToast(json.error.message);
        return;
      }

      showInviteSuccessToast("Invite deleted");
      router.refresh();
    } finally {
      setDeletingInviteId(null);
    }
  };

  const isExpired = (invite: HouseholdInviteSummary) => {
    return invite.expiresAt < new Date();
  };

  const copyInviteLink = async () => {
    setIsCopyingLink(true);

    try {
      const json = await createHouseholdInviteLink();

      if (!json.ok) {
        showInviteErrorToast(json.error.message);
        return;
      }

      await navigator.clipboard.writeText(json.data.inviteUrl);
      showInviteSuccessToast("Invite link copied to clipboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        showInviteErrorToast(error.message);
      }
    } finally {
      setIsCopyingLink(false);
    }
  };

  return {
    control,
    submit: handleSubmit(onSubmit),
    isSubmitting,
    submitError,
    deleteInvite,
    deletingInviteId,
    isExpired,
    copyInviteLink,
    isCopyingLink,
  };
};

export default useInvites;
