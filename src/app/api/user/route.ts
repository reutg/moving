import { withApi } from "@/lib/api/handler";
import { badRequest, unauthorized } from "@/lib/errors";

import { auth, getCurrentUser } from "@/auth";
import {
  UpdateUserInputSchema,
  updateUser,
} from "@/features/users/services/user-service";

export const GET = withApi(async () => {
  const user = await getCurrentUser();
  if (!user) throw unauthorized();
  return user;
});

export const PATCH = withApi(async (request) => {
  const session = await auth();
  if (!session?.user?.id) throw unauthorized();

  const body = await request.json().catch(() => null);
  if (body === null) throw badRequest("Expected JSON body");

  if (typeof body === "object" && "email" in body) {
    throw badRequest("Email cannot be updated");
  }

  const input = UpdateUserInputSchema.parse(body);

  return updateUser(session.user.id, input);
});
