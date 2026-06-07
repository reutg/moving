import { env } from "@/lib/env";

const LEVELS = ["debug", "info", "warn", "error"] as const;
type Level = (typeof LEVELS)[number];

const threshold = LEVELS.indexOf(env.LOG_LEVEL);

function emit(level: Level, message: string, payload?: unknown) {
  if (LEVELS.indexOf(level) < threshold) return;

  const line = {
    level,
    time: new Date().toISOString(),
    message,
    ...(payload && typeof payload === "object" ? payload : { payload }),
  };

  const out = level === "error" || level === "warn" ? console.error : console.log;
  out(JSON.stringify(line));
}

export const logger = {
  debug: (msg: string, payload?: unknown) => emit("debug", msg, payload),
  info: (msg: string, payload?: unknown) => emit("info", msg, payload),
  warn: (msg: string, payload?: unknown) => emit("warn", msg, payload),
  error: (msg: string, payload?: unknown) => emit("error", msg, payload),
};
