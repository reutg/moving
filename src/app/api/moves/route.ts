import { withApi } from "@/lib/api/handler";

import {
  createMove,
  CreateMoveInputSchema,
  listMoves,
} from "@/features/moves/services/move-service";

export const GET = withApi(async () => {
  return listMoves();
});

export const POST = withApi(
  async (request) => {
    const body: unknown = await request.json().catch(() => ({}));
    const input = CreateMoveInputSchema.parse(body);
    return createMove(input);
  },
  { status: 201 },
);
