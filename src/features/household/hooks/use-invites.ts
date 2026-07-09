import { useState } from "react";

import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { ApiResponse } from "@/lib/api/response";

import { type InviteFormValues, InviteFormValuesSchema } from "../schemas/invite-schema";
import type { HouseholdInviteSummary } from "../services/household-service";

const toastSuccessStyle = {
  backgroundColor: "var(--accent)",
  color: "var(--primary)",
};

const toastErrorStyle = {
  backgroundColor: "var(--destructive-border)",
  color: "var(--destructive)",
};

const useInvites = () => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deletingInviteId, setDeletingInviteId] = useState<string | null>(null);
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
      const response = await fetch("/api/household/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      const json: ApiResponse<HouseholdInviteSummary> = await response.json();

      if (!json.ok) {
        toast.error(json.error.message, {
          position: "top-center",
          style: toastErrorStyle,
        });
        return;
      }

      reset();
      toast.success(`Invite sent to ${values.email}`, {
        position: "top-center",
        style: toastSuccessStyle,
      });
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
      const response = await fetch(`/api/household/invites/${inviteId}`, {
        method: "DELETE",
      });
      const json: ApiResponse<HouseholdInviteSummary> = await response.json();

      if (!json.ok) {
        toast.error(json.error.message, {
          position: "top-center",
          style: toastErrorStyle,
        });
        return;
      }

      toast.success("Invite deleted", {
        position: "top-center",
        style: toastSuccessStyle,
      });
      router.refresh();
    } finally {
      setDeletingInviteId(null);
    }
  };

  const submit = handleSubmit(onSubmit);

  return { control, submit, isSubmitting, submitError, deleteInvite, deletingInviteId };
};

export default useInvites;
