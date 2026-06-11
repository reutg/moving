import { type NextRequest, NextResponse } from "next/server";

import { z, ZodError } from "zod";

import type { ApiFailure, ApiSuccess } from "@/lib/api/response";
import { env } from "@/lib/env";
import { isAppError } from "@/lib/errors";
import { logger } from "@/lib/logger";

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

type RouteContext = unknown;
type HandlerFn<TCtx extends RouteContext, TData> = (
  request: NextRequest,
  context: TCtx,
) => Promise<TData> | TData;

type Options = {
  status?: number;
};

export function withApi<TCtx extends RouteContext, TData>(
  fn: HandlerFn<TCtx, TData>,
  options: Options = {},
) {
  return async (request: NextRequest, context: TCtx): Promise<NextResponse> => {
    try {
      const result = await fn(request, context);
      if (result instanceof Response) return result as unknown as NextResponse;

      const body: ApiSuccess<TData> = { ok: true, data: result };
      return NextResponse.json(body, { status: options.status ?? 200 });
    } catch (err) {
      if (isAppError(err)) {
        const body: ApiFailure = {
          ok: false,
          error: { code: err.code, message: err.message },
        };
        return NextResponse.json(body, { status: err.httpStatus });
      }

      if (err instanceof ZodError) {
        const body: ApiFailure = {
          ok: false,
          error: {
            code: "bad_request",
            message: "Invalid input",
            details: z.flattenError(err).fieldErrors,
          },
        };
        return NextResponse.json(body, { status: 400 });
      }

      const serialized = serializeError(err);
      logger.error("Unhandled error in route handler", { error: serialized });

      const isDev = env.NODE_ENV !== "production";
      const body: ApiFailure = {
        ok: false,
        error: {
          code: "internal",
          message: isDev && err instanceof Error ? err.message : "Internal server error",
          ...(isDev ? { details: serialized } : {}),
        },
      };
      return NextResponse.json(body, { status: 500 });
    }
  };
}
