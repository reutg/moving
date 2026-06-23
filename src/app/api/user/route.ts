import { withApi } from "@/lib/api/handler";
import { unauthorized } from "@/lib/errors";

import { getCurrentUser } from "@/auth";

export const GET = withApi(async () => {
  const user = await getCurrentUser();
  if (!user) throw unauthorized();
  return user;
});
