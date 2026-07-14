"use client";

import { useState } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { ApiResponse } from "@/lib/api/response";
import type { Room } from "@/lib/db/schema";

import {
  ADD_ROOM_QUERY_PARAM,
  ADD_ROOM_QUERY_VALUE,
} from "@/features/rooms/constants/add-room-query";

import { RoomTypeSchema, type RoomTypeValues } from "../schemas/room-type-schema";

const useRoomTypeSheet = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [editRoomId, setEditRoomId] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<RoomTypeValues>({
    resolver: zodResolver(RoomTypeSchema),
  });

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { isSubmitting },
  } = form;

  const isCreateOpen = searchParams.get(ADD_ROOM_QUERY_PARAM) === ADD_ROOM_QUERY_VALUE;
  const isEdit = editRoomId !== null;
  const isOpen = isCreateOpen || isEdit;
  const activeRoomId = editRoomId;

  const clearCreateParam = () => {
    if (!isCreateOpen) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete(ADD_ROOM_QUERY_PARAM);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const openCreate = () => {
    setEditRoomId(null);
    setSubmitError(null);
    reset();

    const params = new URLSearchParams(searchParams.toString());
    params.set(ADD_ROOM_QUERY_PARAM, ADD_ROOM_QUERY_VALUE);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const openEdit = (roomId: number) => {
    clearCreateParam();
    setSubmitError(null);
    setEditRoomId(roomId);
  };

  const close = () => {
    setEditRoomId(null);
    setSubmitError(null);
    reset();
    clearCreateParam();
  };

  const onOpenChange = (open: boolean) => {
    if (!open) {
      close();
    }
  };

  const onSubmit = async (values: RoomTypeValues) => {
    setSubmitError(null);

    try {
      const response = await fetch(isEdit ? `/api/rooms/${activeRoomId}` : "/api/rooms", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json: ApiResponse<Room> = await response.json();

      if (!json.ok) {
        if (json.error.message.toLowerCase().includes("already exists")) {
          setError("name", { message: json.error.message });
        }
        setSubmitError(json.error.message);
        return;
      }

      close();
      router.refresh();
    } catch (cause) {
      setSubmitError(cause instanceof Error ? cause.message : "Failed to save room.");
    }
  };

  const submit = handleSubmit(onSubmit);

  return {
    form,
    isOpen,
    isEdit,
    activeRoomId,
    openCreate,
    openEdit,
    onOpenChange,
    close,
    control,
    setValue,
    submit,
    isSubmitting,
    submitError,
  };
};

export default useRoomTypeSheet;
