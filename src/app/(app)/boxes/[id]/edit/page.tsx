import BoxForm from "@/features/boxes/components/box-form";
import { getBoxById } from "@/features/boxes/services/box-service";

type EditBoxPageProps = {
  params: Promise<{ id: string }>;
};

const EditBoxPage = async ({ params }: EditBoxPageProps) => {
  const { id } = await params;
  const box = await getBoxById(Number(id));

  return <BoxForm box={box} />;
};

export default EditBoxPage;
