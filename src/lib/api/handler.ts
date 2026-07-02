import { type NextRequest, NextResponse } from "next/server";

import type { ApiSuccess } from "@/lib/api/response";
import { mapRouteError, serializeUnknownError } from "@/lib/api/map-route-error";
import { logger } from "@/lib/logger";

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
      const { status, body } = mapRouteError(err);

      if (status >= 500) {
        logger.error("Unhandled error in route handler", {
          error: serializeUnknownError(err),
        });
      }

      return NextResponse.json(body, { status });
    }
  };
}
