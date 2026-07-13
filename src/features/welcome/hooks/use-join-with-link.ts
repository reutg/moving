import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { ApiResponse } from "@/lib/api/response";

import type { HouseholdWithMembers } from "@/features/household/services/household-service";
import { extractInviteTokenFromLink } from "@/features/household/utils/extract-invite-token";

import type { JoinWithLinkValues } from "../schemas/join-with-link-schema";
import { JoinWithLinkSchema } from "../schemas/join-with-link-schema";

const toastSuccessStyle = {
  backgroundColor: "var(--accent)",
  color: "var(--primary)",
};

const toastErrorStyle = {
  backgroundColor: "var(--destructive-border)",
  color: "var(--destructive)",
};

const showErrorToast = (message: string) => {
  toast.error(message, {
    position: "top-center",
    style: toastErrorStyle,
  });
};

const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: "top-center",
    style: toastSuccessStyle,
  });
};

const acceptHouseholdInvite = async (
  token: string,
): Promise<ApiResponse<HouseholdWithMembers>> => {
  const response = await fetch("/api/household/invites/accept", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  return response.json();
};

const useJoinWithLink = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<JoinWithLinkValues>({
    resolver: zodResolver(JoinWithLinkSchema),
    defaultValues: { inviteLink: "" },
  });

  const onSubmit = async (values: JoinWithLinkValues) => {
    const token = extractInviteTokenFromLink(values.inviteLink);

    if (!token) {
      showErrorToast("This invite link is invalid");
      return;
    }

    try {
      const json = await acceptHouseholdInvite(token);

      if (!json.ok) {
        showErrorToast(json.error.message);
        return;
      }

      showSuccessToast(`You joined ${json.data.name}`);
      router.push("/household");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      }
    }
  };

  const submit = handleSubmit(onSubmit);

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setValue("inviteLink", text, { shouldValidate: true, shouldDirty: true });
  };

  return {
    control,
    submit,
    isSubmitting,
    handlePaste,
  };
};

export default useJoinWithLink;
