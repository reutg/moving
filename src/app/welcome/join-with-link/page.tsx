import { ChevronLeft } from "lucide-react";

import JoinWithLink from "@/features/welcome/components/join-with-link";

import PageHeader from "@/components/ui/page-header";

interface PageProps {}

const Page: React.FC<PageProps> = ({}) => {
  return (
    <main className="flex-container page-content">
      <PageHeader backHref="/welcome" icon={ChevronLeft} />
      <JoinWithLink />
    </main>
  );
};

export default Page;
