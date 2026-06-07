import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // SQLite path. Accepts the `file:` prefix used by libSQL/Turso for forward
  // compatibility; we strip it before handing the path to better-sqlite3.
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .default("file:./data/moving.db"),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid environment variables:",
    z.flattenError(parsed.error).fieldErrors,
  );
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

export type Env = typeof env;
