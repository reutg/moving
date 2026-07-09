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

  // Auth.js v5 reads these conventionally-named env vars automatically.
  // We still validate them here so missing values fail loudly with a clear
  // error rather than via a confusing OAuth callback failure later.
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  AUTH_GOOGLE_ID: z.string().min(1, "AUTH_GOOGLE_ID is required"),
  AUTH_GOOGLE_SECRET: z.string().min(1, "AUTH_GOOGLE_SECRET is required"),

  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),

  SENDGRID_API_KEY: z.string().min(1).optional(),
  MAIL_FROM_EMAIL: z.string().min(1).optional(),
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
