import Link from "next/link";

import { ChevronLeft } from "lucide-react";

type PageHeaderProps = {
  title: string;
};

const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <header className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center">
      <Link
        href="/"
        className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 text-sm transition-colors"
        aria-label="Back to home"
      >
        <ChevronLeft size={20} aria-hidden />
      </Link>
      <h1 className="text-md font-semibold">{title}</h1>
      <div />
    </header>
  );
};

export default PageHeader;
