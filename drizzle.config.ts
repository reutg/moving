import { defineConfig } from "drizzle-kit";

const databaseUrl = process.env.DATABASE_URL ?? "file:./data/moving.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

export default defineConfig({
  dialect: "turso",
  schema: "./src/lib/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: databaseUrl,
    authToken,
  },
  strict: true,
  verbose: true,
});
