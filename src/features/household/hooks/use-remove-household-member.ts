"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import type { ApiResponse } from "@/lib/api/response";

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

const useRemoveHouseholdMember = () => {
  const router = useRouter();
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  const removeMember = async (userId: string) => {
    setRemovingUserId(userId);

    try {
      const response = await fetch(`/api/household/members/${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });
      const json: ApiResponse<{ userId: string }> = await response.json();

      if (!json.ok) {
        showErrorToast(json.error.message);
        return;
      }

      showSuccessToast("Member removed");
      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showErrorToast(error.message);
      }
    } finally {
      setRemovingUserId(null);
    }
  };

  return {
    removeMember,
    removingUserId,
  };
};

export default useRemoveHouseholdMember;
