import {
  SetCurrentMoveInputSchema,
  setCurrentMove,
} from "@/features/moves/services/move-service";
import { withApi } from "@/lib/api/handler";
import { badRequest } from "@/lib/errors";

export const PATCH = withApi(async (request) => {
  const body = await request.json().catch(() => null);
  if (body === null) throw badRequest("Expected JSON body");

  const input = SetCurrentMoveInputSchema.parse(body);
  return setCurrentMove(input.moveId);
});
