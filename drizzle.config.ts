import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL ?? "file:./data/moving.db";
const dbPath = databaseUrl.replace(/^file:/, "");

export default defineConfig({
  dialect: "sqlite",
  schema: "./src/lib/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: dbPath,
  },
  strict: true,
  verbose: true,
});
