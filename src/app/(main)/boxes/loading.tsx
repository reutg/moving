import Spinner from "@/components/ui/spinner";
import ScreenHeader from "@/components/ui/screen-header";

export default function BoxesLoading() {
  return (
    <main className="page-content flex min-h-full flex-col gap-4">
      <ScreenHeader title="Boxes" />
      <Spinner />
    </main>
  );
}
