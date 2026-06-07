import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { env } from "@/lib/env";

function main() {
  const dbPath = env.DATABASE_URL.replace(/^file:/, "");
  mkdirSync(dirname(dbPath), { recursive: true });

  const sqlite = new Database(dbPath);
  sqlite.pragma("foreign_keys = ON");
  sqlite.pragma("journal_mode = WAL");

  const db = drizzle(sqlite);

  // CLI script — stdout progress messages are intentional.
  /* eslint-disable no-console */
  console.log(`Applying migrations to ${dbPath}…`);
  migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied.");
  /* eslint-enable no-console */

  sqlite.close();
}

main();
