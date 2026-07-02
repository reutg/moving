import { z, ZodError } from "zod";

import type { ApiFailure } from "@/lib/api/response";
import { env } from "@/lib/env";
import { type AppError, isAppError } from "@/lib/errors";

type MappedRouteError = {
  status: number;
  body: ApiFailure;
};

const isAppErrorLike = (err: unknown): err is AppError => {
  if (isAppError(err)) {
    return true;
  }

  if (typeof err !== "object" || err === null) {
    return false;
  }

  const candidate = err as Record<string, unknown>;

  return (
    typeof candidate.code === "string" &&
    typeof candidate.httpStatus === "number" &&
    typeof candidate.message === "string"
  );
};

const getErrorMessage = (err: unknown): string | undefined => {
  let current: unknown = err;

  while (current instanceof Error) {
    if (current.message.trim().length > 0) {
      return current.message;
    }

    current = current.cause;
  }

  return undefined;
};

const formatZodError = (err: ZodError) => {
  const fieldErrors = z.flattenError(err).fieldErrors;
  const message =
    err.issues
      .map((issue) => issue.message)
      .filter(Boolean)
      .join(". ") || "Invalid input";

  return { message, fieldErrors };
};

export const mapRouteError = (err: unknown): MappedRouteError => {
  if (isAppErrorLike(err)) {
    return {
      status: err.httpStatus,
      body: {
        ok: false,
        error: {
          code: err.code,
          message: err.message,
        },
      },
    };
  }

  if (err instanceof ZodError) {
    const { message, fieldErrors } = formatZodError(err);

    return {
      status: 400,
      body: {
        ok: false,
        error: {
          code: "bad_request",
          message,
          details: fieldErrors,
        },
      },
    };
  }

  if (err instanceof Error && err.name === "LibsqlError") {
    return {
      status: 503,
      body: {
        ok: false,
        error: {
          code: "service_unavailable",
          message: err.message,
        },
      },
    };
  }

  const message = getErrorMessage(err);
  const isDev = env.NODE_ENV !== "production";

  return {
    status: 500,
    body: {
      ok: false,
      error: {
        code: "internal",
        message: message ?? "Internal server error",
        ...(isDev && err !== undefined
          ? {
              details: {
                name: err instanceof Error ? err.name : undefined,
                message,
                cause: err instanceof Error ? serializeError(err.cause) : undefined,
              },
            }
          : {}),
      },
    },
  };
};

const serializeError = (err: unknown): unknown => {
  if (err instanceof Error) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
      ...(err.cause !== undefined ? { cause: serializeError(err.cause) } : {}),
    };
  }

  return err;
};

export const serializeUnknownError = (err: unknown): unknown => serializeError(err);
