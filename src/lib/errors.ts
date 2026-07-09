/**
 * Domain-aware error. Anything thrown as an `AppError` is mapped by the API
 * handler to a structured JSON response with the carried `httpStatus` and
 * `code`. Anything thrown as a plain `Error` is treated as an unexpected
 * 500 and logged with its stack.
 */
export class AppError extends Error {
  readonly code: string;
  readonly httpStatus: number;

  constructor(opts: {
    code: string;
    httpStatus: number;
    message: string;
    cause?: unknown;
  }) {
    super(opts.message, { cause: opts.cause });
    this.name = "AppError";
    this.code = opts.code;
    this.httpStatus = opts.httpStatus;
  }
}

export function isAppError(e: unknown): e is AppError {
  return e instanceof AppError;
}

export function badRequest(message: string, cause?: unknown): AppError {
  return new AppError({
    code: "bad_request",
    httpStatus: 400,
    message,
    cause,
  });
}

export function notFound(message: string, cause?: unknown): AppError {
  return new AppError({ code: "not_found", httpStatus: 404, message, cause });
}

export function unauthorized(message = "Unauthorized"): AppError {
  return new AppError({ code: "unauthorized", httpStatus: 401, message });
}

export function forbidden(message = "Forbidden"): AppError {
  return new AppError({ code: "forbidden", httpStatus: 403, message });
}

export function internal(message: string, cause?: unknown): AppError {
  return new AppError({ code: "internal", httpStatus: 500, message, cause });
}

export function serviceUnavailable(message: string, cause?: unknown): AppError {
  return new AppError({
    code: "service_unavailable",
    httpStatus: 503,
    message,
    cause,
  });
}
