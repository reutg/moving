"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Dialog from "@/components/dialog";
import { Button } from "@/components/ui/button";
import type { ApiResponse } from "@/lib/api/response";
import type { Box } from "@/lib/db/schema";

type DeleteBoxButtonProps = {
  box: Box;
};

const DeleteBoxButton = ({ box }: DeleteBoxButtonProps) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    setError(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    if (isDeleting) return;
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    setError(null);
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/boxes/${box.id}`, { method: "DELETE" });
      const json: ApiResponse<{ id: number }> = await response.json();
      if (!json.ok) {
        setError(json.error.message);
        setIsDeleting(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Failed to delete box.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button variant="destructive" onClick={openDialog}>
        <Trash2 />
        Delete box
      </Button>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <Dialog
        title={`Delete "${box.name}"?`}
        description="This action cannot be undone."
        actions={[
          {
            label: "Cancel",
            onClick: closeDialog,
            variant: "outline",
            disabled: isDeleting,
          },
          {
            label: isDeleting ? "Deleting…" : "Delete",
            icon: <Trash2 />,
            onClick: handleDelete,
            variant: "destructive",
            disabled: isDeleting,
          },
        ]}
        isOpen={isDialogOpen}
        onClose={closeDialog}
      />
    </>
  );
};

export default DeleteBoxButton;
