import ScreenHeader from "@/components/ui/screen-header";
import SearchBox from "@/features/boxes/components/search-box";

const SearchPage = () => {
  return (
    <main className="page-content flex flex-col gap-4">
      <ScreenHeader title="Search" />
      <SearchBox />
    </main>
  );
};

export default SearchPage;
