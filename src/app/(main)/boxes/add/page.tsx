"use client";

import { X } from "lucide-react";

import BoxForm from "@/features/boxes/components/box-form/box-form";

import PageHeader from "@/components/ui/page-header";

interface AddBoxPageProps {}

const AddBoxPage: React.FC<AddBoxPageProps> = ({}) => {
  return (
    <main className="flex-container page-content">
      <PageHeader title="New box" backHref="/" icon={X} />
      <BoxForm />
    </main>
  );
};

export default AddBoxPage;
