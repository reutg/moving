import Spinner from "@/components/ui/spinner";
import ScreenHeader from "@/components/ui/screen-header";

export default function BoxesLoading() {
  return (
    <main className="flex min-h-full flex-col gap-4 px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <ScreenHeader title="Boxes" />
      <Spinner />
    </main>
  );
}
