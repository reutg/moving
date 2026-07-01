import {
  createBox,
  CreateBoxInputSchema,
  listBoxes,
  ListBoxesQuerySchema,
} from "@/features/boxes/services/box-service";
import { withApi } from "@/lib/api/handler";

export const GET = withApi(async (request) => {
  const { searchParams } = new URL(request.url);
  const { moveId } = ListBoxesQuerySchema.parse({
    moveId: searchParams.get("moveId") ?? undefined,
  });

  return listBoxes(moveId);
});

export const POST = withApi(
  async (request) => {
    const body: unknown = await request.json().catch(() => ({}));
    const input = CreateBoxInputSchema.parse(body);
    return createBox(input);
  },
  { status: 201 },
);
