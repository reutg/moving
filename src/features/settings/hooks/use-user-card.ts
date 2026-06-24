"use client";

import type { User } from "next-auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { ApiResponse } from "@/lib/api/response";
import { getUserInitials } from "@/lib/app-utils";

import type { CurrentUser } from "@/features/users/services/user-service";

export const useUserCard = (user: User) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [nameValue, setNameValue] = useState(user.name);

  const initials = getUserInitials(user);
  const { name, image } = user;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setNameValue(user.name);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nameValue }),
      });
      const json: ApiResponse<CurrentUser> = await response.json();

      if (!json.ok) {
        return;
      }

      setIsEditing(false);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isEditing,
    isSaving,
    nameValue,
    setNameValue,
    handleEdit,
    cancelEdit,
    handleSave,
    initials,
    name,
    image,
  };
};
