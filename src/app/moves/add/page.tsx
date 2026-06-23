"use client";

import PageHeader from "@/components/ui/page-header";
import MoveForm from "@/features/moves/components/move-form";
import { X } from "lucide-react";

const AddMovePage = () => {
  return (
    <main className="flex-container page-content">
      <PageHeader title="New move" backHref="/" icon={X} />
      <MoveForm />
    </main>
  );
};

export default AddMovePage;
