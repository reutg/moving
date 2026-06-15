import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

import { env } from "@/lib/env";

const ensureLocalDir = (url: string): void => {
  if (!url.startsWith("file:")) return;
  const path = url.replace(/^file:/, "");
  mkdirSync(dirname(path), { recursive: true });
};

const main = async () => {
  ensureLocalDir(env.DATABASE_URL);

  const client = createClient({
    url: env.DATABASE_URL,
    authToken: env.DATABASE_AUTH_TOKEN,
  });
  const db = drizzle(client);

  /* eslint-disable no-console */
  console.log(`Applying migrations to ${env.DATABASE_URL}…`);
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied.");
  /* eslint-enable no-console */

  client.close();
};

await main();
