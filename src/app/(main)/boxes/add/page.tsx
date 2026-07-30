"use client";

import { X } from "lucide-react";

import BoxForm from "@/features/boxes/components/box-form/box-form";

import PageHeader from "@/components/ui/page-header";

interface AddBoxPageProps {}

const AddBoxPage: React.FC<AddBoxPageProps> = ({}) => {
  return (
    <main className="mx-auto flex min-h-full max-w-[960px] flex-col gap-[1.125rem] px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <PageHeader title="New box" backHref="/" icon={X} />
      <BoxForm />
    </main>
  );
};

export default AddBoxPage;
