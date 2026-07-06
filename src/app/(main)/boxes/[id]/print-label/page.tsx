import PageHeader from "@/components/ui/page-header";
import { getBoxById } from "@/features/boxes/services/box-service";
import { ChevronLeft } from "lucide-react";
import LabelPreview from "@/features/boxes/components/label/label-preview";
import LabelContainer from "@/features/boxes/components/label/label-container";

type PrintLabelPageProps = {
  params: Promise<{ id: number }>;
};

const PrintLabelPage = async ({ params }: PrintLabelPageProps) => {
  const { id } = await params;
  const box = await getBoxById(id);

  return (
    <main className="page-content flex flex-col gap-4">
      <PageHeader title="Print Label" backHref={`/boxes/${id}/preview`} icon={ChevronLeft} />

      <LabelContainer box={box} />
    </main>
  );
};

export default PrintLabelPage;
