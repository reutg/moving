import { ChevronLeft } from "lucide-react";

import JoinWithLink from "@/features/welcome/components/join-with-link";

import PageHeader from "@/components/ui/page-header";

interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
  return (
    <main className="mx-auto flex min-h-full max-w-[960px] flex-col gap-[1.125rem] px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <PageHeader backHref="/welcome" icon={ChevronLeft} />
      <JoinWithLink />
    </main>
  );
};

export default Page;
