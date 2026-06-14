"use client";

import Link from "next/link";

import { ChevronLeft } from "lucide-react";
import { Button } from "./ui/button";
import { useParams } from "next/navigation";

type PageHeaderProps = {
  title: string;
  showEdit?: boolean;
};

const PageHeader = ({ title, showEdit }: PageHeaderProps) => {
  const { id } = useParams();
  return (
    <header className="grid grid-cols-[1fr_auto_1fr] items-center pb-6">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 justify-self-start text-sm transition-colors"
        aria-label="Back to home"
      >
        <ChevronLeft size={20} aria-hidden />
      </Link>
      <h1 className="text-md justify-self-center font-semibold">{title}</h1>
      <div className="justify-self-end">
        {showEdit ? (
          <Button
            variant="ghost"
            nativeButton={false}
            render={<Link href={`/boxes/${id}/edit`} />}
          >
            Edit
          </Button>
        ) : null}
      </div>
    </header>
  );
};

export default PageHeader;
