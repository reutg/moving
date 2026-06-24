"use client";

import BoxForm from "@/features/boxes/components/box-form";
import { X } from "lucide-react";
import Chip from "@/components/ui/chip";
import PageHeader from "@/components/ui/page-header";

interface AddBoxPageProps {}

const AddBoxPage: React.FC<AddBoxPageProps> = ({}) => {
  return (
    <main className="flex-container page-content">
      <PageHeader title="New box" backHref="/" icon={X} trailing={<Chip label="Box #54" />} />
      <BoxForm />
    </main>
  );
};

export default AddBoxPage;
