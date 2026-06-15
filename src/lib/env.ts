import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // libSQL/Turso connection string. `file:` URLs work locally; in production
  // this should point at a hosted Turso DB (libsql://...). Same code path
  // either way — only the URL (and auth token) change between environments.
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .default("file:./data/moving.db"),

  // Auth token issued by Turso for the hosted DB. Not needed for local file
  // databases, which is why this is optional.
  DATABASE_AUTH_TOKEN: z.string().optional(),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  GEMINI_KEY: z.string().min(1, "GEMINI_KEY is required"),
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
