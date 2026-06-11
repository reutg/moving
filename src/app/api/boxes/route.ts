import { withApi } from "@/lib/api/handler";

import {
  createBox,
  CreateBoxInputSchema,
  listBoxes,
} from "@/features/boxes/services/box-service";

export const GET = withApi(async () => {
  return listBoxes();
});

export const POST = withApi(
  async (request) => {
    const body: unknown = await request.json().catch(() => ({}));
    const input = CreateBoxInputSchema.parse(body);
    return createBox(input);
  },
  { status: 201 },
);
