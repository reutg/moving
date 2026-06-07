import "server-only";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { env } from "@/lib/env";
import * as schema from "@/lib/db/schema";

type DrizzleClient = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  // eslint-disable-next-line no-var
  var __dbClient: DrizzleClient | undefined;
}

function createClient(): DrizzleClient {
  const dbPath = env.DATABASE_URL.replace(/^file:/, "");
  mkdirSync(dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath);
  // Foreign keys are off by default in SQLite. Always on for this app.
  sqlite.pragma("foreign_keys = ON");
  // WAL gives better concurrency for read-heavy workloads with the occasional write.
  sqlite.pragma("journal_mode = WAL");

  return drizzle(sqlite, { schema });
}

export const db: DrizzleClient =
  globalThis.__dbClient ?? (globalThis.__dbClient = createClient());
