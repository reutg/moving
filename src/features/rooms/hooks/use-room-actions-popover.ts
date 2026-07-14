"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import type { ApiResponse } from "@/lib/api/response";

const useRoomActionsPopover = () => {
  const router = useRouter();
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOpen = (roomId: number) => activeRoomId === roomId;

  const onOpenChange = (roomId: number) => (open: boolean) => {
    if (isDeleting) return;
    setActiveRoomId(open ? roomId : null);
  };

  const close = () => {
    if (isDeleting) return;
    setActiveRoomId(null);
  };

  const onDelete = async (roomId: number) => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
      const json: ApiResponse<{ id: number }> = await response.json();

      if (!json.ok) {
        return;
      }

      setActiveRoomId(null);
      router.refresh();
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    activeRoomId,
    isOpen,
    onOpenChange,
    close,
    onDelete,
    isDeleting,
  };
};

export default useRoomActionsPopover;
