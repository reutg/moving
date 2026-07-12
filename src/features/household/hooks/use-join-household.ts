import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { ApiResponse } from "@/lib/api/response";

import type { HouseholdInviteSummary, HouseholdWithMembers } from "../services/household-service";

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

const postInviteAction = async <T>(path: string, token: string): Promise<ApiResponse<T>> => {
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  return response.json();
};

const useJoinHousehold = (token: string) => {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const acceptInvite = async () => {
    setIsAccepting(true);

    try {
      const json = await postInviteAction<HouseholdWithMembers>(
        "/api/household/invites/accept",
        token,
      );

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
    } finally {
      setIsAccepting(false);
    }
  };

  const declineInvite = async () => {
    setIsDeclining(true);

    try {
      const json = await postInviteAction<HouseholdInviteSummary>(
        "/api/household/invites/decline",
        token,
      );

      if (!json.ok) {
        showErrorToast(json.error.message);
        return;
      }

      showSuccessToast("Invite declined");
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      }
    } finally {
      setIsDeclining(false);
    }
  };

  return {
    acceptInvite,
    declineInvite,
    isAccepting,
    isDeclining,
  };
};

export default useJoinHousehold;
