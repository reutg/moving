import { ChevronLeft } from "lucide-react";

import AiSearchContainer from "@/features/ai-search/components/ai-search-container";

import PageHeader from "@/components/ui/page-header";

const SearchPage = () => {
  return (
    <main className="min-h-full px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <PageHeader title="AI Search" backHref="/" icon={ChevronLeft} />
      <AiSearchContainer />
    </main>
  );
};

export default SearchPage;
