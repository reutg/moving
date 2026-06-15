import "server-only";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import * as schema from "@/lib/db/schema";
import { env } from "@/lib/env";

type DrizzleClient = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  var __dbClient: DrizzleClient | undefined;
}

// libsql accepts both `file:./path.db` (local SQLite file) and `libsql://...`
// (hosted Turso). For local file URLs we make sure the parent directory exists
// before opening the connection.
const ensureLocalDir = (url: string): void => {
  if (!url.startsWith("file:")) return;
  const path = url.replace(/^file:/, "");
  mkdirSync(dirname(path), { recursive: true });
};

const createDbClient = (): DrizzleClient => {
  ensureLocalDir(env.DATABASE_URL);

  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });

  return drizzle(client, { schema });
};

export const db: DrizzleClient =
  globalThis.__dbClient ?? (globalThis.__dbClient = createDbClient());
