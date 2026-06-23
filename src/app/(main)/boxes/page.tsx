import ScreenHeader from "@/components/ui/screen-header";
import ListPage from "@/features/boxes/components/list/list-page";

const BoxesPage = () => {
  return (
    <main className="page-content flex flex-col gap-4">
      <ScreenHeader title="Boxes" />
      <ListPage />
    </main>
  );
};

export default BoxesPage;
