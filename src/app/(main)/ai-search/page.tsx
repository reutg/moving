import { ChevronLeft } from "lucide-react";

import AiSearchContainer from "@/features/ai-search/components/ai-search-container";

import PageHeader from "@/components/ui/page-header";

const SearchPage = () => {
  return (
    <main className="page-content">
      <PageHeader title="AI Search" backHref="/" icon={ChevronLeft} />
      <AiSearchContainer />
    </main>
  );
};

export default SearchPage;
